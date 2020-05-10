/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as Msdyn365 from '@msdyn365-commerce/core';
import * as React from 'react';

export interface ILogoProps {
    image: Msdyn365.IImageData;
    gridSettings?: Msdyn365.IGridSettings;
    link?: ILinkData;
    className?: string;
}

export interface ILinkData {
    linkUrl: Msdyn365.ILinkData;
    ariaLabel?: string;
    openInNewTab?: boolean;
    linkText?: string;
}

/**
 *
 * Logo component
 * @extends {React.PureComponent<ILogoConfig>}
 */
export class Logo extends React.PureComponent<ILogoProps> {
    public render():JSX.Element {
        return(
            <div className={this.props.className}>
                {this._renderLogo(this.props)}
            </div>
        );
    }

    private _renderLogo(config: ILogoProps):JSX.Element {
        if(config.link && config.link.linkUrl.destinationUrl) {
            return(
                <a
                    href={config.link.linkUrl.destinationUrl}
                    aria-label={config.link.ariaLabel}
                    target={config.link.openInNewTab ? '_blank' : undefined}
                >
                    {this._renderImage(config)}
                </a>
            );
        }
        return(
           this._renderImage(config)
        );
    }

    private _renderImage(config: ILogoProps): JSX.Element {
        const defaultImageSettings: Msdyn365.IImageSettings = {
            viewports: {
                xs: { q: `w=132&h=28&m=6`, w: 0, h: 0 },
                lg: { q: `w=160&h=48&m=6`, w: 0, h: 0 }
            },
            lazyload: true
        };

        return  (
            <Msdyn365.Image
                {...config.image}
                gridSettings={this.props.gridSettings!}
                imageSettings={config && config.image && config.image.imageSettings || defaultImageSettings}
                loadFailureBehavior='default'
            />
        );
    }
}

export default Logo;