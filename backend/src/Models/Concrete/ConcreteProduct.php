<?php

namespace App\Models\Concrete;

use App\Models\Abstract\Product;

class ConcreteProduct extends Product
{
    protected array $attributes = []; 
    protected array $gallery = [];
    protected array $prices = [];

    public function setAttributes(array $attributes): void
    {
        $this->attributes = $attributes;
    }

    public function getAttributes(): array
    {
        return $this->attributes;
    }

    public function setGallery(array $gallery): void
    {
        $this->gallery = $gallery;
    }

    public function getGallery(): array
    {
        return $this->gallery;
    }

    public function setPrices(array $prices): void
    {
        $this->prices = $prices;
    }

    public function getPrices(): array
    {
        return $this->prices;
    }

    public function toArray(): array
    {
        return [
            'id'            => $this->id,
            'name'          => $this->name,
            'description'   => $this->description,
            'inStock'       => $this->inStock,
            'category_id'   => $this->categoryId,
            'category_name' => $this->categoryName,
            'brand'         => $this->brand,
            'attributes'    => array_map(fn($attr) => $attr->toArray(), $this->attributes),
            'gallery'       => $this->gallery,
            'prices'        => $this->prices,
        ];
    }
}
 ?>