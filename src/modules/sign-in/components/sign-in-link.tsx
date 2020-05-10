/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as React from 'react';

export interface ISignInLink {
    id?: string;
    className: string;
    href: string;
    ariaLabel: string;
    text: string;
}

const SignInLink: React.FC<ISignInLink> = ({ id, className, href, ariaLabel, text }) => (
    <a
        id={id}
        className={className}
        href={href}
        aria-label={ariaLabel}
    >
        {text}
    </a>
);

export default SignInLink;
