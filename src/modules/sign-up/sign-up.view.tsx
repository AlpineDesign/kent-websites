/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as React from 'react';

import { Module, Node } from '@msdyn365-commerce-modules/utilities';

import {
    ISignUpEmailVerification, ISignUpItem, ISignUpLoading, ISignUpLocalAccount, ISignUpViewProps
} from './sign-up';

const SignUpItem: React.FC<ISignUpItem> = ({
    wrapper,
    label,
    errorMessage,
    input
}) => {

    return (
        <Node {...wrapper}>
            {label}
            {errorMessage}
            {input}
        </Node>
    );
};

const SignUpEmailVerification: React.FC<ISignUpEmailVerification> = ({
    email,
    buttonWrapper,
    buttons,
    successMessage,
    errorMessage
}) => {
    return (
        <>
            <SignUpItem key={email.key} {...email} />
            {successMessage && successMessage.map((message: React.ReactNode) => {
                return (
                    <>
                        {message}
                    </>
                );
            })}
            {errorMessage && errorMessage.map((message: React.ReactNode) => {
                return (
                    <>
                        {message}
                    </>
                );
            })}
            <Node {...buttonWrapper}>
                {buttons && buttons.map((button: React.ReactNode) => {
                    return (
                        <>
                            {button}
                        </>
                    );
                })}
            </Node>
        </>
    );
};

const LocalAccount: React.FC<ISignUpLocalAccount> = ({
    localAccount,
    items,
    emailVerification,
    buttons,
    errorMessage,
    disclaimer
}) => {

    return (
        <Node {...localAccount}>
            {items && items.map((item: ISignUpItem) => {
                if (item.key === 'email' && emailVerification.isRequired) {
                    return (
                        <>
                            <SignUpItem key={item.key} {...item} />
                            <SignUpEmailVerification {...emailVerification} />
                        </>
                    );
                }
                return (
                    <SignUpItem key={item.key} {...item} />
                );
            })}
            {errorMessage && errorMessage.map((error: React.ReactNode, index: number) => {
                return (
                    <React.Fragment key={index}>
                        {error}
                    </React.Fragment>
                );
            })}
            {buttons && buttons.map((button: React.ReactNode, index: number) => {
                return (
                    <React.Fragment key={index}>
                        {button}
                    </React.Fragment>
                );
            })}
            {disclaimer}
        </Node>
    );
};

const SignUpLoading: React.FC<ISignUpLoading> = ({
    modal,
    modalBody,
    icon,
    message,
}) => {
    return (
        <Node {...modal}>
            <Node {...modalBody}>
                {icon}
                {message}
            </Node>
        </Node>
    );
};

const SignUpView: React.FC<ISignUpViewProps> = props => {

    const {
        signUp,
        viewState,
        loading,
        defaultAADConainer,
        aadConainer,
        heading,
        signUpLocalAccount
    } = props;

    return (
        <Module {...signUp}>
            {viewState.isShowLoading && <Node {...defaultAADConainer} />}
            {viewState.isShowLoading && <SignUpLoading {...loading} />}
            <Node {...aadConainer}>
                {heading}
                {LocalAccount(signUpLocalAccount)}
            </Node>
        </Module>
    );
};

export default SignUpView;
