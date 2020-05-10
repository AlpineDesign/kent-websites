/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as React from 'react';

export interface ISignUpLoadingMessage {
    className: string;
    message: string;
}

const SignUpLoadingMessage: React.FC<ISignUpLoadingMessage> = ({ className, message }) => (
    <div className={`${className}__loading-message`} >
        {message}
    </div>
);

export default SignUpLoadingMessage;
