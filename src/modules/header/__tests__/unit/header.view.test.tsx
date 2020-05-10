/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { buildMockModuleProps } from '@msdyn365-commerce/core';
import { render } from 'enzyme';
import * as React from 'react';
import { IHeaderViewProps } from '../../header';
import { IHeaderData } from '../../header.data';
import { IHeaderProps } from '../../header.props.autogenerated';
import HeaderView from '../../header.view';
import * as MockUtillities from '../../utilities/mock-utilities';

describe('Header view tests', () => {
    it('render correctly no sign in info', () => {
        const moduleProps: IHeaderProps<IHeaderData> = buildMockModuleProps({},{}, MockUtillities.mockHeaderConfig) as IHeaderProps<IHeaderData>;
        const mockProps: IHeaderViewProps = {
            ...moduleProps,
            logo: '{LogoComponent}',
            wishListIconDesktop: '{WishlistIconDesktop}',
            wishListIconMobile: '{WishlistIconMobile}',
            cartIcon: '{CartIcon}',
            navIcon: '{NavIcon}',
            resources: MockUtillities.mockResources,
            context: MockUtillities.mockAnonContext,
            mobileMenuCollapsed: false,
            signinPopoverOpen: true,
            className:'mock-class',
            menuBar: ['{NavigationMenu}'],
            search: ['{Search}'],
            HeaderTag: { moduleProps, className: 'module-class-HeaderTag' },
            HeaderContainer: { className: 'module-class-HeaderContainer' },
            HeaderTopBarContainer: { className: 'module-class-HeaderTopBar' },
            MobileMenuContainer: { className: 'module-class-MobileMenu' },
            MobileMenuBodyContainer: { className: 'module-class-MobileMenuBody' },
            MobileMenuLinksContainer: { className: 'module-class-MobileMenuLinks' },
            MobileMenuHeader: 'mobile-menu-header',
            Divider: {className: 'module-class-Divider'}
        };

        const view = render(<HeaderView {...mockProps}/>);
        expect(view).toMatchSnapshot();
    });

    it('render correctly no signed out', () => {
        const moduleProps: IHeaderProps<IHeaderData> = buildMockModuleProps({},{}, MockUtillities.mockHeaderConfig) as IHeaderProps<IHeaderData>;
        const mockProps: IHeaderViewProps = {
            ...moduleProps,
            logo: '{LogoComponent}',
            wishListIconDesktop: '{WishlistIconDesktop}',
            wishListIconMobile: '{WishlistIconMobile}',
            cartIcon: '{CartIcon}',
            navIcon: '{NavIcon}',
            resources: MockUtillities.mockResources,
            context: MockUtillities.mockAnonContext,
            mobileMenuCollapsed: false,
            signinPopoverOpen: true,
            className:'mock-class',
            menuBar: ['{NavigationMenu}'],
            search: ['{Search}'],
            MobileMenuContainer: { className: 'module-class-MobileMenu' },
            MobileMenuBodyContainer: { className: 'module-class-MobileMenuBody' },
            MobileMenuLinksContainer: { className: 'module-class-MobileMenuLinks' },
            MobileMenuHeader: 'mobile-menu-header',
            HeaderTag: { moduleProps, className: 'module-class-HeaderTag' },
            HeaderContainer: { className: 'module-class-HeaderContainer' },
            HeaderTopBarContainer: { className: 'module-class-HeaderTopBar' },
            AccountInfoDropdownParentContainer: { className: 'module-class-AccountInfoDropdownParent' },
            signInLink: '{SignIn}',
            Divider: {className: 'module-class-Divider'}
        };

        const view = render(<HeaderView {...mockProps}/>);
        expect(view).toMatchSnapshot();
    });

    it('render correctly signed in', () => {
        const moduleProps: IHeaderProps<IHeaderData> = buildMockModuleProps({},{}, MockUtillities.mockHeaderConfig) as IHeaderProps<IHeaderData>;
        const mockProps: IHeaderViewProps = {
            ...moduleProps,
            logo: '{LogoComponent}',
            wishListIconDesktop: '{WishlistIconDesktop}',
            wishListIconMobile: '{WishlistIconMobile}',
            cartIcon: '{CartIcon}',
            navIcon: '{NavIcon}',
            resources: MockUtillities.mockResources,
            context: MockUtillities.mockAnonContext,
            mobileMenuCollapsed: false,
            signinPopoverOpen: true,
            className:'mock-class',
            menuBar: ['{NavigationMenu}'],
            search: ['{Search}'],
            MobileMenuContainer: { className: 'module-class-MobileMenu' },
            MobileMenuBodyContainer: { className: 'module-class-MobileMenuBody' },
            MobileMenuLinksContainer: { className: 'module-class-MobileMenuLinks' },
            MobileMenuHeader: 'mobile-menu-header',
            HeaderTag: { moduleProps, className: 'module-class-HeaderTag' },
            HeaderContainer: { className: 'module-class-HeaderContainer' },
            HeaderTopBarContainer: { className: 'module-class-HeaderTopBar' },
            AccountInfoDropdownParentContainer: { className: 'module-class-AccountInfoDropdownParent' },
            AccountInfoDropdownPopoverConentContainer: { className: 'module-class-AccountInfoDropdownPopoverConent' },
            accountInfoDropdownButton: '{accountInfoDropdownButton}',
            signOutLink: '{SignOut}',
            accountLinks: [
                '{accountLink1}',
                '{accountLink2}',
                '{accountLink3}'
            ],
            Divider: {className: 'module-class-Divider'}
        };

        const view = render(<HeaderView {...mockProps}/>);
        expect(view).toMatchSnapshot();
    });
});