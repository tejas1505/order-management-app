import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const menuItems = [
  {
    name: "Margherita Pizza",
    description: "Classic pizza with tomato, mozzarella, and fresh basil.",
    price: 8.99,
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
  },
  {
    name: "Pepperoni Pizza",
    description: "Loaded with pepperoni and melted mozzarella cheese.",
    price: 9.99,
    imageUrl: "https://images.unsplash.com/photo-1628840042765-356cda07504e",
  },
  {
    name: "Classic Cheeseburger",
    description: "Beef patty, cheddar, lettuce, tomato, and house sauce.",
    price: 7.49,
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
  },
  {
    name: "Bacon Burger",
    description: "Beef patty topped with crispy bacon and BBQ sauce.",
    price: 8.49,
    imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349",
  },
  {
    name: "Caesar Salad",
    description: "Romaine lettuce, parmesan, croutons, and Caesar dressing.",
    price: 6.29,
    imageUrl: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9",
  },
  {
    name: "French Fries",
    description: "Crispy golden fries with a side of ketchup.",
    price: 3.49,
    imageUrl: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877",
  },
];

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();

  await prisma.menuItem.createMany({ data: menuItems });
  console.log(`Seeded ${menuItems.length} menu items.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
