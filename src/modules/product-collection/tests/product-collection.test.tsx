import * as React from 'react';

import { buildMockModuleProps, buildMockRequest, buildMockTelemetry, IRequestContext} from '@msdyn365-commerce/core';
import { IProductList, ProductSearchResult } from '@msdyn365-commerce/retail-proxy';
import {  mount } from 'enzyme';
import { IProductCollectionConfig, IProductCollectionProps, IProductCollectionResources, IProductCollectionViewProps, ProductCollectionModule } from '../../..';

const mockProduct: ProductSearchResult = {
    RecordId: 22565429819,
    ItemId: '81120',
    Name: 'Cotton Polo',
    Description: 'Casual shirts are made for the \u201cgood times\u201d.  Our custom fitting shirts are relaxed enough to be comfortable without looking baggy.',
    BasePrice: 59.99,
    Price: 59.99,
    TotalRatings: 182,
    AverageRating: 3.71428571428571,
    PrimaryImageUrl:'https://cms-ppe-imageresizer-mr.trafficmanager.net/cms/api/fabrikamsb/imageFileData/search?fileName=/Products%2F91032_000_001.png'
};

const mockProductCollection: ProductSearchResult[] = [];
mockProductCollection.push(mockProduct);

const mockProductList: IProductList = {
    products: mockProductCollection,
    listMetadata: {}
};

const mockResources: IProductCollectionResources = {
    priceFree: 'Free',
    originalPriceText: 'Original price',
    currentPriceText: 'Current price',
    ratingAriaLabel: 'average rating',
    flipperNext: 'next',
    flipperPrevious: 'previous'
};

// @ts-ignore
const mockRequest: IRequestContext = buildMockRequest();
// @ts-ignore
const mockContext: ICoreContext = {
    request: mockRequest,
     // @ts-ignore: Using partial for testing
     cultureFormatter: {
        formatCurrency: jest.fn(price => `$${price}`)
    }
};

const mockConfigs: IProductCollectionConfig = {
    productCollection: mockProductList,
};

describe('Product collection Module tests', () => {
    let moduleProps: IProductCollectionProps<{}>;
    const telemetry = buildMockTelemetry();

    it('Renders as expected when no product defined', () => {
        moduleProps = {
            ...buildMockModuleProps({}, mockConfigs, mockContext) as IProductCollectionProps<{}>,
            resources: mockResources,
            // @ts-ignore
            renderView: jest.fn(props => { return <div props={props} />;}),
        };

        moduleProps.telemetry = telemetry;
        const result = mount(<ProductCollectionModule {...moduleProps} />);

        expect(moduleProps.renderView).toBeCalled();

        const viewProps: IProductCollectionViewProps = result.childAt(0).props().props;
        expect(viewProps).toBeDefined();

        expect(viewProps.heading).not.toBeTruthy();
        expect(viewProps.products).not.toBeTruthy();
        result.unmount();
    });
});