/**
 * Copyright (c) 2018 Microsoft Corporation
 * IVideolist contentModule Interface Properties
 * THIS FILE IS AUTO-GENERATED - MANUAL MODIFICATIONS WILL BE LOST
 */

import * as Msdyn365 from '@msdyn365-commerce/core';

export interface IVideolistConfig extends Msdyn365.IModuleConfig {
    showText?: string;
}

export interface IVideolistResources {
    resourceKey: string;
}

export interface IVideolistProps<T> extends Msdyn365.IModule<T> {
    resources: IVideolistResources;
    config: IVideolistConfig;
}
