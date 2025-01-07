// Test endpointu `POST /api/comments/create

import request from "supertest";
import app from "../../src/index.js"; 
test("Should create a new comment", async () => {
  const response = await request(app)
    .post("/api/comments/create")
    .send({
      comment: "Great event!",
      iduser: 2,
      idevent: 5,
      date_comment: new Date().toISOString(),
    });
  expect(response.status).toBe(201);
  expect(response.body.success).toBe(true);
  expect(response.body.comment.comment).toBe("Great event!");
});