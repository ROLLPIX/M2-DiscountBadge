/**
 * Rollpix Discount Badge - Initializer
 *
 * Initialized via x-magento-init with "*" target.
 * Stores config in badge-renderer and performs initial scan of priceBoxes.
 */
define([
    'jquery',
    'Rollpix_DiscountBadge/js/badge-renderer'
], function ($, badgeRenderer) {
    'use strict';

    return function (config) {
        badgeRenderer.setConfig(config);

        if (!config.enabled) {
            return;
        }

        /**
         * Scan all priceBox elements and update badges
         */
        function scanPriceBoxes() {
            $('[data-role="priceBox"]').each(function () {
                badgeRenderer.updateBadge($(this));
            });
        }

        // Initial scan: wait for priceBox widgets to initialize.
        // Magento initializes widgets asynchronously via data-mage-init.
        // We retry a few times to catch late-initializing widgets.
        var attempts = 0;
        var maxAttempts = 10;
        var scanner = setInterval(function () {
            scanPriceBoxes();
            attempts++;

            if (attempts >= maxAttempts) {
                clearInterval(scanner);
            }
        }, 300);

        // Handle dynamic content updates (AJAX, layered navigation, etc.)
        $(document).on('contentUpdated', function () {
            setTimeout(scanPriceBoxes, 300);
        });
    };
});
