/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { buildMockModuleProps } from '@msdyn365-commerce/core';
import { render } from 'enzyme';
import * as React from 'react';
import { IProductCollectionProps, ProductCollectionView } from '../../..';

describe('Product Collection unit tests - View', () => {
    it('renders correctly', () => {
        const moduleProps: IProductCollectionProps<{}>= buildMockModuleProps({}, {}) as IProductCollectionProps<{}>;
        const mockProps = {
            ...moduleProps,
            className: 'className',
            heading: <div>Trending now</div>,
            products:[],
            ProductCollectionContainer: { moduleProps, className: 'ms-product-collection' },
            SingleSlideCarouselComponentProps: { className: 'node-class-SingleSlideCarouselComponent' },
            GridComponentProps: {className: 'node-class-grid'},
            isCarousel: true
        };
        const component = render(<ProductCollectionView {...mockProps} />);
        expect(component).toMatchSnapshot();
    });
});