import * as React from 'react';

import { Button, format } from '@msdyn365-commerce-modules/utilities';
import { PriceComponent } from '@msdyn365-commerce/components';
import { IComponentProps } from '@msdyn365-commerce/core';
import { ICartState } from '@msdyn365-commerce/global-state';
import { Coupon } from '@msdyn365-commerce/retail-proxy/dist/Entities/CommerceTypes.g';

export interface IPromoCodeProps extends IComponentProps<{}> {
    cart: ICartState | undefined;
    promoCodeHeadingText: string;
    appliedPromoCodeHeadingText: string;
    removePromoAriaLabelFormat: string;
    promoPlaceholderText: string;
    promoCodeApplyButtonText: string;
    collapseTimeOut: number;
    removePromoText: string;
    invalidPromoCodeErrorText: string;
    failedToAddPromoCodeErrorText: string;
    duplicatePromoCodeErrorText: string;
    failedToRemovePromoCodeErrorText: string;
    promoCodeApplyCallback?(): void;
}

interface IPromoCodeState {
    isCollapseOpen: boolean;
    promoCodeInputValue: string;
    error: string;
    canApply: boolean;
}

/**
 *
 * The PromoCode component renders the promocode section.
 * @extends {React.PureComponent<IRefineSubmenuProps>}
 */
class PromoCode extends React.Component<IPromoCodeProps, IPromoCodeState> {

    constructor(props: IPromoCodeProps, state: IPromoCodeState) {
        super(props);
        this.state = {
            isCollapseOpen: false,
            promoCodeInputValue: '',
            error: '',
            canApply: false
        };
    }

    public render(): JSX.Element {
        return (
            <div>
                <div className='msc-promo-code-heading'>{this.props.promoCodeHeadingText}</div>
                {this._renderForm(this.props.promoPlaceholderText, this.props.promoCodeApplyButtonText, this.props.cart)}
                <p className={this.state.error ? 'msc-alert-danger' : ''}aria-live='assertive'>{this.state.error}</p>
                {this._renderAppliedPromoCode(this.props)}
            </div>
        );
    }

    private _onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const error = e.target.value === '' ? '' : this.state.error;
        this.setState({
            promoCodeInputValue: e.target.value, error: error,
            canApply: e.target.value ? true : false
        });
    }

    private _applyPromotion = (cartState: ICartState | undefined) => {
        if (!cartState || !cartState.cart) {
            return;
        }
        const appliedPromo = this.state.promoCodeInputValue;

        cartState.addPromoCode({ promoCode: appliedPromo })
            .then(result => {
                if (result.status === 'SUCCESS') {
                    // show success text
                    this.setState({ promoCodeInputValue: '', error: '', canApply: false});
                } else if (result.substatus === 'ALREADYADDED') {
                    this.setState({ error: this.props.duplicatePromoCodeErrorText });
                } else {
                    this.setState({ error: this.props.invalidPromoCodeErrorText });
                }
            })
            .catch(error => {
                this.setState({ error: this.props.failedToAddPromoCodeErrorText });
            });
    }

    private _renderForm = (promoPlaceholderText: string, promoCodeApplyButtonText: string, cartState: ICartState | undefined) => {
        const _onSubmit = (event: React.FormEvent<HTMLFormElement>) => {event.preventDefault(); this._applyPromotion(cartState);};
        const _applyPromotion = (event: React.MouseEvent<HTMLElement>) => {this._applyPromotion(cartState);};

        return (
            <form onSubmit={_onSubmit} className='msc-promo-code__form-container'>
                <div className='msc-promo-code__group'>
                    <input
                        className='msc-promo-code__input-box'
                        aria-label={promoPlaceholderText}
                        onChange={this._onInputChange}
                        value={this.state.promoCodeInputValue}
                        placeholder={promoPlaceholderText}
                    />
                    <Button
                        title={promoCodeApplyButtonText}
                        className='msc-promo-code__apply-btn btn'
                        onClick={_applyPromotion}
                        disabled={!this.state.canApply}
                    >
                        {promoCodeApplyButtonText}
                    </Button>
                </div>
            </form>
        );
    }

    private _removePromotion = (cartState: ICartState | undefined, event: React.MouseEvent) => {
        if (!cartState) {
            return;
        }
        const code = event.currentTarget.getAttribute('data-value') || '';
        cartState.removePromoCodes({
            promoCodes: [
                code
            ]
        })
            .then(result => {
                if (result.status === 'SUCCESS') {
                    this.setState({ error: ''});
                }
            })
            .catch(() => {
                this.setState({ error: this.props.failedToRemovePromoCodeErrorText});
            });

    }
    private _calculateDiscount = (code: string, cartState: ICartState | undefined) => {
        if (!cartState || !cartState.cart || !cartState.cart.CartLines || cartState.cart.CartLines.length === 0 || !code) {
            return;
        }
        let discountAmount = 0;
        for (const line of cartState.cart.CartLines) {
            if (line.DiscountLines) {
                for (const discountLine of line.DiscountLines) {
                    if (discountLine.DiscountCode === code) {
                        discountAmount += discountLine.DiscountCost!;
                    }
                }
            }
        }
        return discountAmount * -1;
    }

    private _renderAppliedPromoCode = (props: IPromoCodeProps) => {
        if (!props.cart || !props.cart.cart || !props.cart.cart.Coupons || !(props.cart.cart.Coupons.length > 0)) {
            return;
        }

        const _removePromotion = (event: React.MouseEvent<HTMLElement>) => {this._removePromotion(props.cart, event);};

        return (
            <>
                <div className='msc-promo-code__discount'>
                    <div className='msc-promo-code__discount-heading'>{this.props.appliedPromoCodeHeadingText}</div>
                    <PriceComponent
                        data={{
                            price: {
                                CustomerContextualPrice: props.cart.cart.DiscountAmount

                            }
                        }}
                        context = {props.context}
                        id = {props.id}
                        typeName = {props.typeName}
                        className = {'msc-promo-code__discount-value'}
                    />
                </div>
                {
                     props.cart.cart.Coupons.map((coupon: Coupon) => {
                        const ariaLabel = props.removePromoAriaLabelFormat ? format(props.removePromoAriaLabelFormat, props.removePromoText, coupon.Code) : '';

                        return (
                            <div key={coupon.Code} className='msc-promo-code__line-container'>
                                <div className='msc-promo-code__line-value'>
                                    {coupon.Code} (
                                        <PriceComponent
                                            data={{
                                                price: {
                                                    CustomerContextualPrice: this._calculateDiscount(coupon.Code || '', props.cart)

                                                }
                                            }}
                                            context = {props.context}
                                            id = {props.id}
                                            typeName = {props.typeName}
                                            className = {'msc-promo-code__line-discount-value'}
                                        />)
                                </div>
                                <Button
                                    title={props.removePromoText}
                                    className={'msc-promo-code__line__btn-remove'}
                                    onClick={_removePromotion}
                                    data-value={coupon.Code}
                                    aria-label={ariaLabel}
                                >
                                    {props.removePromoText}
                                </Button>
                            </div>
                        );
                    })
                }
            </>
        );
    }
}

export default PromoCode;