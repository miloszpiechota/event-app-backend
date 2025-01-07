import request from "supertest";
import app from "../../src/index.js"; 

test("Should return 200 for correct category ID", async () => {
  const response = await request(app).get("/api/categories/read/3");

  expect(response.status).toBe(200);
  expect(response.body.success).toBe(true);
  expect(response.body.error).toBe("Invalid category ID");
});