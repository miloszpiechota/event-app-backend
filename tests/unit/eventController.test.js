import { EventRead } from "../../src/controllers/EventsControllers.js";
import { jest } from "@jest/globals";
// nie dziala
test("Should return events list successfully", async () => {
  const mockData = [{ idevent: 1, name: "Sample Event" }];
  const mockFindMany = jest.fn().mockResolvedValue(mockData);
  jest.mock("../../src/models/Models.js", () => ({
    EventsModels: { findMany: mockFindMany },
  }));

  const req = {};
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  await EventRead(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({
    success: true,
    msg: "Successfully read event(s)!",
    event: mockData,
  });
});