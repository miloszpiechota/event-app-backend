// Testowanie walidacji wejścia w CategoryReadById
// ok
import { CategoryReadById } from "../../src/controllers/CategoryControllers.js";
import { jest } from "@jest/globals";

test("Should return error for invalid category ID", async () => {
  const req = { params: { id: "invalid" } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  await CategoryReadById(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    success: false,
    error: "Invalid category ID",
  });
});
