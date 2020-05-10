/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AsyncResult, buildMockModuleProps } from '@msdyn365-commerce/core';
import { ICartState } from '@msdyn365-commerce/global-state';
import { mount } from 'enzyme';
// tslint:disable-next-line:no-unused-variable
import * as React from 'react';

import Header, { IHeaderViewProps } from '../../header';
import headerView from '../../header.view';

import { IHeaderData } from '../../header.data';
import { IHeaderProps } from '../../header.props.autogenerated';
import * as MockUtillities from '../../utilities/mock-utilities';

import { Customer } from '@msdyn365-commerce/retail-proxy';

const mockActions = {};

describe('Header', () => {
  let moduleProps: IHeaderProps<IHeaderData>;

  beforeAll(() => {
    moduleProps = {
      ...buildMockModuleProps(
          MockUtillities.getMockData(0,'xyz',''),
          mockActions,
          MockUtillities.mockHeaderConfig,
          MockUtillities.mockAnonContext) as IHeaderProps<IHeaderData>,
          resources: MockUtillities.mockResources,
          // @ts-ignore
          renderView: jest.fn(props => { return <div props={props} />;})
    };
  });

  it('renders header view.', () => {
        const moduleProps2:IHeaderProps<IHeaderData> = {
                              ...moduleProps,
                              // @ts-ignore
                              renderView:headerView,
                              data: {
                                cart: {
                                  status:'FAILED',
                                  result: undefined
                                } as AsyncResult<ICartState>,
                                // @ts-ignore ignore partial mock
                                accountInformation: {
                                  status:'SUCCESS',
                                  result: {
                                    AccountNumber: 0,
                                    FirstName:  'Name'
                                  }
                                } as AsyncResult<Customer>
                              },
                              config: {
                                ...MockUtillities.mockHeaderConfig,
                                myAccountLinks: [
                                  {
                                    linkText: 'Link',
                                    linkUrl: { destinationUrl: 'www.test.com' }
                                  },
                                  {
                                    linkText: undefined,
                                    linkUrl: { destinationUrl: 'www.test.com' },
                                    openInNewTab: false,
                                  }
                                ]
                              }
                            };
        const wrapper = mount(<Header {...moduleProps2}/>);
        wrapper.find('.ms-header__nav-icon').at(0).simulate('click');
         // @ts-ignore
        wrapper.find('Popover').prop('toggle')();
        wrapper.find('.ms-header__nav-icon').at(0).simulate('click');
        expect(wrapper.state('mobileMenuCollapsed')).toBeTruthy();
        wrapper.unmount();
  });

  it('renders correctly', () => {
    const result = mount(<Header {...moduleProps}/>);
    expect(moduleProps.renderView).toBeCalled();
    const viewProps: IHeaderViewProps = result.childAt(0).props().props;
    expect(viewProps).toBeDefined();
   });

  it('fills slots properly when slots are not defined', () => {
    const result = mount(<Header {...moduleProps}/>);
    expect(moduleProps.renderView).toBeCalled();
    const viewProps: IHeaderViewProps = result.childAt(0).props().props;
    expect(viewProps).toBeDefined();
    expect(viewProps.menuBar.length).toEqual(0);
    expect(viewProps.search.length).toEqual(0);
   });

  it('fills slots properly when slots are defined', () => {
    const modulePropsWithSlots = {
      ...moduleProps,
      slots: {
        menuBar: [
          {}
        ],
        search: [
          {}
        ],
      }
    };
    const result = mount(<Header {...modulePropsWithSlots}/>);
    expect(moduleProps.renderView).toBeCalled();
    const viewProps: IHeaderViewProps = result.childAt(0).props().props;
    expect(viewProps).toBeDefined();
    expect(viewProps.menuBar.length).toEqual(1);
    expect(viewProps.search.length).toEqual(1);
   });

  it('all account related blocks should be null when not user is not present', () => {
    const modulePropsNoUser = {
      ...moduleProps,
      data: {
        cart: {
          status:'FAILED',
          result: undefined
        } as AsyncResult<ICartState>,
        accountInformation: {
          status:'FAILED',
          result: undefined
        } as AsyncResult<Customer>
      }
    };

    const result = mount(<Header {...modulePropsNoUser}/>);
    expect(moduleProps.renderView).toBeCalled();
    const viewProps: IHeaderViewProps = result.childAt(0).props().props;
    expect(viewProps).toBeDefined();
    expect(viewProps.AccountInfoDropdownParentContainer).not.toBeTruthy();
    expect(viewProps.AccountInfoDropdownPopoverConentContainer).not.toBeTruthy();
    expect(viewProps.signInLink).not.toBeTruthy();
    expect(viewProps.signOutLink).not.toBeTruthy();
    expect(viewProps.accountInfoDropdownButton).not.toBeTruthy();
    expect(viewProps.accountLinks).not.toBeTruthy();
   });

  it('sign in related blocks should be present when not user is not signed in', () => {
    const result = mount(<Header {...moduleProps}/>);
    expect(moduleProps.renderView).toBeCalled();
    const viewProps: IHeaderViewProps = result.childAt(0).props().props;
    expect(viewProps).toBeDefined();
    expect(viewProps.AccountInfoDropdownParentContainer).toBeTruthy();
    expect(viewProps.AccountInfoDropdownPopoverConentContainer).not.toBeTruthy();
    expect(viewProps.signInLink).toBeTruthy();
    expect(viewProps.signOutLink).not.toBeTruthy();
    expect(viewProps.accountInfoDropdownButton).not.toBeTruthy();
    expect(viewProps.accountLinks).not.toBeTruthy();
   });

  it('sign out and accounts related blocks should be present when not user is signed in but no account links in config', () => {
    const modulePropsWithUser = {
      ...moduleProps,
      data: {
        cart: {
          status:'FAILED',
          result: undefined
        } as AsyncResult<ICartState>,
        // @ts-ignore ignore partial mock
        accountInformation: {
          status:'SUCCESS',
          result: {
            AccountNumber: 0,
            FirstName:  'Name'
          }
        } as AsyncResult<Customer>
      }
    };

    const result = mount(<Header {...modulePropsWithUser}/>);
    expect(moduleProps.renderView).toBeCalled();
    const viewProps: IHeaderViewProps = result.childAt(0).props().props;
    expect(viewProps).toBeDefined();
    expect(viewProps.AccountInfoDropdownParentContainer).toBeTruthy();
    expect(viewProps.AccountInfoDropdownPopoverConentContainer).toBeTruthy();
    expect(viewProps.signInLink).not.toBeTruthy();
    expect(viewProps.signOutLink).toBeTruthy();
    expect(viewProps.accountInfoDropdownButton).toBeTruthy();
    expect(viewProps.accountLinks).not.toBeTruthy();
   });

  it('sign out and accounts related blocks should be present when not user is signed in and account links in config', () => {
    const modulePropsWithUser = {
      ...moduleProps,
      data: {
        cart: {
          status:'FAILED',
          result: undefined
        } as AsyncResult<ICartState>,
        // @ts-ignore ignore partial mock
        accountInformation: {
          status:'SUCCESS',
          result: {
            AccountNumber: 0,
            FirstName:  'Name'
          }
        } as AsyncResult<Customer>
      },
      config: {
        ...MockUtillities.mockHeaderConfig,
        myAccountLinks: [
          {
            linkText: 'Link',
            linkUrl: { destinationUrl: 'www.test.com' }
          },
          {
            linkText: undefined,
            linkUrl: { destinationUrl: 'www.test.com' },
            openInNewTab: false,
          }
        ]
      }
    };

    const result = mount(<Header {...modulePropsWithUser}/>);
    expect(moduleProps.renderView).toBeCalled();
    const viewProps: IHeaderViewProps = result.childAt(0).props().props;
    expect(viewProps).toBeDefined();
    expect(viewProps.AccountInfoDropdownParentContainer).toBeTruthy();
    expect(viewProps.AccountInfoDropdownPopoverConentContainer).toBeTruthy();
    expect(viewProps.signInLink).not.toBeTruthy();
    expect(viewProps.signOutLink).toBeTruthy();
    expect(viewProps.accountInfoDropdownButton).toBeTruthy();
    expect(viewProps.accountLinks).toBeTruthy();
   });
});
