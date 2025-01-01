import { UsersCreate } from "../../src/controllers/UsersControllers.js";
import { jest } from "@jest/globals";
//nie dziala
test("Should return 401 for duplicate email", async () => {
  const mockFindFirst = jest.fn().mockResolvedValue({ iduser: 1 });
  jest.mock("../../src/models/Models.js", () => ({
    UsersModels: { findFirst: mockFindFirst, create: jest.fn() },
  }));

  const req = { body: { email: "test@example.com", password: "password123" } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  await UsersCreate(req, res);

  expect(res.status).toHaveBeenCalledWith(401);
  expect(res.json).toHaveBeenCalledWith({
    success: false,
    msg: "email already exist",
  });
});
