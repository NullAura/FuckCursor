/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../nls.js';
import { ConfigurationScope, IConfigurationRegistry, Extensions as ConfigurationExtensions } from '../../platform/configuration/common/configurationRegistry.js';
import { Registry } from '../../platform/registry/common/platform.js';
import { windowConfigurationNodeBase } from '../common/configuration.js';

const configurationRegistry = Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration);

configurationRegistry.registerConfiguration({
	...windowConfigurationNodeBase,
	'properties': {
		'window.experimental.transparency.enabled': {
			'type': 'boolean',
			'default': false,
			'description': localize('window.transparency.enabled', "Enable window transparency effects. This is an experimental feature that may affect performance."),
			'scope': ConfigurationScope.WINDOW,
			'tags': ['experimental']
		},
		'window.experimental.transparency.opacity': {
			'type': 'number',
			'default': 0.8,
			'minimum': 0.1,
			'maximum': 1.0,
			'description': localize('window.transparency.opacity', "Window opacity setting. 0.1 means 90% transparent, 1.0 means fully opaque."),
			'scope': ConfigurationScope.WINDOW,
			'tags': ['experimental']
		},
		'window.experimental.transparency.blur': {
			'type': 'number',
			'default': 5,
			'minimum': 0,
			'maximum': 20,
			'description': localize('window.transparency.blur', "Window background blur radius in pixels. 0 means no blur, higher values create stronger blur effects."),
			'scope': ConfigurationScope.WINDOW,
			'tags': ['experimental']
		}
	}
});
