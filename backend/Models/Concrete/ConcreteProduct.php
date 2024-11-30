<?php

namespace App\Models\Concrete;

class ConcreteProduct extends Product {
    public function toArray(): array {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'inStock' => $this->inStock,
            'description' => $this->description,
            'categoryId' => $this->categoryId,
            'brand' => $this->brand,
        ];
    }
}
?>