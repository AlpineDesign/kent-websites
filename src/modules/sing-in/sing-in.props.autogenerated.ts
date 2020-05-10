/**
 * Copyright (c) 2018 Microsoft Corporation
 * ISingIn contentModule Interface Properties
 * THIS FILE IS AUTO-GENERATED - MANUAL MODIFICATIONS WILL BE LOST
 */

import * as Msdyn365 from '@msdyn365-commerce/core';

export interface ISingInConfig extends Msdyn365.IModuleConfig {
    signInHeading: ISignInHeadingData;
    signUpHeading: ISignUpHeadingData;
    signInDisclaimer?: Msdyn365.RichText;
    facebookIcon?: Msdyn365.IImageData;
    microsoftIcon?: Msdyn365.IImageData;
    className?: string;
}

export interface ISingInResources {
    signUpDescriptionText: string;
    facebookButtonText: string;
    facebookButtonAriaLabel: string;
    microsoftButtonText: string;
    microsoftButtonAriaLabel: string;
    emailAddressLabelText: string;
    passwordLabelText: string;
    loginButtonText: string;
    loginButtonAriaLabel: string;
    signUpButtonText: string;
    signUpButtonAriaLabel: string;
    forgotPasswordButtonText: string;
    forgotPasswordButtonAriaLabel: string;
    requriedEmailError: string;
    requriedPasswordError: string;
    invalidEmailError: string;
    invalidPasswordError: string;
    unknownError: string;
    loadingMessage: string;
}

export const enum SignInHeadingTag {
    h1 = 'h1',
    h2 = 'h2',
    h3 = 'h3',
    h4 = 'h4',
    h5 = 'h5',
    h6 = 'h6'
}

export interface ISignInHeadingData {
    text: string;
    tag?: SignInHeadingTag;
}

export const enum SignUpHeadingTag {
    h1 = 'h1',
    h2 = 'h2',
    h3 = 'h3',
    h4 = 'h4',
    h5 = 'h5',
    h6 = 'h6'
}

export interface ISignUpHeadingData {
    text: string;
    tag?: SignUpHeadingTag;
}

export interface ISingInProps<T> extends Msdyn365.IModule<T> {
    resources: ISingInResources;
    config: ISingInConfig;
}
