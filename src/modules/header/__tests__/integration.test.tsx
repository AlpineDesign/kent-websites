/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { buildMockModuleProps } from '@msdyn365-commerce/core';
import { render } from 'enzyme';
import * as React from 'react';
import HeaderModule from '../header';
import { IHeaderData } from '../header.data';
import { IHeaderProps } from '../header.props.autogenerated';
import HeaderView from '../header.view';
import * as MockUtillities from '../utilities/mock-utilities';

const mockActions = {};

describe('Header integration tests', () => {
    it('renders correctly', ()=> {
        // @ts-ignore
        const moduleProps: IHeaderProps<IHeaderData> = {
            ...buildMockModuleProps(
                MockUtillities.getMockData(0),
                mockActions,
                MockUtillities.mockHeaderConfig,
                MockUtillities.mockAuthContext) as IHeaderProps<IHeaderData>,
            resources: MockUtillities.mockResources,
            // @ts-ignore
            renderView: HeaderView,
        };

        const component = render(<HeaderModule {...moduleProps}/>);
        expect(component).toMatchSnapshot();
    });
});