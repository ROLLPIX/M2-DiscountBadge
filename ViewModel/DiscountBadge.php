<?php

declare(strict_types=1);

namespace Rollpix\DiscountBadge\ViewModel;

use Magento\Framework\View\Element\Block\ArgumentInterface;
use Rollpix\DiscountBadge\Model\Config;

class DiscountBadge implements ArgumentInterface
{
    public function __construct(
        private readonly Config $config
    ) {
    }

    public function isEnabled(): bool
    {
        return $this->config->isEnabled();
    }

    public function getJsConfig(): array
    {
        return [
            'enabled' => $this->config->isEnabled(),
            'minDiscount' => $this->config->getMinDiscount(),
            'textTemplate' => $this->config->getTextTemplate(),
            'badgeStyle' => $this->config->getBadgeStyle(),
            'pdpStyles' => $this->config->getPdpStyles(),
            'listingStyles' => $this->config->getListingStyles(),
        ];
    }

    public function getCustomCss(): string
    {
        return $this->config->getCustomCss();
    }
}
