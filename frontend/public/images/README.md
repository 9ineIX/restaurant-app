# Папка для изображений ингредиентов и блюд

## Структура папок:

```
/images/
├── ingredients/
│   ├── vegetables/
│   │   ├── tomato.jpg
│   │   ├── cucumber.jpg
│   │   └── ...
│   ├── meat/
│   │   ├── beef.jpg
│   │   ├── chicken.jpg
│   │   └── ...
│   └── ...
└── dishes/
    ├── caesar-salad.jpg
    ├── pasta.jpg
    └── ...
```

## Как добавить свои изображения:

1. **Создайте подпапки** по категориям
2. **Добавьте изображения** в формате `.jpg` или `.png`
3. **Обновите функции** в компонентах:
   - `getIngredientImage()` в `IngredientSelector.tsx`
   - `getDishImage()` в `MatchResult.tsx`

## Пример обновления функции:

```typescript
const getIngredientImage = (categoryName: string, ingredientName: string) => {
  // Локальные изображения
  if (categoryName === 'Овощи' && ingredientName === 'Помидоры') {
    return '/images/vegetables/tomato.jpg';
  }
  
  // Fallback на Unsplash
  return 'https://images.unsplash.com/photo-...';
};
```

## Рекомендуемые размеры:
- **Ингредиенты:** 60x60px
- **Блюда:** 400x300px
- **Формат:** JPG (для фото) или PNG (с прозрачностью)
