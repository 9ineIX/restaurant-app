-- CreateTable
CREATE TABLE "Users" (
    "IDUsers" SERIAL NOT NULL,
    "FIO" TEXT NOT NULL,
    "Дата рождения" TIMESTAMP(3) NOT NULL,
    "Телефон" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "IDRoles" INTEGER NOT NULL,
    "IDJob_title" INTEGER NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("IDUsers")
);

-- CreateTable
CREATE TABLE "Roles" (
    "IDRoles" SERIAL NOT NULL,
    "Наименование" TEXT NOT NULL,

    CONSTRAINT "Roles_pkey" PRIMARY KEY ("IDRoles")
);

-- CreateTable
CREATE TABLE "Job_title" (
    "IDJob_title" SERIAL NOT NULL,
    "Наименование" TEXT NOT NULL,

    CONSTRAINT "Job_title_pkey" PRIMARY KEY ("IDJob_title")
);

-- CreateTable
CREATE TABLE "Orders" (
    "IDOrders" SERIAL NOT NULL,
    "Цена" DECIMAL(65,30) NOT NULL,
    "IDUsers" INTEGER NOT NULL,
    "IDStatus" INTEGER NOT NULL,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("IDOrders")
);

-- CreateTable
CREATE TABLE "Status" (
    "IDStatus" SERIAL NOT NULL,
    "Наименование" TEXT NOT NULL,

    CONSTRAINT "Status_pkey" PRIMARY KEY ("IDStatus")
);

-- CreateTable
CREATE TABLE "Dishes" (
    "IDDishes" SERIAL NOT NULL,
    "Наименование" TEXT NOT NULL,
    "Цена" DECIMAL(65,30) NOT NULL,
    "Описание" TEXT NOT NULL,
    "IDDish_types" INTEGER NOT NULL,

    CONSTRAINT "Dishes_pkey" PRIMARY KEY ("IDDishes")
);

-- CreateTable
CREATE TABLE "Dish_types" (
    "IDDish_types" SERIAL NOT NULL,
    "Наименование" TEXT NOT NULL,

    CONSTRAINT "Dish_types_pkey" PRIMARY KEY ("IDDish_types")
);

-- CreateTable
CREATE TABLE "Dish_ingredients" (
    "IDDish_ingredients" SERIAL NOT NULL,
    "IDDishes" INTEGER NOT NULL,
    "IDIngredients" INTEGER NOT NULL,
    "Количество" INTEGER NOT NULL,

    CONSTRAINT "Dish_ingredients_pkey" PRIMARY KEY ("IDDish_ingredients")
);

-- CreateTable
CREATE TABLE "Ingredients" (
    "IDIngredients" SERIAL NOT NULL,
    "Наименование" TEXT NOT NULL,
    "Цена" DECIMAL(65,30) NOT NULL,
    "IDIngredients_categories" INTEGER NOT NULL,

    CONSTRAINT "Ingredients_pkey" PRIMARY KEY ("IDIngredients")
);

-- CreateTable
CREATE TABLE "Ingredients_categories" (
    "IDIngredients_categories" SERIAL NOT NULL,
    "Наименование" TEXT NOT NULL,

    CONSTRAINT "Ingredients_categories_pkey" PRIMARY KEY ("IDIngredients_categories")
);

-- CreateTable
CREATE TABLE "_OrdersToDishes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_OrdersToDishes_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_Email_key" ON "Users"("Email");

-- CreateIndex
CREATE INDEX "_OrdersToDishes_B_index" ON "_OrdersToDishes"("B");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_IDRoles_fkey" FOREIGN KEY ("IDRoles") REFERENCES "Roles"("IDRoles") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_IDJob_title_fkey" FOREIGN KEY ("IDJob_title") REFERENCES "Job_title"("IDJob_title") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_IDUsers_fkey" FOREIGN KEY ("IDUsers") REFERENCES "Users"("IDUsers") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_IDStatus_fkey" FOREIGN KEY ("IDStatus") REFERENCES "Status"("IDStatus") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dishes" ADD CONSTRAINT "Dishes_IDDish_types_fkey" FOREIGN KEY ("IDDish_types") REFERENCES "Dish_types"("IDDish_types") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dish_ingredients" ADD CONSTRAINT "Dish_ingredients_IDDishes_fkey" FOREIGN KEY ("IDDishes") REFERENCES "Dishes"("IDDishes") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dish_ingredients" ADD CONSTRAINT "Dish_ingredients_IDIngredients_fkey" FOREIGN KEY ("IDIngredients") REFERENCES "Ingredients"("IDIngredients") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ingredients" ADD CONSTRAINT "Ingredients_IDIngredients_categories_fkey" FOREIGN KEY ("IDIngredients_categories") REFERENCES "Ingredients_categories"("IDIngredients_categories") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrdersToDishes" ADD CONSTRAINT "_OrdersToDishes_A_fkey" FOREIGN KEY ("A") REFERENCES "Dishes"("IDDishes") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrdersToDishes" ADD CONSTRAINT "_OrdersToDishes_B_fkey" FOREIGN KEY ("B") REFERENCES "Orders"("IDOrders") ON DELETE CASCADE ON UPDATE CASCADE;
