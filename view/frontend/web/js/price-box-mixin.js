/**
 * Rollpix Discount Badge - PriceBox Mixin
 *
 * Extends Magento's priceBox widget to update the discount badge
 * whenever prices are reloaded (e.g., configurable option change).
 */
define([
    'jquery',
    'Rollpix_DiscountBadge/js/badge-renderer',
    'jquery-ui-modules/widget'
], function ($, badgeRenderer) {
    'use strict';

    return function (widget) {
        $.widget('mage.priceBox', widget, {

            /**
             * Override reloadPrice to add badge update after price refresh
             */
            reloadPrice: function () {
                this._super();

                try {
                    badgeRenderer.updateBadge(this.element);
                } catch (e) {
                    // Non-destructive: never break price rendering
                }
            }
        });

        return $.mage.priceBox;
    };
});
