/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../base/common/lifecycle.js';
import { IConfigurationService } from '../../platform/configuration/common/configuration.js';
import { IThemeService } from '../../platform/theme/common/themeService.js';
import { IWorkbenchContribution } from '../common/contributions.js';
import { WORKBENCH_BACKGROUND } from '../common/theme.js';
import { mainWindow } from '../../base/browser/window.js';

export class WindowTransparencyService extends Disposable implements IWorkbenchContribution {
	static readonly ID = 'workbench.contrib.windowTransparency';

	private transparencyEnabled: boolean = false;
	private opacity: number = 0.8;
	private blurRadius: number = 5;

	constructor(
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IThemeService private readonly themeService: IThemeService
	) {
		super();

		this.updateSettings();
		this.applyTransparencyStyles();

		// Listen for configuration changes
		this._register(this.configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('window.experimental.transparency')) {
				this.updateSettings();
				this.applyTransparencyStyles();
			}
		}));

		// Listen for theme changes
		this._register(this.themeService.onDidColorThemeChange(() => {
			if (this.transparencyEnabled) {
				this.applyTransparencyStyles();
			}
		}));
	}

	private updateSettings(): void {
		this.transparencyEnabled = this.configurationService.getValue<boolean>('window.experimental.transparency.enabled') ?? false;
		this.opacity = this.configurationService.getValue<number>('window.experimental.transparency.opacity') ?? 0.8;
		this.blurRadius = this.configurationService.getValue<number>('window.experimental.transparency.blur') ?? 5;
	}

	private applyTransparencyStyles(): void {
		if (!this.transparencyEnabled) {
			this.removeTransparencyStyles();
			return;
		}

		const workbenchBackground = WORKBENCH_BACKGROUND(this.themeService.getColorTheme());
		let transparentBackground = workbenchBackground.toString();

		// Convert background color to transparent version
		if (transparentBackground.startsWith('rgb(')) {
			transparentBackground = transparentBackground.replace('rgb(', 'rgba(').replace(')', `, ${this.opacity})`);
		} else if (transparentBackground.startsWith('#')) {
			// Convert hex to rgba
			const r = parseInt(transparentBackground.slice(1, 3), 16);
			const g = parseInt(transparentBackground.slice(3, 5), 16);
			const b = parseInt(transparentBackground.slice(5, 7), 16);
			transparentBackground = `rgba(${r}, ${g}, ${b}, ${this.opacity})`;
		} else {
			// Fallback to semi-transparent dark color
			transparentBackground = `rgba(30, 30, 30, ${this.opacity})`;
		}

		// Create or update stylesheet
		this.createOrUpdateStyleSheet(transparentBackground);
	}

	private createOrUpdateStyleSheet(transparentBackground: string): void {
		const styleId = 'window-transparency-styles';
		let style = mainWindow.document.getElementById(styleId) as HTMLStyleElement;

		if (!style) {
			style = mainWindow.document.createElement('style');
			style.id = styleId;
			mainWindow.document.head.appendChild(style);
		}

		style.textContent = `
			.monaco-workbench {
				background-color: ${transparentBackground} !important;
				backdrop-filter: blur(${this.blurRadius}px);
				-webkit-backdrop-filter: blur(${this.blurRadius}px);
			}

			body {
				background: transparent !important;
			}
		`;
	}

	private removeTransparencyStyles(): void {
		const styleId = 'window-transparency-styles';
		const style = mainWindow.document.getElementById(styleId);
		if (style) {
			style.remove();
		}
	}
}
