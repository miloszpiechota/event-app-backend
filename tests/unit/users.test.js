import { UsersCreate } from "../../src/controllers/UsersControllers.js";
import { UsersModels } from "../../src/models/Models.js";

// Mock the UsersModels
jest.mock("../../src/models/Models.js", () => ({
  UsersModels: {
    findFirst: jest.fn(),
    create: jest.fn(),
  },
}));

describe("UsersCreate Controller", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Reset mocks between tests
  });

  test("Should return 401 for duplicate email", async () => {
    // Mock database response for existing email
    UsersModels.findFirst.mockResolvedValue({ iduser: 1 });

    const req = { body: { email: "admin@example.com", password: "adminadmin" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await UsersCreate(req, res);

    expect(UsersModels.findFirst).toHaveBeenCalledWith({
      where: { email: "admin@example.com" },
    });
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      msg: "email already exist",
    });
  });
});
