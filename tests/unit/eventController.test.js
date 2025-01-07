import { EventRead } from "../../src/controllers/EventsControllers.js";
import { EventsModels } from "../../src/models/Models.js";

// Mock model
jest.mock("../../src/models/Models.js", () => ({
  EventsModels: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
}));

// Helper function to create mock request and response
const createMockReqRes = (reqOverrides = {}, resOverrides = {}) => {
  const req = { params: {}, ...reqOverrides };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), ...resOverrides };
  return { req, res };
};

describe("EventRead Controller", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Reset mocks between tests
  });

  describe("Fetch event", () => {
    test("Should return event ", async () => {
      const mockData = [
        {
          idevent: 3,
          name: "Lublinalia",
          start_date: "2025-05-01T15:00:00.000Z",
          end_date: "2025-05-05T20:00:00.000Z",
          description: "Lublinalia w Lublinie to wielkie studenckie święto, pełne muzyki, radości i wyjątkowej atmosfery. To czas, kiedy studenci wychodzą na ulice miasta, by razem celebrować wiosnę i cieszyć się koncertami, wydarzeniami kulturalnymi i rozrywkowymi. Lublinalia przyciągają tłumy młodych ludzi, tworząc niepowtarzalny klimat i integrując społeczność akademicką Lublina.",
          number_of_ticket: 1200,
          photo: "https://example.com/lublinalia.jpg",
          contact_info: "lublinalia@example.com",
          idevent_category: 1,
          idevent_location: 1,
          idstatus_type: 1,
          is_seat_categorized: true,
        },
      ];
      EventsModels.findMany.mockResolvedValue(mockData);
      const { req, res } = createMockReqRes();
      await EventRead(req, res);
      expect(EventsModels.findMany).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        msg: "Successfully read event(s)!",
        event: mockData,
      });
    });
  });

  describe("Fetch event by ID", () => {
    test("Should return a single event successfully when ID is provided", async () => {
      const mockData = {
        idevent: 2,
      };
      EventsModels.findUnique.mockResolvedValue(mockData);
      const { req, res } = createMockReqRes({ params: { id: "2" } });
      await EventRead(req, res);
      expect(EventsModels.findUnique).toHaveBeenCalledWith({
        where: { idevent: 2 },
        select: {
          idevent: true,
          name: true,
          start_date: true,
          end_date: true,
          description: true,
          number_of_ticket: true,
          photo: true,
          contact_info: true,
          idevent_category: true,
          idevent_location: true,
          idstatus_type: true,
          is_seat_categorized: true,
        },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        msg: "Successfully read event(s)!",
        event: mockData,
      });
    });
  });
  describe("Error handling", () => {
    test("Should handle errors correctly", async () => {
      const errorMessage = "Database error";
      EventsModels.findMany.mockRejectedValue(new Error(errorMessage));
      const { req, res } = createMockReqRes();
      await EventRead(req, res);
      expect(EventsModels.findMany).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: errorMessage,
      });
    });
  });
});
