<?php

declare(strict_types=1);

namespace Rollpix\DiscountBadge\Model\Config\Source;

use Magento\Framework\Data\OptionSourceInterface;

class FontWeight implements OptionSourceInterface
{
    /**
     * @inheritDoc
     */
    public function toOptionArray(): array
    {
        return [
            ['value' => 'normal', 'label' => __('Normal')],
            ['value' => 'bold', 'label' => __('Bold')],
            ['value' => '600', 'label' => '600'],
            ['value' => '700', 'label' => '700'],
            ['value' => '800', 'label' => '800'],
        ];
    }
}
