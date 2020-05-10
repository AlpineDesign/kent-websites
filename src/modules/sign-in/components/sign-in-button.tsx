/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Button } from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';

export interface ISignInButton {
    id?: string;
    className: string;
    text: string;
    ariaLabel: string;
    disabled?: boolean;
    onClick?(event: React.MouseEvent<HTMLElement>): void;
}

const SignInButton: React.FC<ISignInButton> = ({ id, className, text, ariaLabel, disabled, onClick }) => (
    <Button
        id={id}
        className={className}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={onClick}
    >
        {text}
    </Button>
);

export default SignInButton;
