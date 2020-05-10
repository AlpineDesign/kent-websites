/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as React from 'react';

export interface ISignInLabel {
    id: string;
    forId: string;
    className: string;
    text: string;
}

const SignInLabel: React.FC<ISignInLabel> = ({ id, forId, className, text }) => (
    <label id={`${id}_label`} className={`${className}-label`} htmlFor={forId}>
        {text}
    </label>
);

export default SignInLabel;
