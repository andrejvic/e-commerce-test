<?php

namespace App\Models\Concrete;

use App\Models\Abstract\Category;

class ConcreteCategory extends Category
{
    public function toArray(): array
    {
        return [
            'id'=> $this->id,
            'name'=> $this->name,
        ];
    }
}

