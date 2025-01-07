// Test logowania użytkownika
import request from "supertest";
import app from "../../src/index.js";

test("Should login user and return token", async () => {
  const response = await request(app)
    .post("/api/users/login")
    .send({ email: "admin@example.com", password: "adminadmin" });

  expect(response.status).toBe(200);
  expect(response.body.success).toBe(true);
  expect(response.body).toHaveProperty("token");
});