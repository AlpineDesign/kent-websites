/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as React from 'react';

export interface ISignInText {
    className: string;
    text: string;
}

const SignInText: React.FC<ISignInText> = ({ className, text }) => (
    <span className={className}>
        {text}
    </span>
);

export default SignInText;
