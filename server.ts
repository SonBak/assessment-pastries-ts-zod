// Import express and zod
import express from "express";
import { z } from "zod";

// Initialize express app and set port
const app = express();
const PORT: number = 3000;

// Middleware to parse JSON
app.use(express.json());

// Start the server
app.listen(PORT, (): void => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// TS interface for Pastry type
interface Pastry {
  id: number;
  name: string;
  price: number;
}

// Array to store pastries
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

// Zod schema for validating a single pastry
const pastrySchema = z.object({
  id: z.number().int().positive(), // ID must be a positive integer
  name: z.string().min(5).max(20), // Name must be between 5 and 20 characters
  price: z.number().min(10).max(100), // Price must be between 10 and 100
});

// Zod schema for validating the whole array of pastries
const pastriesSchema = z.array(pastrySchema);

// Validate pastries array
const validatePastry = pastriesSchema.safeParse(pastries);
if (!validatePastry.success) {
  console.error("Pastry schema validation failed:", validatePastry.error);
} else {
  console.log(validatePastry.data);
}

// CRUD Endpoints for pastries

// Get all pastries
app.get("/pastries", (req, res): void => {
  res.json(pastries);
});

// Add a new pastry with validation that gets the next available ID
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

// Update a pastry by ID with validation
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

// Delete a pastry by ID
app.delete("/pastries/:id", (req, res): void => {
  const pastryId: number = parseInt(req.params.id);
  pastries = pastries.filter((p: Pastry) => p.id !== pastryId);
  res.json({ message: "Pastry deleted successfully!" });
});
