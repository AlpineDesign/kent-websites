/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { IMenuItemData, INavigationMenuViewProps } from '@msdyn365-commerce-modules/navigation-menu';
import { Drawer, Module, Node } from '@msdyn365-commerce-modules/utilities';
import classnames from 'classnames';
import * as React from 'react';

interface INavigationState {
  parentMenu?: number;
  activeMenu?: number;
  mobileViewLabelText?: string;
}

/**
 *
 * NavigationMenuView component
 * @extends {React.PureComponent<INavigationMenuViewProps>}
 */
export class NavigationMenuView extends React.PureComponent<INavigationMenuViewProps, INavigationState> {
  private supportedLevel: number = 2;
  private currentLevel: number = 0;
  private menuNode: React.RefObject<HTMLUListElement>;
  constructor(props: INavigationMenuViewProps) {
      super(props);
      this.menuNode = React.createRef();
      this.state = {activeMenu: undefined, mobileViewLabelText: '', parentMenu: undefined};
      this._closeSubmenu  =this._closeSubmenu.bind(this);
  }

  public componentDidMount(): void {
    document.body && document.body.addEventListener('mousedown',  this._handleClickOutside);
  }

  public componentWillUnmount(): void {
      document.body && document.body.removeEventListener('mousedown', this._handleClickOutside, false);
  }

  public render(): JSX.Element | null {
    const { isMobileView} = this.props;

    this.currentLevel = 1;
    return(
      <React.Fragment>
         {isMobileView
         ? this._renderMobileMenu()
         : this._renderDesktopMenu()
        }
      </React.Fragment>
    );
  }

  private _renderMobileMenu(): JSX.Element {
    const {isMobileView, menuItemData, Navigation}= this.props;
    return(
      <Module {...Navigation} className={classnames(Navigation.className, isMobileView? 'mobile-view': 'desktop-view')}>
          {menuItemData.map((menuItem: IMenuItemData) => {
            return this._renderDrawerMenu(menuItem);
          })}
      </Module>
    );
  }
  private _renderDesktopMenu(): JSX.Element {
    const { MenuList, Navigation} = this.props;
    return (
      <Module {...Navigation} className={classnames(Navigation.className)}>
        <Node { ...MenuList } ref={this.menuNode} tabIndex='-1'>
          {this._renderDisplay()}
        </Node>
       </Module>
    );
  }

  private _renderDrawerMenu(menuItem: IMenuItemData): JSX.Element | null {
    if (menuItem && menuItem.subMenu && menuItem.subMenu.length > 0) {
      return (this._renderDrawer(menuItem));
    } else {
      return (this._renderLinkMenuItem(menuItem));
    }
  }

  private _renderDrawer(menuItem: IMenuItemData): JSX.Element | null {
    const toggleButtonText= menuItem.linkText;
    return (
      <Drawer key={menuItem.id} className={'ms-nav__drawer'} openGlyph='ms-nav__drawer-open' closeGlyph= 'ms-nav__drawer-close' glyphPlacement='end' toggleButtonText={this._renderLinkText(toggleButtonText)}>
          <div>
            {menuItem.subMenu!.map((menuSubItem: IMenuItemData) => {
              return this._renderDrawerLink(menuSubItem);
            })}
          </div>
      </Drawer>
    );
  }

  private _renderLinkText(linkText: string | undefined): JSX.Element {
    return (
        <React.Fragment>
            {linkText}
        </React.Fragment>
    );
  }

  private _renderDrawerLink(item: IMenuItemData): JSX.Element | null {
    if (item && item.linkText && item.linkURL && item.linkURL.length > 0) {
      return (
        this._renderLinkMenuItem(item)
      );
    } else if (item && item.linkText && !item.linkURL) {
      return (
        this._renderSpanMenuItem(item)
      );
    }
    return null;
  }

  private _renderDisplay(): JSX.Element[] {
    const { ListItem, menuItemData, isMobileView} = this.props;
    const {activeMenu} = this.state;
    const menuItemList: JSX.Element[] = [];

    if (isMobileView &&  activeMenu !== undefined && menuItemData.length > 0) {
      let menuItem: IMenuItemData = {};
      for(let i = 0; i < menuItemData.length; i++) {
        if (menuItemData[i] && menuItemData[i].id === activeMenu) {
          menuItem = menuItemData[i];
          this.setState({parentMenu: undefined, mobileViewLabelText: menuItemData[i].linkText});
          break;
        }
        menuItem = this._getFromSubMenu(menuItemData[i]) as IMenuItemData;
        if (menuItem && menuItem.id === activeMenu) {
          break;
        }
      }

      menuItem && menuItemList.push (
        <Node key={menuItem.id} { ...ListItem}> {this._createMenuItemList(menuItem)} </Node>
      );
    } else {
      menuItemData.forEach((item: IMenuItemData, index: number) => {
        menuItemList.push (
          <Node key={index} { ...ListItem}>
              {this._createMenuItemList(item)}
          </Node>
        );
      });
    }

    return menuItemList;
  }

  private _getFromSubMenu(item?: IMenuItemData): IMenuItemData | null {
    const subMenus = item && item.subMenu;
    if (subMenus && subMenus.length > 0) {
      for(let i = 0; i <= subMenus.length-1; i++) {
        if (subMenus[i].id === this.state.activeMenu) {
            this.setState({parentMenu: item && item.id, mobileViewLabelText: subMenus[i].linkText});
            return subMenus[i];
        }
        const found = this._getFromSubMenu(subMenus[i]);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  private _createMenuItemList(menuItemData: IMenuItemData): JSX.Element | null {
    if (menuItemData && menuItemData.subMenu && menuItemData.subMenu.length > 0) {
      if (this.props.isMobileView && this.state.activeMenu !== undefined) {
        return (this._renderSubMenu(menuItemData.subMenu, menuItemData.id));
      } else {
        return (
          <React.Fragment>
            {this._renderButtonMenuItem(menuItemData)}
            {this._renderSubMenu(menuItemData.subMenu, menuItemData.id)}
          </React.Fragment>
        );
      }
    } else if (menuItemData && menuItemData.linkText && menuItemData.linkURL && menuItemData.linkURL.length > 0) {
      return (this._renderLinkMenuItem(menuItemData));
    } else if (menuItemData && menuItemData.linkText && !menuItemData.linkURL) {
      return (this._renderSpanMenuItem(menuItemData));
    }

    return null;
  }

  private _renderSubMenu(subMenus?: IMenuItemData[], activeMenu?: number): JSX.Element | null {
    const {isMobileView, ListItem} = this.props;
    if (activeMenu && this.state.activeMenu !== activeMenu) {
      return null;
    }

    if (!subMenus || subMenus.length === 0) {
      return null;
    }

    let levelClassName: string = '';
    const menuOptions = subMenus && subMenus.map((option: IMenuItemData, idx: number)  => {
      const hasOptions = (option.subMenu && option.subMenu.length > 0);
      let menuItem: JSX.Element | null;
      if (hasOptions && isMobileView) {
        menuItem = this._renderButtonMenuItem(option, activeMenu, idx);
      } else {
        menuItem = (option.linkURL
          ? this._renderLinkMenuItem(option, idx)
          : this._renderSpanMenuItem(option)
        );
      }

      let subMenu;

      if (hasOptions) {
        this.currentLevel++;
        if (this.currentLevel <= this.supportedLevel-1) {
          levelClassName = `level-${this.currentLevel.toString()}`;
          subMenu = this._renderSubMenu(option.subMenu, isMobileView ? option.id : undefined);
        }
      }

      return (
      <Node {...ListItem} key={ option.id }>
          { menuItem }
          { subMenu }
      </Node>
      );
    });

    return (this._renderMenu(levelClassName, menuOptions, activeMenu));
  }

  private _renderButtonMenuItem(option: IMenuItemData, activeMenu?: number, index?: number): JSX.Element | null {
    const {Button} = this.props;
    return (
          <Node
            key={index}
            {...Button}
            onClick={this._handleDropdownToggle(option, activeMenu)}
            onFocus={this._closeSubmenu}
            aria-haspopup={true}
            aria-expanded={this.state.activeMenu && this.state.activeMenu === option.id ? true : false}
            data-parent={activeMenu}
          >
            { option.linkText }
          </Node>
      );
  }

  private _renderLinkMenuItem(option: IMenuItemData, index?: number): JSX.Element | null {
    const {Link} = this.props;
    return (
      <Node {...Link} key={index} href={ option.linkURL }>
        { option.linkText }
      </Node>
    );
  }

  private _renderSpanMenuItem(option: IMenuItemData, index?: number): JSX.Element | null {
    const {Span} = this.props;
    return (
      <Node key={index} {...Span}>{ option.linkText }</Node>
    );
  }

  private _renderMenu(level: string, menuOptions: JSX.Element[], currentItem?: number): JSX.Element | null {
    const {MenuList} = this.props;
    this.currentLevel = 1;
    return (
      <Node {...MenuList} className={classnames(MenuList.className, level)}>
        { menuOptions }
      </Node>
    );
  }

  private _handleDropdownToggle = (data: IMenuItemData, parentId?: number) => () => {
    if (!this.props.isMobileView) {
      this.setState({
        activeMenu: (this.state.activeMenu && this.state.activeMenu === data.id!) ? undefined : data.id!,
        parentMenu: parentId
      });
    } else {
      this.setState({
        activeMenu: data.id,
        mobileViewLabelText: data.linkText!,
        parentMenu: parentId
      });
    }

    this._resetFocus();
  };

  private _resetFocus = () => {
    if (this.props.isMobileView) {
      setTimeout(() => {
        this.menuNode && this.menuNode.current && this.menuNode.current.focus();
      },         0);
    }
  }

  // tslint:disable-next-line:no-any
  private _handleClickOutside = (event: any) => {
    if (this.menuNode.current && !this.menuNode.current.contains(event.target)) {
      this.setState({activeMenu:undefined, mobileViewLabelText: ''});
    }
  };

  private _closeSubmenu():void {
    if (!this.props.isMobileView) {
      this.setState({activeMenu:undefined, mobileViewLabelText: ''});
    }
  }
}

export default NavigationMenuView;