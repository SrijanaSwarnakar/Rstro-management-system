import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  Prisma,
} from "../src/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  // Restaurant
  const restaurant = await prisma.restaurant.create({
    data: {
      name: "Himalayan Cafe",
      slug: "himalayan-cafe",
    },
  });

  // Admin User
  const user = await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@himalayancafe.com",
      passwordHash: "development-password",
    },
  });

  // Restaurant Member
  await prisma.restaurantMember.create({
    data: {
      userId: user.id,
      restaurantId: restaurant.id,
      role: "OWNER",
    },
  });

  // Menu Groups
  const breakfast = await prisma.menuGroup.create({
    data: {
      restaurantId: restaurant.id,
      name: "Breakfast",
      slug: "breakfast",
      sortOrder: 1,
    },
  });

  const mainCourse = await prisma.menuGroup.create({
    data: {
      restaurantId: restaurant.id,
      name: "Main Course",
      slug: "main-course",
      sortOrder: 2,
    },
  });

  const drinks = await prisma.menuGroup.create({
    data: {
      restaurantId: restaurant.id,
      name: "Drinks",
      slug: "drinks",
      sortOrder: 3,
    },
  });

  // Menu Items
  await prisma.menuItem.createMany({
    data: [
      {
        restaurantId: restaurant.id,
        menuGroupId: breakfast.id,
        name: "Veg Momo",
        description: "Fresh vegetable momo",
        price: new Prisma.Decimal("180.00"),
        sortOrder: 1,
      },
      {
        restaurantId: restaurant.id,
        menuGroupId: breakfast.id,
        name: "Chowmein",
        description: "Fresh vegetable chowmein",
        price: new Prisma.Decimal("160.00"),
        sortOrder: 2,
      },
      {
        restaurantId: restaurant.id,
        menuGroupId: mainCourse.id,
        name: "Chicken Pizza",
        description: "Cheesy chicken pizza",
        price: new Prisma.Decimal("450.00"),
        sortOrder: 1,
      },
      {
        restaurantId: restaurant.id,
        menuGroupId: mainCourse.id,
        name: "Chicken Burger",
        description: "Crispy chicken burger",
        price: new Prisma.Decimal("300.00"),
        sortOrder: 2,
      },
      {
        restaurantId: restaurant.id,
        menuGroupId: drinks.id,
        name: "Milk Tea",
        description: "Nepali style milk tea",
        price: new Prisma.Decimal("50.00"),
        sortOrder: 1,
      },
      {
        restaurantId: restaurant.id,
        menuGroupId: drinks.id,
        name: "Cold Coffee",
        description: "Chilled creamy coffee",
        price: new Prisma.Decimal("180.00"),
        sortOrder: 2,
      },
    ],
  });

  // QR Code
  await prisma.qRCode.create({
    data: {
      restaurantId: restaurant.id,
      name: "Main Menu QR",
      code: "HIMALAYAN-CAFE-MAIN",
    },
  });

  console.log("Seed data created successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });