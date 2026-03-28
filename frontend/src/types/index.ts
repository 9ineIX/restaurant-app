export interface User {
  IDUsers: number;
  FIO: string;
  Email: string;
  Phone: string;
  BirthDate: string;
  Role: {
    IDRoles: number;
    Name: string;
  };
  JobTitle: {
    IDJob_title: number;
    Name: string;
  };
  // Для совместимости со старым кодом
  role?: {
    IDRoles: number;
    Name: string;
  };
}

export interface Ingredient {
  IDIngredients: number;
  Name: string;
  Price: number;
  IDIngredients_categories: number;
  Category: {
    IDIngredients_categories: number;
    Name: string;
  };
}

export interface Dish {
  IDDishes: number;
  Name: string;
  Price: number;
  Description: string;
  IDDish_types: number;
  DishType: {
    IDDish_types: number;
    Name: string;
  };
  Ingredients: DishIngredient[];
}

export interface DishIngredient {
  IDDish_ingredients: number;
  IDDishes: number;
  IDIngredients: number;
  Quantity: number;
  Ingredient: Ingredient;
}

export interface Order {
  IDOrders: number;
  Price: number;
  IDUsers: number;
  IDStatus: number;
  User: {
    IDUsers: number;
    FIO: string;
    Email: string;
    Phone?: string;
  };
  Status: {
    IDStatus: number;
    Name: string;
  };
  Dishes: Dish[];
}

export interface DishMatch {
  dish: Dish;
  matchPercentage: number;
  intersection: number;
  missing: number;
  extra: number;
  missingIngredients: DishIngredient[];
  extraIngredients: number[];
}

export interface MatchResult {
  bestMatch: DishMatch | null;
  allMatches: DishMatch[];
}

export interface SelectedIngredient {
  id: number;
  quantity: number;
  ingredient: Ingredient;
}
