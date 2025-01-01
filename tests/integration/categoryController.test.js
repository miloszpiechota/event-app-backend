import request from "supertest";
import app from "../../src/index.js"; 

//ok

test("Should return 400 for invalid category ID", async () => {
  const response = await request(app).get("/api/categories/read/invalid");

  expect(response.status).toBe(400);
  expect(response.body.success).toBe(false);
  expect(response.body.error).toBe("Invalid category ID");
});