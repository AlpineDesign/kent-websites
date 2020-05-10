/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as React from 'react';

import { INodeProps } from '@msdyn365-commerce-modules/utilities';

export interface ISignUpInputProps {
    id?: string;
    // tslint:disable-next-line:no-any
    type: any;
    value?: string;
    pattern?: string;
    className: string;
    maxLength?: string;
    onChange?(event: React.ChangeEvent<HTMLInputElement>): void;
}

export interface ISignUpInput {
    key: string;
    AddressItem: INodeProps;
    label: React.ReactNode;
    alert: React.ReactNode;
    input: React.ReactNode;
}

const GetMaxLength = (maxLength?: string): number | undefined => {
    if (maxLength) {
        const parsedMaxLength = parseInt(maxLength, 10);
        if (!isNaN(parsedMaxLength)) {
            return parsedMaxLength;
        }
    }

    return undefined;
};

const SignUpInput: React.FC<ISignUpInputProps> = ({
    id,
    type,
    value,
    pattern,
    className,
    maxLength,
    onChange }) => (
        <input
            id={id}
            type={type}
            value={value}
            className={`${className}-input ${className}-${id}`}
            pattern={pattern !== '' ? pattern : undefined}
            aria-required='true'
            maxLength={GetMaxLength(maxLength)}
            onChange={onChange}
        />
    );

export default SignUpInput;
