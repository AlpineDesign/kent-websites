/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// tslint:disable-next-line:no-unused-variable
import * as React from 'react';
import * as renderer from 'react-test-renderer';

import { buildMockModuleProps, buildMockRequest, IRequestContext } from '@msdyn365-commerce/core';

import SignIn from '../sing-in';
import {
    ISingInConfig,
    ISingInProps,
    ISignInResources,
    SignUpHeadingTag
} from '../sing-in.props.autogenerated';

const mockRequest: IRequestContext = buildMockRequest();

// @ts-ignore
const mockContext: ICoreContext = {
    request: mockRequest
};

const mockConfig: ISingInConfig = {
    signInHeading: {
        text: 'Sign in'
    },
    signUpHeading:
    {
        tag: SignUpHeadingTag.h2,
        text: 'Don’t have an account?'
    },
    signInDisclaimer: '<p>By signing in to your account, you accept our <a href="privacypolicy" class="c-hyperlink">Privacy Policy</a>.</p>',
    facebookIcon: {
        src: 'https://img-prod-cms-mr-microsoft-com.akamaized.net/cms/api/fabrikam/imageFileData/MA1Lgg?ver=edce',
        altText: 'Facebook'
    },
    microsoftIcon: {
        src: 'https://img-prod-cms-mr-microsoft-com.akamaized.net/cms/api/fabrikam/imageFileData/MA1G3L?ver=e411',
        altText: 'Facebook'
    }
};

const mockResources: ISignInResources = {
    signUpDescriptionText: 'Create an account with us to get Fabrikam membership points and to save your favorites to the Wishlist.',
    facebookButtonText: 'Sign in with Facebook',
    facebookButtonAriaLabel: 'Sign in with Facebook',
    microsoftButtonText: 'Sign in with Microsoft',
    microsoftButtonAriaLabel: 'Sign in with Microsoft',
    emailAddressLabelText: 'Email address',
    passwordLabelText: 'Password',
    loginButtonText: 'Sign in',
    loginButtonAriaLabel: 'Sign in',
    signUpButtonText: 'Sign Up',
    signUpButtonAriaLabel: 'Sign Up',
    forgotPasswordButtonText: 'Forgotten password?',
    forgotPasswordButtonAriaLabel: 'Forgotten password?',
    loadingMessage: 'Please wait.',
    requriedEmailError: 'Please enter your email address.',
    requriedPasswordError: 'Please enter your password.',
    invalidEmailError: 'Please enter a valid email address.',
    invalidPasswordError: 'The password you entered is not in the expected format.',
    unknownError: 'We are having trouble signing you in. Please try again later.'
};

const mockActions = {};

describe('SignIn', () => {
    let moduleProps: ISingInProps<ISingInConfig>;
    beforeAll(() => {
        moduleProps = { ...buildMockModuleProps({}, mockActions, mockConfig, mockContext) as ISingInProps<ISingInConfig>, resources: mockResources };
    });
    it('renders correctly', () => {
        const component: renderer.ReactTestRenderer = renderer.create(
            <SignIn {...moduleProps} />
        );
        const tree: renderer.ReactTestRendererJSON | null = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});
