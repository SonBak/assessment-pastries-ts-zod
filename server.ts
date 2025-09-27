import express from "express";
import { z } from "zod";

const app = express();

app.use(express.json());

const PORT: number = 3000;

app.listen(PORT, (): void => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Define the Pastry type
interface Pastry {
  id: number;
  name: string;
  price: number;
}

let pastries: Pastry[] = [
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

const pastrySchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(2).max(20),
  price: z.number().min(1).max(100),
});

const validatePastry = pastrySchema.safeParse(pastries);
if (!validatePastry.success) {
  console.error("Pastry schema validation failed:", validatePastry.error);
} else {
  console.log(validatePastry.data);
}

app.get("/pastries", (req, res): void => {
  res.json(pastries);
});

app.post("/pastries", (req, res): any => {
  const result = pastrySchema.safeParse({
    ...req.body,
    id: pastries.length + 1,
  });
  if (!result.success) {
    return res.status(400).json({ error: result.error.issues });
  }
  const newPastry: Pastry = result.data;
  pastries.push(newPastry);
  res.json({ message: "Pastry added successfully", pastry: newPastry });
});

app.put("/pastries/:id", (req, res) => {
  const pastryId: number = parseInt(req.params.id);
  const pastry = pastries.find((p) => p.id === pastryId);
  if (!pastry) {
    return res.status(404).json({ message: "Pastry not found!" });
  }
  const result = pastrySchema.safeParse({ ...req.body, id: pastryId });
  if (!result.success) {
    return res.status(400).json({ error: result.error.issues });
  }
  pastry.name = result.data.name;
  pastry.price = result.data.price;
  res.json({ message: "Pastry updated successfully", pastry });
});

app.delete("/pastries/:id", (req, res): void => {
  const pastryId: number = parseInt(req.params.id);
  pastries = pastries.filter((p: Pastry) => p.id !== pastryId);
  res.json({ message: "Pastry deleted successfully!" });
});
