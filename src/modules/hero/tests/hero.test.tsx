/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { buildMockModuleProps} from '@msdyn365-commerce/core-internal';
/// <reference types="jest" />

// tslint:disable-next-line:no-unused-variable
import * as React from 'react';
import * as renderer from 'react-test-renderer';

import Hero from '../hero';
import { IHeroData } from '../hero.data';
import {
  IHeroConfig,
  IHeroProps
} from '../hero.props.autogenerated';

const mockData: IHeroData = {
  actionResponse: {
    text: 'Sample Response Data'
  }
};

const mockConfig: IHeroConfig = {
  showText: 'hero'
};

const mockActions = {};

describe('Hero', () => {
  let moduleProps: IHeroProps<IHeroData>;
  beforeAll(() => {
    moduleProps = buildMockModuleProps(mockData, mockActions, mockConfig) as IHeroProps<IHeroData>;
  });
  it('renders correctly', () => {
    const component: renderer.ReactTestRenderer = renderer.create(
      <Hero {...moduleProps} />
    );
    const tree: renderer.ReactTestRendererJSON | null = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
