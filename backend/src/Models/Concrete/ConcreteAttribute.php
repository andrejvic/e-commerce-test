<?php

namespace App\Models\Concrete;

use App\Models\Abstract\Attribute;

class ConcreteAttribute extends Attribute
{
    public function toArray(): array
    {
        return [
            'id'=> $this->id,
            'productId'=> $this->productId,
            'name'=> $this->attributeName,
            'value'=> $this->value,
        ];
    }
}