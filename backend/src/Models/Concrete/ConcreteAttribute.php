<?php

namespace App\Models\Concrete;

class ConcreteAttribute extends Attribute {
    public function toArray(): array {
        return [
            'id' => $this->id,
            'productId' => $this->productId,
            'attributeName' => $this->attributeName,
            'value' => $this->value
        ];
    }
}
