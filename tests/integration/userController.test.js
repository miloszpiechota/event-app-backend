// Test logowania użytkownika
import request from "supertest";
import app from "../../src/index.js";
process.env.DATABASE_URL = "mysql://mateusz:pZ9EmXKSdDGz4K2@inzynierka.mysql.database.azure.com:3306/eventbooking?sslmode=require"
process.env.API_SECRET = "secret"
process.env.JWT_ACCESS_SECRET = "SECRET123"

//poprawic 

test("Should login user and return token", async () => {
  const response = await request(app)
    .post("/api/users/login")
    .send({ email: "admin@example.com", password: "adminadmin" });
  
    console.log(response.status);
  console.log(response.body);

  expect(response.status).toBe(200);
  expect(response.body.success).toBe(true);
  expect(response.body).toHaveProperty("token");
});