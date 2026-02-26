<?php

declare(strict_types=1);

namespace Rollpix\DiscountBadge\Model\Config\Source;

use Magento\Framework\Data\OptionSourceInterface;

class BadgeStyle implements OptionSourceInterface
{
    /**
     * @inheritDoc
     */
    public function toOptionArray(): array
    {
        return [
            ['value' => 'filled', 'label' => __('Filled (solid background)')],
            ['value' => 'outline', 'label' => __('Outline (border only)')],
            ['value' => 'pill', 'label' => __('Pill (solid capsule)')],
            ['value' => 'pill_outline', 'label' => __('Pill Outline (capsule border)')],
            ['value' => 'text_only', 'label' => __('Text Only (no background)')],
        ];
    }
}
