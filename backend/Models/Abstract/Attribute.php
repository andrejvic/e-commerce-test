<?php

namespace App\Models\Abstract;

abstract class Attribute {
    protected int $id;
    protected string $productId;
    protected string $attributeName;
    protected string $value;

    public function __construct(int $id, string $productId, string $attributeName, string $value) {
        $this->id = $id;
        $this->productId = $productId;
        $this->attributeName = $attributeName;
        $this->value = $value;
    }

    public function getId(): int {
        return $this->id;
    }

    public function getProductId(): string {
        return $this->productId;
    }

    public function getAttributeName(): string {
        return $this->attributeName;
    }

    public function getValue(): string {
        return $this->value;
    }

    abstract public function toArray(): array;
}
