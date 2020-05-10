/**
 * Copyright (c) 2018 Microsoft Corporation
 * IHero contentModule Interface Properties
 * THIS FILE IS AUTO-GENERATED - MANUAL MODIFICATIONS WILL BE LOST
 */

import * as Msdyn365 from '@msdyn365-commerce/core';

export interface IHeroConfig extends Msdyn365.IModuleConfig {
    showText?: string;
}

export interface IHeroResources {
    resourceKey: string;
}

export interface IHeroProps<T> extends Msdyn365.IModule<T> {
    resources: IHeroResources;
    config: IHeroConfig;
}
