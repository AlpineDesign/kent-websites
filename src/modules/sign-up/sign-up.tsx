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
import { RichTextComponent } from '@msdyn365-commerce/core';

import SignUpButtonComponent from './components/sign-up-button';
import SignUpErrorComponent from './components/sign-up-error';
import SignUpInputComponent from './components/sign-up-input';
import SignUpLabelComponent from './components/sign-up-label';
import SignUpLoadingIconComponent from './components/sign-up-loading-icon';
import SignUpLoadingMessageComponent from './components/sign-up-loading-message';
import SignUpSuccessComponent from './components/sign-up-success';
import { ISignUpConfig, ISignUpProps, ISignUpResources } from './sign-up.props.autogenerated';

export interface ISignUpViewState {
    isShowLoading: boolean;
}

export interface ISignUpItem {
    wrapper: INodeProps;
    key: string;
    label: React.ReactNode;
    errorMessage: React.ReactNode;
    input: React.ReactNode;
}

export interface ISignUpEmailVerification {
    isRequired: boolean;
    email: ISignUpItem;
    buttonWrapper: INodeProps;
    buttons: React.ReactNode[];
    successMessage: React.ReactNode[];
    errorMessage: React.ReactNode[];
}

export interface ISignUpLocalAccount {
    localAccount: INodeProps;
    items: ISignUpItem[];
    emailVerification: ISignUpEmailVerification;
    buttons: React.ReactNode[];
    errorMessage: React.ReactNode[];
    disclaimer: React.ReactNode;
}

export interface ISignUpLoading {
    modal: INodeProps;
    modalBody: INodeProps;
    icon: React.ReactNode;
    message: React.ReactNode;
}

export interface ISignUpViewProps {
    className: string;
    viewState: ISignUpViewState;
    loading: ISignUpLoading;
    signUp: IModuleProps;
    defaultAADConainer: INodeProps;
    aadConainer: INodeProps;
    heading: React.ReactNode;
    signUpLocalAccount: ISignUpLocalAccount;
}

/**
 *
 * SignUp component
 * All AAD related module is rendered on AAD page and we need to respect HTML contract provide by AAD.
 * Please ensure any change in module don't break contract with AAD.
 * @extends {React.Component<ISignUpProps<ISignUpConfig>>}
 */
@observer
class SignUp extends React.Component<ISignUpProps<ISignUpConfig>> {
    private moduleClassName: string = 'ms-sign-up';
    @observable private emailRegex: string;
    @observable private newPasswordRegex: string;
    @observable private reenterPasswordRegex: string;
    @observable private isEmailVerificationRequried: boolean;
    @observable private isInitialized: boolean;

    // tslint:disable-next-line:no-any
    private initializationTimer: any;

    constructor(props: ISignUpProps<ISignUpConfig>) {
        super(props);
        // tslint:disable-next-line:max-line-length
        const passwordDefaultRegex = '^((?=.*[a-z])(?=.*[A-Z])(?=.*\\d)|(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])|(?=.*[a-z])(?=.*\\d)(?=.*[^A-Za-z0-9])|(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]))([A-Za-z\\d@#$%^&*\\-_+=[\\]{}|\\\\:\',?/`~\'();!]|\\.(?!@)){8,16}$';
        this.emailRegex = '^[a-zA-Z0-9.!#$%&\'^_`{}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$';
        this.newPasswordRegex = passwordDefaultRegex;
        this.reenterPasswordRegex = passwordDefaultRegex;
        this.isEmailVerificationRequried = false;
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
        const { config, resources } = this.props;

        const viewProps = {
            ...this.props,
            viewState: {
                isShowLoading: !this.isInitialized
            },
            signUp: {
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
                icon: <SignUpLoadingIconComponent className={this.moduleClassName} />,
                message: <SignUpLoadingMessageComponent className={this.moduleClassName} message={resources.loadingMessage} />,
            },
            defaultAADConainer: {
                id: 'api',
                style: { display: 'none' }
            },
            aadConainer: {
                id: this.isInitialized ? 'api' : null,
                className: `${this.moduleClassName}__container`
            },
            heading: <Heading className={`${this.moduleClassName}__heading`} {...config.heading} />,
            signUpLocalAccount: this._renderLocalAccount()
        };

        return this.props.renderView(viewProps) as React.ReactElement;
    }

    public _onInit = () => {
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
        const resources: ISignUpResources = this.props.resources || {};

        // tslint:disable-next-line:no-string-literal
        if (window['SA_FIELDS'] && window['SA_FIELDS']['AttributeFields']) {
            // tslint:disable-next-line:no-string-literal
            window['SA_FIELDS']['AttributeFields'].map((obj: { ID: string; PAT: string; UX_INPUT_TYPE: string; PAT_DESC: string; VERIFY: boolean }) => {
                switch (obj.ID.toLowerCase()) {
                    case 'email': {
                        this.emailRegex = obj.PAT;
                        this.isEmailVerificationRequried = obj.VERIFY;
                        break;
                    }
                    case 'newpassword': {
                        this.newPasswordRegex = obj.PAT;
                        break;
                    }
                    case 'reenterpassword': {
                        this.reenterPasswordRegex = obj.PAT;
                        break;
                    }
                    default:
                }

                switch (obj.UX_INPUT_TYPE.toLowerCase()) {
                    case 'password': {
                        obj.PAT_DESC = resources.invalidPasswordError;
                        break;
                    }
                    case 'emailbox': {
                        obj.PAT_DESC = resources.invalidEmailAddressError;
                        break;
                    }
                    default:
                }
            });
        }
    }

    private _updateErrorMessage = () => {
        const resources: ISignUpResources = this.props.resources || {};

        // tslint:disable-next-line:no-string-literal
        if (window && window['CONTENT']) {
            const errorMessages = {
                required_field: resources.requiredFieldMissingError
            };

            // tslint:disable-next-line:no-string-literal
            Object.assign(window['CONTENT'], errorMessages);
        }
    }

    private _renderLocalAccount(): ISignUpLocalAccount {
        const { config, resources } = this.props;
        return {
            localAccount: {
                id: 'attributeList',
                className: `${this.moduleClassName}__account-items attr`
            },
            items: [
                this._renderInput('givenName', 'text', resources.firstNameLabelText, resources.firstNameMaxLength),
                this._renderInput('surname', 'text', resources.lastNameLabelText, resources.lastNameMaxLength),
                this._renderInput('email', 'email', resources.emailAddressLabelText, undefined, this.emailRegex),
                this._renderInput('newPassword', 'password', resources.passwordLabelText, undefined, this.newPasswordRegex),
                this._renderInput('reenterPassword', 'password', resources.confirmPasswordLabelText, undefined, this.reenterPasswordRegex)
            ],
            emailVerification: {
                isRequired: this.isEmailVerificationRequried,
                email: this._renderInput('email_ver_input', 'text', resources.verificationCodeLabelText),
                buttonWrapper: {
                    className: `${this.moduleClassName}__email-verification-buttons verify`,
                    'data-claim_id': 'email'
                },
                buttons: [
                    (
                        <SignUpButtonComponent
                            key='email_ver_but_send'
                            id='email_ver_but_send'
                            className={`${this.moduleClassName}__email-verification-button ${this.moduleClassName}__verify-email-send-button sendButton`}
                            ariaLabel={resources.sendCodeButtonAriaLabel}
                            text={resources.sendCodeButtonText}
                        />
                    ),
                    (
                        <SignUpButtonComponent
                            key='email_ver_but_verify'
                            id='email_ver_but_verify'
                            className={`${this.moduleClassName}__email-verification-button ${this.moduleClassName}__verify-email-verify-button verifyButton`}
                            ariaLabel={resources.verifyCodeButtonAriaLabel}
                            text={resources.verifyCodeButtonText}
                        />
                    ),
                    (
                        <SignUpButtonComponent
                            key='email_ver_but_resend'
                            id='email_ver_but_resend'
                            className={`${this.moduleClassName}__email-verification-button ${this.moduleClassName}__verify-email-resend-button sendButton`}
                            ariaLabel={resources.resendCodeButtonAriaLabel}
                            text={resources.resendCodeButtonText}
                        />
                    ),
                    (
                        <SignUpButtonComponent
                            key='email_ver_but_edit'
                            id='email_ver_but_edit'
                            className={`${this.moduleClassName}__email-verification-button ${this.moduleClassName}__verify-email-edit-button editButton`}
                            ariaLabel={resources.changeEmailButtonAriaLabel}
                            text={resources.changeEmailButtonText}
                        />
                    )
                ],
                successMessage: [
                    <SignUpSuccessComponent key='email_info' id='email_info' className={this.moduleClassName} message={resources.verificationCodeSendSuccess} />,
                    <SignUpSuccessComponent key='email_success' id='email_success' className={this.moduleClassName} message={resources.emailAddressVerifiedSuccess} />
                ],
                errorMessage: [
                    <SignUpErrorComponent key='email_fail_retry' id='email_fail_retry' className={this.moduleClassName} message={resources.retryError} />,
                    <SignUpErrorComponent key='email_fail_no_retry' id='email_fail_no_retry' className={this.moduleClassName} message={resources.retryNotAllowedError} />,
                    <SignUpErrorComponent key='email_fail_throttled' id='email_fail_throttled' className={this.moduleClassName} message={resources.throttledError} />,
                    <SignUpErrorComponent key='email_fail_code_expired' id='email_fail_code_expired' className={this.moduleClassName} message={resources.codeExpiredError} />,
                    <SignUpErrorComponent key='email_fail_server' id='email_fail_server' className={this.moduleClassName} message={resources.serverError} />,
                    <SignUpErrorComponent key='email_incorrect_format' id='email_incorrect_format' className={this.moduleClassName} message={resources.invalidEmailError} />
                ]
            },
            buttons: [
                <SignUpButtonComponent key='continue' id='continue' className={`${this.moduleClassName}__create-button`} ariaLabel={resources.signUpButtonArialabel} text={resources.signUpButtonText} />,
                <SignUpButtonComponent key='cancel' id='cancel' className={`${this.moduleClassName}__cancel-button`} ariaLabel={resources.cancelButtonArialabel} text={resources.cancelButtonText} />
            ],
            errorMessage: [
                <SignUpErrorComponent key='passwordEntryMismatch' id='passwordEntryMismatch' className={this.moduleClassName} message={resources.passwordEntryMismatchError} />,
                <SignUpErrorComponent key='requiredFieldMissing' id='requiredFieldMissing' className={this.moduleClassName} message={resources.requiredFieldMissingSummaryError} />,
                <SignUpErrorComponent key='fieldIncorrect' id='fieldIncorrect' className={this.moduleClassName} message={resources.fieldIncorrectError} />,
                <SignUpErrorComponent key='claimVerificationServerError' id='claimVerificationServerError' className={this.moduleClassName} />
            ],
            disclaimer: config.disclaimer && <RichTextComponent className={`${this.moduleClassName}__sign-up-disclaimer`} text={config.disclaimer} />,
        };
    }

    private _renderInput(id: string, type: string, labelText: string, maxLength?: string, pattern?: string): ISignUpItem {
        const className = `${this.moduleClassName}__account-item`;
        return (
            {
                wrapper: {
                    className: classnames(className, `${className}-${id}`, 'entry-item', 'attrEntry')
                },
                key: id,
                label: (
                    <SignUpLabelComponent
                        {
                        ...{
                            id: id,
                            forId: id,
                            className: className,
                            text: labelText
                        }
                        }
                    />
                ),
                errorMessage: (
                    <SignUpErrorComponent
                        {
                        ...{
                            className: this.moduleClassName,
                            type: 'item'
                        }
                        }
                    />
                ),
                input: (
                    <SignUpInputComponent
                        {
                        ...{
                            id: id,
                            type: type,
                            maxLength: maxLength,
                            pattern: pattern,
                            className: className
                        }
                        }
                    />
                )

            }
        );
    }
}

export default SignUp;
