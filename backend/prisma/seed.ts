import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Очистка базы данных
  await prisma.orders.deleteMany();
  await prisma.dish_ingredients.deleteMany();
  await prisma.dishes.deleteMany();
  await prisma.ingredients.deleteMany();
  await prisma.ingredients_categories.deleteMany();
  await prisma.dish_types.deleteMany();
  await prisma.status.deleteMany();
  await prisma.users.deleteMany();
  await prisma.roles.deleteMany();
  await prisma.job_title.deleteMany();

  // Создание ролей
  const roles = await Promise.all([
    prisma.roles.create({ data: { Name: 'CLIENT' } }),
    prisma.roles.create({ data: { Name: 'EMPLOYEE' } }),
    prisma.roles.create({ data: { Name: 'ADMIN' } }),
  ]);

  // Создание должностей
  const jobTitles = await Promise.all([
    prisma.job_title.create({ data: { Name: 'Менеджер' } }),
    prisma.job_title.create({ data: { Name: 'Повар' } }),
    prisma.job_title.create({ data: { Name: 'Официант' } }),
  ]);

  // Создание пользователей
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const users = await Promise.all([
    prisma.users.create({
      data: {
        FIO: 'Иванов Иван Иванович',
        Email: 'client@example.com',
        Password: hashedPassword,
        Phone: '+7 (999) 123-45-67',
        BirthDate: new Date('1990-01-01'),
        IDRoles: roles[0].IDRoles,
        IDJob_title: jobTitles[0].IDJob_title,
      },
    }),
    prisma.users.create({
      data: {
        FIO: 'Петров Петр Петрович',
        Email: 'employee@example.com',
        Password: hashedPassword,
        Phone: '+7 (999) 234-56-78',
        BirthDate: new Date('1985-05-15'),
        IDRoles: roles[1].IDRoles,
        IDJob_title: jobTitles[1].IDJob_title,
      },
    }),
    prisma.users.create({
      data: {
        FIO: 'Сидоров Сидор Сидорович',
        Email: 'admin@example.com',
        Password: hashedPassword,
        Phone: '+7 (999) 345-67-89',
        BirthDate: new Date('1980-10-20'),
        IDRoles: roles[2].IDRoles,
        IDJob_title: jobTitles[0].IDJob_title,
      },
    }),
  ]);

  // Создание категорий ингредиентов
  const ingredientCategories = await Promise.all([
    prisma.ingredients_categories.create({ data: { Name: 'Овощи' } }),
    prisma.ingredients_categories.create({ data: { Name: 'Мясо' } }),
    prisma.ingredients_categories.create({ data: { Name: 'Морепродукты' } }),
    prisma.ingredients_categories.create({ data: { Name: 'Молочные продукты' } }),
    prisma.ingredients_categories.create({ data: { Name: 'Крупы' } }),
    prisma.ingredients_categories.create({ data: { Name: 'Специи' } }),
  ]);

  // Создание ингредиентов
  const ingredients = await Promise.all([
    // Овощи
    prisma.ingredients.create({ 
      data: { Name: 'Помидор', Price: 50, IDIngredients_categories: ingredientCategories[0].IDIngredients_categories } 
    }),
    prisma.ingredients.create({ 
      data: { Name: 'Огурец', Price: 40, IDIngredients_categories: ingredientCategories[0].IDIngredients_categories } 
    }),
    prisma.ingredients.create({ 
      data: { Name: 'Лук', Price: 30, IDIngredients_categories: ingredientCategories[0].IDIngredients_categories } 
    }),
    prisma.ingredients.create({ 
      data: { Name: 'Картофель', Price: 35, IDIngredients_categories: ingredientCategories[0].IDIngredients_categories } 
    }),
    prisma.ingredients.create({ 
      data: { Name: 'Морковь', Price: 25, IDIngredients_categories: ingredientCategories[0].IDIngredients_categories } 
    }),
    prisma.ingredients.create({ 
      data: { Name: 'Перец болгарский', Price: 60, IDIngredients_categories: ingredientCategories[0].IDIngredients_categories } 
    }),
    
    // Мясо
    prisma.ingredients.create({ 
      data: { Name: 'Курица', Price: 200, IDIngredients_categories: ingredientCategories[1].IDIngredients_categories } 
    }),
    prisma.ingredients.create({ 
      data: { Name: 'Говядина', Price: 350, IDIngredients_categories: ingredientCategories[1].IDIngredients_categories } 
    }),
    prisma.ingredients.create({ 
      data: { Name: 'Свинина', Price: 280, IDIngredients_categories: ingredientCategories[1].IDIngredients_categories } 
    }),
    
    // Морепродукты
    prisma.ingredients.create({ 
      data: { Name: 'Лосось', Price: 450, IDIngredients_categories: ingredientCategories[2].IDIngredients_categories } 
    }),
    prisma.ingredients.create({ 
      data: { Name: 'Креветки', Price: 380, IDIngredients_categories: ingredientCategories[2].IDIngredients_categories } 
    }),
    
    // Молочные продукты
    prisma.ingredients.create({ 
      data: { Name: 'Сыр', Price: 150, IDIngredients_categories: ingredientCategories[3].IDIngredients_categories } 
    }),
    prisma.ingredients.create({ 
      data: { Name: 'Сливки', Price: 80, IDIngredients_categories: ingredientCategories[3].IDIngredients_categories } 
    }),
    prisma.ingredients.create({ 
      data: { Name: 'Масло сливочное', Price: 100, IDIngredients_categories: ingredientCategories[3].IDIngredients_categories } 
    }),
    
    // Крупы
    prisma.ingredients.create({ 
      data: { Name: 'Рис', Price: 70, IDIngredients_categories: ingredientCategories[4].IDIngredients_categories } 
    }),
    prisma.ingredients.create({ 
      data: { Name: 'Паста', Price: 90, IDIngredients_categories: ingredientCategories[4].IDIngredients_categories } 
    }),
    
    // Специи
    prisma.ingredients.create({ 
      data: { Name: 'Соль', Price: 10, IDIngredients_categories: ingredientCategories[5].IDIngredients_categories } 
    }),
    prisma.ingredients.create({ 
      data: { Name: 'Перец черный', Price: 15, IDIngredients_categories: ingredientCategories[5].IDIngredients_categories } 
    }),
    prisma.ingredients.create({ 
      data: { Name: 'Зелень', Price: 45, IDIngredients_categories: ingredientCategories[5].IDIngredients_categories } 
    }),
  ]);

  // Создание типов блюд
  const dishTypes = await Promise.all([
    prisma.dish_types.create({ data: { Name: 'Салат' } }),
    prisma.dish_types.create({ data: { Name: 'Суп' } }),
    prisma.dish_types.create({ data: { Name: 'Основное блюдо' } }),
    prisma.dish_types.create({ data: { Name: 'Гарнир' } }),
    prisma.dish_types.create({ data: { Name: 'Десерт' } }),
  ]);

  // Создание блюд
  const dishes = await Promise.all([
    // Салаты
    prisma.dishes.create({
      data: {
        Name: 'Салат Цезарь',
        Price: 350,
        Description: 'Классический салат с курицей, сыром пармезан и сухариками',
        IDDish_types: dishTypes[0].IDDish_types,
      },
    }),
    prisma.dishes.create({
      data: {
        Name: 'Греческий салат',
        Price: 280,
        Description: 'Свежие овощи с фетой и оливками',
        IDDish_types: dishTypes[0].IDDish_types,
      },
    }),
    prisma.dishes.create({
      data: {
        Name: 'Салат с лососем',
        Price: 450,
        Description: 'Слабосоленый лосось с авокадо и лимонной заправкой',
        IDDish_types: dishTypes[0].IDDish_types,
      },
    }),
    
    // Супы
    prisma.dishes.create({
      data: {
        Name: 'Борщ',
        Price: 250,
        Description: 'Традиционный украинский борщ со сметаной',
        IDDish_types: dishTypes[1].IDDish_types,
      },
    }),
    prisma.dishes.create({
      data: {
        Name: 'Крем-суп из грибов',
        Price: 320,
        Description: 'Нежный грибной суп со сливками',
        IDDish_types: dishTypes[1].IDDish_types,
      },
    }),
    
    // Основные блюда
    prisma.dishes.create({
      data: {
        Name: 'Курица гриль',
        Price: 420,
        Description: 'Запеченная курица с травами и овощами',
        IDDish_types: dishTypes[2].IDDish_types,
      },
    }),
    prisma.dishes.create({
      data: {
        Name: 'Стейк из говядины',
        Price: 650,
        Description: 'Отборная говядина с картофелем по-деревенски',
        IDDish_types: dishTypes[2].IDDish_types,
      },
    }),
    prisma.dishes.create({
      data: {
        Name: 'Паста с креветками',
        Price: 480,
        Description: 'Итальянская паста с морепродуктами в сливочном соусе',
        IDDish_types: dishTypes[2].IDDish_types,
      },
    }),
    prisma.dishes.create({
      data: {
        Name: 'Лосось на гриле',
        Price: 580,
        Description: 'Сочный лосось с лимоном и розмарином',
        IDDish_types: dishTypes[2].IDDish_types,
      },
    }),
    
    // Гарниры
    prisma.dishes.create({
      data: {
        Name: 'Картофель фри',
        Price: 180,
        Description: 'Хрустящий картофель фри',
        IDDish_types: dishTypes[3].IDDish_types,
      },
    }),
    prisma.dishes.create({
      data: {
        Name: 'Рис отварной',
        Price: 150,
        Description: 'Белый рис на пару',
        IDDish_types: dishTypes[3].IDDish_types,
      },
    }),
    
    // Десерты
    prisma.dishes.create({
      data: {
        Name: 'Чизкейк',
        Price: 280,
        Description: 'Нью-йоркский чизкейк с ягодным соусом',
        IDDish_types: dishTypes[4].IDDish_types,
      },
    }),
  ]);

  // Создание связей блюд и ингредиентов
  await Promise.all([
    // Салат Цезарь
    prisma.dish_ingredients.createMany({
      data: [
        { IDDishes: dishes[0].IDDishes, IDIngredients: ingredients[0].IDIngredients, Quantity: 3 }, // Помидор
        { IDDishes: dishes[0].IDDishes, IDIngredients: ingredients[11].IDIngredients, Quantity: 2 }, // Сыр
        { IDDishes: dishes[0].IDDishes, IDIngredients: ingredients[6].IDIngredients, Quantity: 1 }, // Курица
        { IDDishes: dishes[0].IDDishes, IDIngredients: ingredients[17].IDIngredients, Quantity: 1 }, // Зелень
      ],
    }),
    
    // Греческий салат
    prisma.dish_ingredients.createMany({
      data: [
        { IDDishes: dishes[1].IDDishes, IDIngredients: ingredients[0].IDIngredients, Quantity: 2 }, // Помидор
        { IDDishes: dishes[1].IDDishes, IDIngredients: ingredients[1].IDIngredients, Quantity: 2 }, // Огурец
        { IDDishes: dishes[1].IDDishes, IDIngredients: ingredients[2].IDIngredients, Quantity: 1 }, // Лук
        { IDDishes: dishes[1].IDDishes, IDIngredients: ingredients[11].IDIngredients, Quantity: 2 }, // Сыр
      ],
    }),
    
    // Салат с лососем
    prisma.dish_ingredients.createMany({
      data: [
        { IDDishes: dishes[2].IDDishes, IDIngredients: ingredients[9].IDIngredients, Quantity: 2 }, // Лосось
        { IDDishes: dishes[2].IDDishes, IDIngredients: ingredients[0].IDIngredients, Quantity: 2 }, // Помидор
        { IDDishes: dishes[2].IDDishes, IDIngredients: ingredients[17].IDIngredients, Quantity: 1 }, // Зелень
      ],
    }),
    
    // Борщ
    prisma.dish_ingredients.createMany({
      data: [
        { IDDishes: dishes[3].IDDishes, IDIngredients: ingredients[0].IDIngredients, Quantity: 3 }, // Помидор
        { IDDishes: dishes[3].IDDishes, IDIngredients: ingredients[2].IDIngredients, Quantity: 2 }, // Лук
        { IDDishes: dishes[3].IDDishes, IDIngredients: ingredients[3].IDIngredients, Quantity: 4 }, // Картофель
        { IDDishes: dishes[3].IDDishes, IDIngredients: ingredients[4].IDIngredients, Quantity: 2 }, // Морковь
        { IDDishes: dishes[3].IDDishes, IDIngredients: ingredients[7].IDIngredients, Quantity: 2 }, // Говядина
      ],
    }),
    
    // Крем-суп из грибов
    prisma.dish_ingredients.createMany({
      data: [
        { IDDishes: dishes[4].IDDishes, IDIngredients: ingredients[12].IDIngredients, Quantity: 2 }, // Сливки
        { IDDishes: dishes[4].IDDishes, IDIngredients: ingredients[13].IDIngredients, Quantity: 1 }, // Масло
      ],
    }),
    
    // Курица гриль
    prisma.dish_ingredients.createMany({
      data: [
        { IDDishes: dishes[5].IDDishes, IDIngredients: ingredients[6].IDIngredients, Quantity: 1 }, // Курица
        { IDDishes: dishes[5].IDDishes, IDIngredients: ingredients[5].IDIngredients, Quantity: 2 }, // Перец
        { IDDishes: dishes[5].IDDishes, IDIngredients: ingredients[17].IDIngredients, Quantity: 1 }, // Зелень
      ],
    }),
    
    // Стейк из говядины
    prisma.dish_ingredients.createMany({
      data: [
        { IDDishes: dishes[6].IDDishes, IDIngredients: ingredients[7].IDIngredients, Quantity: 1 }, // Говядина
        { IDDishes: dishes[6].IDDishes, IDIngredients: ingredients[3].IDIngredients, Quantity: 3 }, // Картофель
      ],
    }),
    
    // Паста с креветками
    prisma.dish_ingredients.createMany({
      data: [
        { IDDishes: dishes[7].IDDishes, IDIngredients: ingredients[15].IDIngredients, Quantity: 1 }, // Паста
        { IDDishes: dishes[7].IDDishes, IDIngredients: ingredients[10].IDIngredients, Quantity: 5 }, // Креветки
        { IDDishes: dishes[7].IDDishes, IDIngredients: ingredients[12].IDIngredients, Quantity: 2 }, // Сливки
      ],
    }),
    
    // Лосось на гриле
    prisma.dish_ingredients.createMany({
      data: [
        { IDDishes: dishes[8].IDDishes, IDIngredients: ingredients[9].IDIngredients, Quantity: 1 }, // Лосось
        { IDDishes: dishes[8].IDDishes, IDIngredients: ingredients[17].IDIngredients, Quantity: 1 }, // Зелень
      ],
    }),
    
    // Картофель фри
    prisma.dish_ingredients.createMany({
      data: [
        { IDDishes: dishes[9].IDDishes, IDIngredients: ingredients[3].IDIngredients, Quantity: 5 }, // Картофель
      ],
    }),
    
    // Рис отварной
    prisma.dish_ingredients.createMany({
      data: [
        { IDDishes: dishes[10].IDDishes, IDIngredients: ingredients[14].IDIngredients, Quantity: 1 }, // Рис
      ],
    }),
    
    // Чизкейк
    prisma.dish_ingredients.createMany({
      data: [
        { IDDishes: dishes[11].IDDishes, IDIngredients: ingredients[11].IDIngredients, Quantity: 3 }, // Сыр
        { IDDishes: dishes[11].IDDishes, IDIngredients: ingredients[12].IDIngredients, Quantity: 2 }, // Сливки
      ],
    }),
  ]);

  // Создание статусов заказов
  const statuses = await Promise.all([
    prisma.status.create({ data: { Name: 'CREATED' } }),
    prisma.status.create({ data: { Name: 'COOKING' } }),
    prisma.status.create({ data: { Name: 'READY' } }),
    prisma.status.create({ data: { Name: 'COMPLETED' } }),
  ]);

  console.log('База данных успешно заполнена!');
  console.log('Пользователи:');
  console.log('  Клиент: client@example.com / password123');
  console.log('  Сотрудник: employee@example.com / password123');
  console.log('  Администратор: admin@example.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
