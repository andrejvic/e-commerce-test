<?php

namespace App\Models;
require_once __DIR__ . '/../Abstract/Category.php';
use App\Models\Abstract\Category;

var_dump(class_exists('App\Models\Abstract\Category')); 


class ConcreteCategory extends Category {
    public function toArray(): array {
        return [
            'id' => $this->id,
            'name' => $this->name,
        ];
    }
}
