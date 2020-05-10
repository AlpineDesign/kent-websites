/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import classnames from 'classnames';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import {
    Heading, IModuleProps, INodeProps, Modal, ModalBody
} from '@msdyn365-commerce-modules/utilities';
import { IImageData, Image, RichTextComponent } from '@msdyn365-commerce/core';
import SignInButtonComponent from './components/sing-in-button';
import SignInDescriptionComponent from './components/sign-in-description';
import SignInErrorComponent from './components/sign-in-error';
import SignInInputComponent from './components/sign-in-input';
import SignInLabelComponent from './components/sign-in-label';
import SignInLinkComponent from './components/sign-in-link';
import SignInLoadingIconComponent from './components/sign-in-loading-icon';
import SignInLoadingMessageComponent from './components/sign-in-loading-message';
import SignInTextComponent from './components/sign-in-text';
import { ISingInConfig, ISingInProps, ISignInResources } from './sing-in.props.autogenerated';

export interface ISignInViewState {
    isShowLoading: boolean;
}

export interface ISignInItem {
    wrapper: INodeProps;
    key: string;
    label: React.ReactNode;
    error: React.ReactNode;
    input: React.ReactNode;
}

export interface ISignInSocialItem {
    key: string;
    button: INodeProps;
    image: React.ReactNode;
    text: React.ReactNode;
}

export interface ISignInSocialAccount {
    socialAccounts: INodeProps;
    items: ISignInSocialItem[];
}

export interface ISignInLocalAccount {
    localAccount: INodeProps;
    items: ISignInItem[];
    forgetPassword: React.ReactNode;
    disclaimer: React.ReactNode;
    error: React.ReactNode;
    signInButton: React.ReactNode;
}

export interface ISignInLoading {
    modal: INodeProps;
    modalBody: INodeProps;
    icon: React.ReactNode;
    message: React.ReactNode;
}

export interface ISignInViewProps {
    className: string;
    viewState: ISignInViewState;
    signIn: IModuleProps;
    loading: ISignInLoading;
    defaultAADConainer: INodeProps;
    aadConainer: INodeProps;
    signInSection: INodeProps;
    signInSectionHeading: React.ReactNode;
    signInLocalAccount: ISignInLocalAccount;
    signInSocialAccount: ISignInSocialAccount;
    signUpSection: INodeProps;
    signUpSectionHeading: React.ReactNode;
    signUpDescription: React.ReactNode;
    signUpLink: React.ReactNode;
}

/**
 * SignIn component
 * All AAD related module is rendered on AAD page and we need to respect HTML contract provide by AAD.
 * Please ensure any change in module don't break contract with AAD.
 * @extends {React.Component<ISingInProps<ISingInData>>}
 */
@observer
class SignIn extends React.Component<ISingInProps<ISingInConfig>> {

    private moduleClassName: string = 'ms-sign-in';
    @observable private emailRegex: string;
    @observable private isInitialized: boolean;
    // tslint:disable-next-line:no-any
    private initializationTimer: any;

    constructor(props: ISingInProps<ISingInConfig>) {
        super(props);
        this.emailRegex = '^[a-zA-Z0-9.!#$%&\^_`{}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$';
        this.isInitialized = false;
    }

    public componentDidMount(): void {
        this._onInit();
    }

    // After successful AAD initialization, call initialize method provided by AAD to attach events.
    public componentDidUpdate(): void {
        // tslint:disable-next-line:no-string-literal
        if (this.isInitialized && window && window['$element'] && window['$element']['initialize']) {
            // tslint:disable-next-line:no-string-literal
            window['$element']['initialize']();
        }
    }

    public render(): JSX.Element {
        const config: ISingInConfig = this.props.config || {};
        const resources: ISignInResources = this.props.resources || {};

        const viewProps = {
            ...this.props,
            viewState: {
                isShowLoading: !this.isInitialized
            },
            signIn: {
                moduleProps: this.props,
                className: classnames(this.moduleClassName, config.className)
            },
            loading: {
                modal: {
                    tag: Modal,
                    isOpen: true
                },
                modalBody: {
                    tag: ModalBody
                },
                icon: <SignInLoadingIconComponent className={this.moduleClassName} />,
                message: <SignInLoadingMessageComponent className={this.moduleClassName} message={resources.loadingMessage} />,
            },
            defaultAADConainer: {
                id: 'api',
                style: { display: 'none' }
            },
            aadConainer: {
                id: this.isInitialized ? 'api' : null,
                className: `${this.moduleClassName}__container`
            },
            signInSection: {
                className: `${this.moduleClassName}__sign-in-section`
            },
            signInSectionHeading: <Heading className={`${this.moduleClassName}__sign-in-heading`} {...config.signInHeading} />,
            signInLocalAccount: {
                localAccount: {
                    className: `${this.moduleClassName}__account-items localAccount`
                },
                items: [
                    this._renderInput('logonIdentifier', 'email', resources.emailAddressLabelText, this.emailRegex),
                    this._renderInput('password', 'password', resources.passwordLabelText)
                ],
                forgetPassword: <SignInLinkComponent id='forgotPassword' className={`${this.moduleClassName}__forget-password`} href='#' ariaLabel={resources.forgotPasswordButtonAriaLabel} text={resources.forgotPasswordButtonText} />,
                disclaimer: config.signInDisclaimer && <RichTextComponent className={`${this.moduleClassName}__sign-in-disclaimer`} text={config.signInDisclaimer} />,
                error: <SignInErrorComponent className={this.moduleClassName} />,
                signInButton: <SignInButtonComponent id='next' className={`${this.moduleClassName}__sign-in-button`} ariaLabel={resources.loginButtonAriaLabel} text={resources.loginButtonText} />
            },
            signInSocialAccount: {
                socialAccounts: {
                    className: `${this.moduleClassName}__social-accounts`
                },
                items: [
                    this._renderSocialAccount('FacebookExchange', resources.facebookButtonText, resources.facebookButtonAriaLabel, config.facebookIcon),
                    this._renderSocialAccount('MicrosoftAccountExchange', resources.microsoftButtonText, resources.microsoftButtonAriaLabel, config.microsoftIcon)
                ]
            },
            signUpSection: {
                className: `${this.moduleClassName}__sign-up-section`
            },
            signUpSectionHeading: <Heading className={`${this.moduleClassName}__sign-up-heading`} {...config.signUpHeading} />,
            signUpDescription: <SignInDescriptionComponent className={`${this.moduleClassName}__sign-up-description`} description={resources.signUpDescriptionText} />,
            signUpLink: <SignInLinkComponent id='createAccount' href='#' className={`${this.moduleClassName}__sign-up-link msc-btn`} ariaLabel={resources.signUpButtonAriaLabel} text={resources.signUpButtonText} />
        };

        return this.props.renderView(viewProps) as React.ReactElement;
    }

    private _onInit = () => {
        this._prePopulateData();
        this._updateErrorMessage();
        // Check if AAD initialization is complete. AAD do not provide any event to subscribe so we need to check variable set by AAD to check initialization status.
        this.initializationTimer = setInterval(() => { this._isInitializationSuccessful(); }, 100);
        setTimeout(() => { clearInterval(this.initializationTimer); }, 10000);
    }

    // After successful AAD initialization, remove waiting and preload any data, if needed.
    private _isInitializationSuccessful = () => {
        // tslint:disable-next-line:no-string-literal
        if (window && window['$diags'] && window['$diags']['initializationSuccessful']) {
            clearInterval(this.initializationTimer);
            this.isInitialized = true;
        }
    }

    private _prePopulateData = () => {
        // tslint:disable-next-line:no-string-literal
        if (window && window['CONTENT'] && window['CONTENT']['email_pattern']) {
            // tslint:disable-next-line:no-string-literal
            this.emailRegex = window['CONTENT']['email_pattern'];
        }
    }

    private _updateErrorMessage = () => {
        const resources: ISignInResources = this.props.resources || {};

        // tslint:disable-next-line:no-string-literal
        if (window && window['CONTENT']) {
            const errorMessages = {
                requiredField_email: resources.requriedEmailError,
                requiredField_password: resources.requriedPasswordError,
                invalid_email: resources.invalidEmailError,
                invalid_password: resources.invalidPasswordError,
                unknown_error: resources.unknownError,
            };

            // tslint:disable-next-line:no-string-literal
            Object.assign(window['CONTENT'], errorMessages);
        }
    }

    private _renderInput(id: string, type: string, labelText: string, pattern?: string): ISignInItem {
        const className = `${this.moduleClassName}__account-item`;
        return (
            {
                wrapper: {
                    className: classnames(className, `${className}-${id}`, 'entry-item', 'attrEntry')
                },
                key: id,
                label: (
                    <SignInLabelComponent
                        {
                        ...{
                            id,
                            forId: id,
                            className: className,
                            text: labelText
                        }
                        }
                    />
                ),
                error: (
                    <SignInErrorComponent
                        {
                        ...{
                            className: this.moduleClassName,
                            type: 'item'
                        }
                        }
                    />
                ),
                input: (
                    <SignInInputComponent
                        {
                        ...{
                            id: id,
                            type: type,
                            pattern: pattern,
                            className: className
                        }
                        }
                    />
                )

            }
        );
    }

    private _renderSocialAccount(id: string, text: string, ariaLabel: string, iconImage?: IImageData): ISignInSocialItem {
        return {
            key: id,
            button: {
                id: id,
                tag: 'button',
                className: classnames(`${this.moduleClassName}__social-account`, `${this.moduleClassName}__social-account-${id}`, 'accountButton', 'msc-btn'),
                'aria-label': ariaLabel
            },
            image: this._createImageMarkup(iconImage),
            text: <SignInTextComponent className={`${this.moduleClassName}__social-account-text`} text={text} />
        };
    }

    private _createImageMarkup(iconImage?: IImageData): React.ReactNode | null {
        if (iconImage) {
            const imageProps = {
                gridSettings: this.props.context.request.gridSettings || {},
                imageSettings: iconImage && iconImage.imageSettings
            };
            return <Image className={`${this.moduleClassName}__social-account-picture`} {...iconImage} {...imageProps} />;
        }
        return null;
    }
}

export default SignIn;