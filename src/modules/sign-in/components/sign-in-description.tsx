/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as React from 'react';

export interface ISignInDescription {
    className: string;
    description: string;
}

const SignInDescription: React.FC<ISignInDescription> = ({ className, description }) => (
    <p className={className}>
        {description}
    </p>
);

export default SignInDescription;
