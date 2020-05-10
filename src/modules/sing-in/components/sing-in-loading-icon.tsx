/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as React from 'react';

export interface ISignInLoadingIcon {
    className: string;
}

const SignInLoadingIcon: React.FC<ISignInLoadingIcon> = ({ className }) => (
    <div className={`${className}__loading-icon`} />
);

export default SignInLoadingIcon;
