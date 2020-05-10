/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IHeaderViewProps } from '@msdyn365-commerce-modules/header';
import { Collapse, Drawer, Module, Node } from '@msdyn365-commerce-modules/utilities';
import { AsyncResult } from '@msdyn365-commerce/core';
import { Customer } from '@msdyn365-commerce/retail-proxy';
import classnames from 'classnames';
import * as React from 'react';

const headerView: React.FC<IHeaderViewProps> = props => {
    const {
        HeaderTag,
        HeaderContainer,
        HeaderTopBarContainer,
        Divider,
    } = props;
    return (
        <Module {...HeaderTag}>
            <Node {...HeaderContainer}>
                <Node {...HeaderTopBarContainer}>
                    {props.navIcon}
                    {props.logo}
                    {_renderReactFragment(props.search)}
                    {_renderAccountBlock(props, false)}
                    {props.wishListIconDesktop}
                    <Node {...Divider}/>
                    {props.cartIcon}
                </Node>
                {_renderCollapseMenu(props)}
                <Node className={'ms-header__desktop-view'}>
                    {_renderReactFragment(props.menuBar)}
                </Node>
            </Node>
        </Module>
    );
};

function _renderCollapseMenu(props: IHeaderViewProps): JSX.Element | null {
    const {Divider, MobileMenuLinksContainer, mobileMenuCollapsed} = props;
    return (
        <Collapse className={'ms-header__collapsible-hamburger'} isOpen={!mobileMenuCollapsed}>
            <Node {...MobileMenuLinksContainer}>
                {_renderReactFragment(props.search)}
                {_renderMobileAccountBlock(props, true)}
                { props.wishListIconMobile }
            </Node>
            <Node {...Divider}/>
            {_renderReactFragment(props.menuBar)}
        </Collapse>
    );
}
const renderCustomerName = (accountInformation: AsyncResult<Customer>): React.ReactChild => {
    const customer = accountInformation && accountInformation.result;
    return (
        <>{customer && customer.FirstName}</>
    );
};

function _renderMobileAccountBlock(props: IHeaderViewProps, renderForMobile: boolean): JSX.Element | null {
    const {
        AccountInfoDropdownParentContainer,
        signOutLink,
        signInLink,
        data,
        accountLinks} = props;

    if (AccountInfoDropdownParentContainer) {
        const accountClassName = classnames('ms-header__drawer', AccountInfoDropdownParentContainer.className, renderForMobile ? 'account-mobile' : 'account-desktop');

        if (accountLinks) {
            return (
                <Drawer className={accountClassName} openGlyph='ms-header__drawer-open' closeGlyph='ms-header__drawer-close' glyphPlacement='end' toggleButtonText={renderCustomerName(data.accountInformation)}>
                    <div>
                        { accountLinks ? accountLinks.map((link: React.ReactNode) => link) : false }
                        {signOutLink}
                    </div>
                </Drawer>
            );
        } else if (signInLink) {
            return (
                <Node {...AccountInfoDropdownParentContainer} className={accountClassName}>
                    {signInLink}
                </Node>
            );
        }
    }
    return null;
}

function _renderAccountBlock(props: IHeaderViewProps, renderForMobile: boolean): JSX.Element | null {
    const {
        AccountInfoDropdownParentContainer,
        AccountInfoDropdownPopoverConentContainer,
        accountInfoDropdownButton,
        signOutLink,
        signInLink,
        accountLinks,
    } = props;

    if (AccountInfoDropdownParentContainer) {
        const accountClassName = classnames(AccountInfoDropdownParentContainer.className, renderForMobile ? 'account-mobile' : 'account-desktop');
        if (AccountInfoDropdownPopoverConentContainer) {
            return (
                <Node {...AccountInfoDropdownParentContainer} className={accountClassName}>
                    {accountInfoDropdownButton}
                    <Node {...AccountInfoDropdownPopoverConentContainer}>
                        { accountLinks ? accountLinks.map((link: React.ReactNode) => link) : false }
                        {signOutLink}
                    </Node>
                </Node>
            );
        } else if (signInLink) {
            return (
                <Node {...AccountInfoDropdownParentContainer} className={accountClassName}>
                    {signInLink}
                </Node>
            );
        }
    }

    return null;
}

function _renderReactFragment(items: React.ReactNode[]): JSX.Element | null {
    return (
        <React.Fragment>
            {items && items.length
                ? items.map((slot: React.ReactNode, index: number) => {
                      return <React.Fragment key={index}>{slot}</React.Fragment>;
                  })
                : null}
        </React.Fragment>
    );
}

export default headerView;