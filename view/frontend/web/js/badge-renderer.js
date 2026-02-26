/**
 * Rollpix Discount Badge - Badge Renderer
 *
 * Shared module that handles badge calculation, creation, and placement.
 * Used by both the init module (discount-badge.js) and the priceBox mixin.
 */
define(['jquery'], function ($) {
    'use strict';

    var config = null;
    var BADGE_CLASS = 'rollpix-discount-badge';

    var renderer = {

        /**
         * Store configuration from admin
         * @param {Object} cfg
         */
        setConfig: function (cfg) {
            config = cfg;
        },

        /**
         * Check if module is enabled and configured
         * @returns {boolean}
         */
        isEnabled: function () {
            return config !== null && config.enabled;
        },

        /**
         * Update or create badge for a priceBox element
         * @param {jQuery} $priceBox
         */
        updateBadge: function ($priceBox) {
            if (!this.isEnabled()) {
                return;
            }

            try {
                var prices = this._getPrices($priceBox);

                if (!prices) {
                    return;
                }

                var oldPrice = prices.oldPrice ? prices.oldPrice.amount : 0;
                var finalPrice = prices.finalPrice ? prices.finalPrice.amount : 0;
                var discount = this._calculateDiscount(oldPrice, finalPrice);

                this._renderBadge($priceBox, discount);
            } catch (e) {
                // Non-destructive: badge errors must not break price functionality
                if (window.console) {
                    console.warn('Rollpix DiscountBadge:', e);
                }
            }
        },

        /**
         * Get price data from priceBox widget
         * @param {jQuery} $priceBox
         * @returns {Object|null}
         */
        _getPrices: function ($priceBox) {
            var widget = $priceBox.data('magePriceBox');

            if (!widget) {
                return null;
            }

            // cache.displayPrices is populated after first reloadPrice
            if (widget.cache && widget.cache.displayPrices) {
                return widget.cache.displayPrices;
            }

            // Fallback to initial options
            return widget.options && widget.options.prices ? widget.options.prices : null;
        },

        /**
         * Calculate discount percentage
         * @param {number} oldPrice
         * @param {number} finalPrice
         * @returns {number}
         */
        _calculateDiscount: function (oldPrice, finalPrice) {
            if (!oldPrice || oldPrice <= 0 || !finalPrice || finalPrice <= 0) {
                return 0;
            }

            if (oldPrice <= finalPrice) {
                return 0;
            }

            return Math.round(((oldPrice - finalPrice) / oldPrice) * 100);
        },

        /**
         * Render or update badge for a priceBox
         * @param {jQuery} $priceBox
         * @param {number} discount
         */
        _renderBadge: function ($priceBox, discount) {
            var badgeId = this._getBadgeId($priceBox);
            var $existing = $('[data-rollpix-badge="' + badgeId + '"]');

            // Remove badge if discount is below threshold or invalid
            if (discount < config.minDiscount || discount >= 100 || discount <= 0) {
                $existing.remove();
                return;
            }

            var text = config.textTemplate.replace('{discount}', discount);

            // Update existing badge text if already placed
            if ($existing.length) {
                $existing.text(text);
                return;
            }

            // Create and place new badge
            var $badge = this._createBadgeElement(text, badgeId);
            this._placeBadge($priceBox, $badge);
        },

        /**
         * Generate a unique badge ID based on product ID
         * @param {jQuery} $priceBox
         * @returns {string}
         */
        _getBadgeId: function ($priceBox) {
            var productId = $priceBox.data('productId') ||
                $priceBox.attr('data-product-id') ||
                $priceBox.closest('[data-product-id]').data('productId') ||
                $priceBox.closest('[data-product-id]').attr('data-product-id');

            if (!productId) {
                // Fallback: use element index as identifier
                productId = 'idx-' + $('[data-role="priceBox"]').index($priceBox);
            }

            return 'badge-' + productId;
        },

        /**
         * Create the badge DOM element with appropriate classes and inline styles
         * @param {string} text
         * @param {string} badgeId
         * @returns {jQuery}
         */
        _createBadgeElement: function (text, badgeId) {
            var isPdp = $('body').hasClass('catalog-product-view');
            var styles = isPdp ? config.pdpStyles : config.listingStyles;
            var badgeStyle = config.badgeStyle;
            var position = styles.position;

            // Build CSS classes
            var classes = [BADGE_CLASS];

            // Context class
            classes.push(isPdp ? BADGE_CLASS + '--pdp' : BADGE_CLASS + '--listing');

            // Position class
            if (position.indexOf('over_image') === 0) {
                classes.push(BADGE_CLASS + '--over-image');
                var posKey = position.replace('over_image_', '');
                classes.push(BADGE_CLASS + '--' + posKey.replace(/_/g, '-'));
            } else if (position === 'below_price') {
                classes.push(BADGE_CLASS + '--below');
            } else if (position === 'left_of_old_price' || position === 'right_of_old_price') {
                classes.push(BADGE_CLASS + '--inline');
            }

            // Style class
            classes.push(BADGE_CLASS + '--' + badgeStyle.replace(/_/g, '-'));

            // Build inline styles
            var css = this._computeInlineStyles(badgeStyle, styles);

            return $('<span></span>')
                .addClass(classes.join(' '))
                .attr('data-rollpix-badge', badgeId)
                .css(css)
                .text(text);
        },

        /**
         * Compute inline CSS based on badge style and config
         * @param {string} badgeStyle
         * @param {Object} styles
         * @returns {Object}
         */
        _computeInlineStyles: function (badgeStyle, styles) {
            var css = {};

            switch (badgeStyle) {
                case 'filled':
                    css.backgroundColor = styles.backgroundColor;
                    css.color = styles.color;
                    css.borderRadius = styles.borderRadius;
                    css.padding = styles.padding;
                    break;

                case 'pill':
                    css.backgroundColor = styles.backgroundColor;
                    css.color = styles.color;
                    css.borderRadius = '999px';
                    css.padding = styles.padding;
                    break;

                case 'outline':
                    css.backgroundColor = 'transparent';
                    css.color = styles.backgroundColor;
                    css.border = '2px solid ' + styles.backgroundColor;
                    css.borderRadius = styles.borderRadius;
                    css.padding = styles.padding;
                    break;

                case 'pill_outline':
                    css.backgroundColor = 'transparent';
                    css.color = styles.backgroundColor;
                    css.border = '2px solid ' + styles.backgroundColor;
                    css.borderRadius = '999px';
                    css.padding = styles.padding;
                    break;

                case 'text_only':
                    css.backgroundColor = 'transparent';
                    css.color = styles.backgroundColor;
                    css.border = 'none';
                    css.padding = '0';
                    break;
            }

            css.fontSize = styles.fontSize;
            css.fontWeight = styles.fontWeight;

            return css;
        },

        /**
         * Place the badge in the DOM according to configured position
         * @param {jQuery} $priceBox
         * @param {jQuery} $badge
         */
        _placeBadge: function ($priceBox, $badge) {
            var isPdp = $('body').hasClass('catalog-product-view');
            var styles = isPdp ? config.pdpStyles : config.listingStyles;
            var position = styles.position;

            switch (position) {
                case 'right_of_old_price':
                    this._placeInline($priceBox, $badge, 'right');
                    break;

                case 'left_of_old_price':
                    this._placeInline($priceBox, $badge, 'left');
                    break;

                case 'below_price':
                    $priceBox.after($badge);
                    break;

                default:
                    // over_image positions
                    if (position.indexOf('over_image') === 0) {
                        this._placeOverImage($priceBox, $badge);
                    }
                    break;
            }
        },

        /**
         * Place badge inline with the old price using a flex wrapper
         * to guarantee both elements stay on the same line.
         * @param {jQuery} $priceBox
         * @param {jQuery} $badge
         * @param {string} side - 'left' or 'right'
         */
        _placeInline: function ($priceBox, $badge, side) {
            var $oldPrice = $priceBox.find('.old-price').first();

            if ($oldPrice.length) {
                // Reuse existing wrapper or create one
                var $wrapper = $oldPrice.parent('.rollpix-discount-badge-wrapper');

                if (!$wrapper.length) {
                    $oldPrice.wrap('<span class="rollpix-discount-badge-wrapper"></span>');
                    $wrapper = $oldPrice.parent();
                }

                if (side === 'right') {
                    $wrapper.append($badge);
                } else {
                    $wrapper.prepend($badge);
                }
            } else {
                // Fallback: append to priceBox
                $priceBox.append($badge);
            }
        },

        /**
         * Place badge over the product image
         * @param {jQuery} $priceBox
         * @param {jQuery} $badge
         */
        _placeOverImage: function ($priceBox, $badge) {
            var $imageContainer = this._findImageContainer($priceBox);

            if ($imageContainer.length) {
                $imageContainer.css('position', 'relative');
                $imageContainer.append($badge);
            }
        },

        /**
         * Find the product image container relative to the priceBox
         * @param {jQuery} $priceBox
         * @returns {jQuery}
         */
        _findImageContainer: function ($priceBox) {
            var isPdp = $('body').hasClass('catalog-product-view');

            if (isPdp) {
                return $('.gallery-placeholder, .fotorama-item, .product.media').first();
            }

            // Listing: image is typically a sibling area of the product details
            var $productItem = $priceBox.closest('.product-item, .product-item-info, .item');

            return $productItem.find('.product-image-container, .product-image-wrapper').first();
        }
    };

    return renderer;
});
