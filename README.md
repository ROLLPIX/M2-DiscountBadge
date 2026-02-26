# Rollpix_DiscountBadge

> **[Versión en español](README.es.md)**

**SPONSOR:** [www.rollpix.com](https://www.rollpix.com)

Dynamic discount percentage badge for Magento 2 product prices. Displays a visual badge (e.g., `21% OFF`) next to the strikethrough price wherever Magento renders prices with a discount.

## Compatibility

| Requirement | Version |
|---|---|
| Magento | 2.4.7 ~ 2.4.8 |
| PHP | 8.1 ~ 8.3 |

## Installation

### Via Composer (recommended)

```bash
composer require rollpix/module-discount-badge
bin/magento module:enable Rollpix_DiscountBadge
bin/magento setup:upgrade
bin/magento cache:flush
```

### Manual installation

1. Create the directory `app/code/Rollpix/DiscountBadge/`
2. Copy all repository files there
3. Run:

```bash
bin/magento module:enable Rollpix_DiscountBadge
bin/magento setup:upgrade
bin/magento cache:flush
```

## Admin Configuration

Navigate to **Stores > Configuration > Rollpix > Discount Badge**.

### General Settings

| Field | Description | Default |
|---|---|---|
| Enabled | Enable/disable the badge globally | No |
| Minimum Discount (%) | Threshold to show badge (1-99) | 5 |
| Badge Text Template | Text template with `{discount}` placeholder | `{discount}% OFF` |
| Badge Position | Where to place the badge (inline, over image, below price) | After old price |
| Badge Style | Visual variant: filled, outline, pill, pill_outline, text_only | Filled |

### PDP & Listing Styles

Independent style settings for Product Detail Page and Product Listing contexts:

- Background Color
- Text Color
- Font Size (px)
- Border Radius (px)
- Padding
- Font Weight

### Custom CSS

Free-form CSS textarea injected in `<head>` for per-store overrides.

## What It Does

- Calculates discount percentage: `round(((regular_price - final_price) / regular_price) * 100)`
- Displays a badge next to the strikethrough (old) price
- Works in **all contexts**: category pages, product detail pages, widgets, search results, related/upsell/crosssell blocks
- Updates dynamically when configurable product options change the price
- Respects special prices, catalog price rules, tier prices — reads whatever Magento already calculated
- Five visual styles: Filled, Outline, Pill, Pill Outline, Text Only
- Seven position options including inline with price and over product image
- Independent styling for PDP vs. listing contexts
- Custom CSS field for per-store overrides
- Fully translatable text template per Store View

### Edge Cases

- `regular_price == final_price` → no badge
- `regular_price == 0` → no badge
- Discount ≤ 0% or ≥ 100% → no badge
- Discount < minimum threshold → no badge

## Behavior When Disabled

When the module is disabled in admin:

- No JavaScript is loaded
- No CSS is injected (beyond the static base CSS which has no visual impact)
- No badge elements are rendered
- Zero performance overhead — the priceBox mixin short-circuits immediately

## Technical Architecture

### File Structure

```
M2-DiscountBadge/                          ← repo root
├── registration.php
├── composer.json
├── etc/
│   ├── module.xml
│   ├── config.xml                         # Default values
│   ├── acl.xml                            # ACL resource
│   └── adminhtml/
│       └── system.xml                     # Admin configuration
├── Model/
│   ├── Config.php                         # System config reader
│   └── Config/Source/
│       ├── BadgePosition.php              # Position options
│       ├── BadgeStyle.php                 # Style options
│       └── FontWeight.php                 # Font weight options
├── ViewModel/
│   └── DiscountBadge.php                  # Passes config to templates
├── view/frontend/
│   ├── layout/
│   │   └── default.xml                    # Injects config + CSS
│   ├── templates/
│   │   ├── badge-config.phtml             # x-magento-init JSON config
│   │   └── custom-css.phtml               # Custom CSS injection
│   ├── web/
│   │   ├── js/
│   │   │   ├── badge-renderer.js          # Shared badge logic
│   │   │   ├── discount-badge.js          # Init module (scans priceBoxes)
│   │   │   └── price-box-mixin.js         # PriceBox widget mixin
│   │   └── css/
│   │       └── discount-badge.css         # Base structural styles
│   └── requirejs-config.js                # Mixin registration
├── i18n/
│   ├── en_US.csv
│   └── es_AR.csv
├── README.md
├── README.es.md
└── LICENSE
```

### How It Works

1. **PHP side**: `ViewModel/DiscountBadge.php` reads admin config and outputs it as a `x-magento-init` JSON block
2. **JS init**: `discount-badge.js` stores config and scans existing priceBox widgets
3. **Mixin**: `price-box-mixin.js` hooks into `reloadPrice()` to update badges on price changes
4. **Renderer**: `badge-renderer.js` handles calculation, DOM creation, and placement

### Performance

- 100% client-side — no additional server requests
- Compatible with Full Page Cache (FPC) and Varnish
- No impact on TTFB
- All blocks are cacheable
- Config does not vary per customer session

### CSS Classes

| Class | Description |
|---|---|
| `.rollpix-discount-badge` | Base class |
| `.rollpix-discount-badge--pdp` | Product detail page context |
| `.rollpix-discount-badge--listing` | Listing context |
| `.rollpix-discount-badge--inline` | Inline with price |
| `.rollpix-discount-badge--over-image` | Over product image |
| `.rollpix-discount-badge--below` | Below price block |
| `.rollpix-discount-badge--filled` | Filled style |
| `.rollpix-discount-badge--outline` | Outline style |
| `.rollpix-discount-badge--pill` | Pill style |
| `.rollpix-discount-badge--pill-outline` | Pill outline style |
| `.rollpix-discount-badge--text-only` | Text only style |

## Manual Testing Guide

1. Enable the module in **Stores > Configuration > Rollpix > Discount Badge**
2. Create or find a product with a special price or catalog price rule
3. Verify the badge appears on:
   - Category listing page
   - Product detail page
   - Search results
   - Related/upsell/crosssell widgets
4. For a configurable product, change options and verify the badge updates
5. Set minimum discount to a value above the product's discount and verify the badge disappears
6. Test each position and style option
7. Test custom CSS injection
8. Disable the module and verify no badges appear

## Uninstall

### Via Composer

```bash
bin/magento module:disable Rollpix_DiscountBadge
composer remove rollpix/module-discount-badge
bin/magento setup:upgrade
bin/magento cache:flush
```

### Manual

```bash
bin/magento module:disable Rollpix_DiscountBadge
rm -rf app/code/Rollpix/DiscountBadge
bin/magento setup:upgrade
bin/magento cache:flush
```

## License

[MIT](LICENSE)
