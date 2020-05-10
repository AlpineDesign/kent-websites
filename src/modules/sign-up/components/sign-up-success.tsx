/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import classnames from 'classnames';
import * as React from 'react';

export interface ISignUpSuccess {
    id?: string;
    className: string;
    type?: string;
    message?: string;
}

const SignUpSuccess: React.FC<ISignUpSuccess> = ({ id, className, type = 'page', message }) => {
    const successClassName = `${className}__${type}-success`;

    return (
        <span id={id} className={classnames(successClassName, `${type}Level`)} role='alert' aria-live='assertive' aria-hidden='true'>
            {
                <p className={`${successClassName}-text`}>
                    {message}
                </p>
            }
        </span>
    );
};

export default SignUpSuccess;
