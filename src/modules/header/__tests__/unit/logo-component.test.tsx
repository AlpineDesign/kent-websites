/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IImageSettings } from '@msdyn365-commerce/core';
import { render } from 'enzyme';
import * as React from 'react';
import { ILogoProps, Logo } from '../../components';
import * as MockUtillities from '../../utilities/mock-utilities';

const defaultImageSettings: IImageSettings = {
    viewports: {
        xs: { q: `w=132&h=28&m=6`, w: 0, h: 0 },
        lg: { q: `w=160&h=48&m=6`, w: 0, h: 0 }
    },
    lazyload: true
};

describe('Logo component unit tests', () => {
    it('render correctly with image link, and class name', () => {
        const mockConfigs: ILogoProps = {
            link:{
                linkUrl: {
                    destinationUrl: 'https://ppe.fabrikam.com/fe'
                }
            },
            image: {
                src: 'https://img-prod-cms-mr-microsoft-com.akamaized.net/cms/api/fabrikam/imageFileData/MA1G3L',
                imageSettings: defaultImageSettings
            },
            gridSettings: MockUtillities.mockAuthContext.request.gridSettings,
            className: ''
        };
        const component = render(<Logo {...mockConfigs}/>);
        expect(component).toMatchSnapshot();
    });

    it('render correctly with image and link', () => {
        const mockConfigs: ILogoProps = {
            link:{
                linkUrl: {
                    destinationUrl: 'https://ppe.fabrikam.com/fe'
                }
            },
            image: {
                src: 'https://img-prod-cms-mr-microsoft-com.akamaized.net/cms/api/fabrikam/imageFileData/MA1G3L',
                imageSettings: defaultImageSettings
            },
            gridSettings: MockUtillities.mockAuthContext.request.gridSettings,
            className: 'mock-class'
        };

        const component = render(<Logo {...mockConfigs}/>);
        expect(component).toMatchSnapshot();
    });

    it('render correctly with image and no link', () => {
        const mockConfigs: ILogoProps = {
            image: {
                src: 'https://img-prod-cms-mr-microsoft-com.akamaized.net/cms/api/fabrikam/imageFileData/MA1G3L',
                imageSettings: defaultImageSettings
            },
            gridSettings: MockUtillities.mockAuthContext.request.gridSettings,
        };

        const component = render(<Logo {...mockConfigs}/>);
        expect(component).toMatchSnapshot();
    });

    it('render correctly without image settings', () => {
        const mockConfigs: ILogoProps = {
            image: {
                src: 'https://img-prod-cms-mr-microsoft-com.akamaized.net/cms/api/fabrikam/imageFileData/MA1G3L',
                imageSettings: undefined
            },
            gridSettings: MockUtillities.mockAuthContext.request.gridSettings
        };

        const component = render(<Logo {...mockConfigs}/>);
        expect(component).toMatchSnapshot();
    });
});