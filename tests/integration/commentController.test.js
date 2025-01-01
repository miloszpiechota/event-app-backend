// Test endpointu `POST /api/comments/create

import request from "supertest";
import app from "../../src/index.js"; 
process.env.DATABASE_URL = "mysql://mateusz:pZ9EmXKSdDGz4K2@inzynierka.mysql.database.azure.com:3306/eventbooking?sslmode=require"

//ok
test("Should create a new comment", async () => {
  console.log("data z consolelog:", new Date());
  const response = await request(app)
    .post("/api/comments/create")
    .send({
      comment: "Great event!",
      iduser: 2,
      idevent: 5,
      date_comment: "2024-12-06T10:39:00.000Z",
    });
  console.log(response.status);
  console.log(response.body);
  
  expect(response.status).toBe(201);
  expect(response.body.success).toBe(true);
  expect(response.body.comment.comment).toBe("Great event!");
});