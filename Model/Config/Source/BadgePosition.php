<?php

declare(strict_types=1);

namespace Rollpix\DiscountBadge\Model\Config\Source;

use Magento\Framework\Data\OptionSourceInterface;

class BadgePosition implements OptionSourceInterface
{
    /**
     * @inheritDoc
     */
    public function toOptionArray(): array
    {
        return [
            ['value' => 'right_of_old_price', 'label' => __('Right of old price (same line)')],
            ['value' => 'left_of_old_price', 'label' => __('Left of old price (same line)')],
            ['value' => 'over_image_top_left', 'label' => __('Over image — top left')],
            ['value' => 'over_image_top_right', 'label' => __('Over image — top right')],
            ['value' => 'over_image_bottom_left', 'label' => __('Over image — bottom left')],
            ['value' => 'over_image_bottom_right', 'label' => __('Over image — bottom right')],
            ['value' => 'below_price', 'label' => __('Below price block')],
        ];
    }
}
