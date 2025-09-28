# Swedish Pastry Manager

This project manages products and prices for Swedish pastries.

## Description

The project is written in TypeScript and imports Express for the web application framework and Zod for validating the data.

## How to use the project

### Installments:

Make sure that NPM, TypeScript, Express, Zod, Nodemon and ts-node are installed.

```npm init -y
npm install -D typescript ts-node @types/node
npm install express
npm install zod
npm install -D nodemon
```

### Run the server:

Then you can run the project on your http//:localhost:3000 using `npm run dev`. This can be visualized in Insomnia and to add http requests to view, add, change and deleted data.

### Pastry data:

The data for `id`, `name` and `price` in the array to store pastries can be changed manually if desired.

```let pastries: Pastry[] = [
  {
    id: 1,
    name: "Kanelbulle",
    price: 35,
  },
  {
    id: 2,
    name: "Semla",
    price: 40,
  },
];
```

### Zod schema validation:

`pastrySchema` validates the structure of a pastry object, while `pastriesSchema` validates the whole array of pastries.
Below is the current validation schema that validates that the `id" must be a positive integer`, the `name` is a string from 5 to 20 characters and the `price`is a number from 10 to 100. These can be changed to adjust the validation of the project.

```const pastrySchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(5).max(20),
  price: z.number().min(10).max(100),
});
```
