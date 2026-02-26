/**
 * Rollpix Discount Badge - Initializer
 *
 * Initialized via x-magento-init with "*" target.
 * Stores config in badge-renderer and performs initial scan of priceBoxes.
 * Uses MutationObserver to support dynamically loaded content
 * (Page Builder widgets, AJAX, layered navigation, etc.).
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

        /**
         * Process a single DOM node: if it is or contains priceBox elements,
         * schedule badge updates for them.
         * @param {Node} node
         */
        function processDomNode(node) {
            if (node.nodeType !== Node.ELEMENT_NODE) {
                return;
            }

            var $el = $(node);

            if ($el.is('[data-role="priceBox"]')) {
                badgeRenderer.updateBadge($el);
            }

            $el.find('[data-role="priceBox"]').each(function () {
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

        // MutationObserver: detect priceBox elements added dynamically
        // (Page Builder product widgets, AJAX-loaded content, lazy-loaded blocks).
        if (typeof MutationObserver !== 'undefined') {
            var debounceTimer = null;
            var pendingNodes = [];

            var observer = new MutationObserver(function (mutations) {
                for (var i = 0; i < mutations.length; i++) {
                    var added = mutations[i].addedNodes;

                    for (var j = 0; j < added.length; j++) {
                        pendingNodes.push(added[j]);
                    }
                }

                // Debounce: batch-process nodes after DOM settles (100ms)
                if (debounceTimer) {
                    clearTimeout(debounceTimer);
                }

                debounceTimer = setTimeout(function () {
                    var nodes = pendingNodes.splice(0, pendingNodes.length);

                    for (var k = 0; k < nodes.length; k++) {
                        processDomNode(nodes[k]);
                    }
                }, 100);
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    };
});
