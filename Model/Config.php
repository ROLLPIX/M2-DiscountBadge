<?php

declare(strict_types=1);

namespace Rollpix\DiscountBadge\Model;

use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Store\Model\ScopeInterface;

class Config
{
    private const XML_PATH_PREFIX = 'rollpix_discountbadge/';

    public function __construct(
        private readonly ScopeConfigInterface $scopeConfig
    ) {
    }

    public function isEnabled(): bool
    {
        return $this->scopeConfig->isSetFlag(
            self::XML_PATH_PREFIX . 'general/enabled',
            ScopeInterface::SCOPE_STORE
        );
    }

    public function getMinDiscount(): int
    {
        return (int) $this->scopeConfig->getValue(
            self::XML_PATH_PREFIX . 'general/min_discount',
            ScopeInterface::SCOPE_STORE
        );
    }

    public function getTextTemplate(): string
    {
        return (string) $this->scopeConfig->getValue(
            self::XML_PATH_PREFIX . 'general/text_template',
            ScopeInterface::SCOPE_STORE
        );
    }

    public function getBadgeStyle(): string
    {
        return (string) $this->scopeConfig->getValue(
            self::XML_PATH_PREFIX . 'general/badge_style',
            ScopeInterface::SCOPE_STORE
        );
    }

    public function getPdpStyles(): array
    {
        return $this->getStyleGroup('pdp_styles');
    }

    public function getListingStyles(): array
    {
        return $this->getStyleGroup('listing_styles');
    }

    public function getCustomCss(): string
    {
        return (string) $this->scopeConfig->getValue(
            self::XML_PATH_PREFIX . 'custom_css/custom_css',
            ScopeInterface::SCOPE_STORE
        );
    }

    private function getStyleGroup(string $group): array
    {
        $prefix = self::XML_PATH_PREFIX . $group . '/';

        return [
            'position' => (string) $this->scopeConfig->getValue(
                $prefix . 'position',
                ScopeInterface::SCOPE_STORE
            ),
            'backgroundColor' => (string) $this->scopeConfig->getValue(
                $prefix . 'background_color',
                ScopeInterface::SCOPE_STORE
            ),
            'color' => (string) $this->scopeConfig->getValue(
                $prefix . 'text_color',
                ScopeInterface::SCOPE_STORE
            ),
            'fontSize' => $this->scopeConfig->getValue(
                $prefix . 'font_size',
                ScopeInterface::SCOPE_STORE
            ) . 'px',
            'borderRadius' => $this->scopeConfig->getValue(
                $prefix . 'border_radius',
                ScopeInterface::SCOPE_STORE
            ) . 'px',
            'padding' => (string) $this->scopeConfig->getValue(
                $prefix . 'padding',
                ScopeInterface::SCOPE_STORE
            ),
            'fontWeight' => (string) $this->scopeConfig->getValue(
                $prefix . 'font_weight',
                ScopeInterface::SCOPE_STORE
            ),
        ];
    }
}
