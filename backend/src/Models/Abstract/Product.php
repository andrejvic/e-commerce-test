<?php

namespace App\Models\Abstract;

abstract class Product
{
    protected string $id;
    protected string $name;
    protected int $inStock;
    protected string $description;
    protected int $categoryId;
    protected string $brand;
    protected string $categoryName;

    public function __construct(
        string $id,
        string $name,
        int $inStock,
        string $description,
        int $categoryId,
        string $brand,
        string $categoryName = ""
    ) {
        $this->id = $id;
        $this->name = $name;
        $this->inStock = $inStock;
        $this->description = $description;
        $this->categoryId = $categoryId;
        $this->brand = $brand;
        $this->categoryName = $categoryName;
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getInStock(): int
    {
        return $this->inStock;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function getCategoryId(): int
    {
        return $this->categoryId;
    }

    public function getBrand(): string
    {
        return $this->brand;
    }

    public function getCategoryName(): string
    {
        return $this->categoryName;
    }

    abstract public function toArray(): array;
}
