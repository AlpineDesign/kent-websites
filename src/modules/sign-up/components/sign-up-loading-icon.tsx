/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as React from 'react';

export interface ISignUpLoadingIcon {
    className: string;
}

const SignUpLoadingIcon: React.FC<ISignUpLoadingIcon> = ({ className }) => (
    <div className={`${className}__loading-icon`} />
);

export default SignUpLoadingIcon;
