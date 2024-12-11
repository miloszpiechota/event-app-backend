import { CommentsCreate } from "../../src/controllers/CommentsControllers.js";
import { jest } from "@jest/globals";
//ok
test("Should return error for missing fields", async () => {
  const req = { body: { comment: "Test comment" } }; // Missing iduser and idevent
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  await CommentsCreate(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    success: false,
    error: "All fields (comment, iduser, idevent) are required.",
  });
});