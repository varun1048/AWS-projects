const serverless = require("serverless-http");
const express = require("express");
const cors = require("cors");
const app = express();
const { GoogleGenerativeAI } = require("@google/generative-ai");
var bodyParser = require("body-parser");

app.use(bodyParser.json());

app.use(cors());

const getPrompt = (topics) => {
  return `Please provide 4 "${topics}" questions along with their respective answers in the JSON format as follows:
 {
questions": [
    {
      "question": "XXXX",
      "answers": [
        "XXX,
        "XXX",
        "XXX",
        "XXX"
      ],
      "correct_answer": "XXX"
    },
    {
      "question": "XXXX",
      "answers": [
        "XXX,
        "XXX",
        "XXX",
        "XXX"
      ],
      "correct_answer": "XXX"
    },
}`;
};
async function call_AI(prompt) {
  try {
    const genAI = new GoogleGenerativeAI(
      "AIzaSyCivOcx4f8VmjKho5nrG3h6Dc7sdsJA_Zk"
    );

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(getPrompt(prompt));
    const response = await result.response.text();
    return JSON.parse(response)?.questions;
  } catch (err) {
    return err;
  }
}

app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from root!",
  });
});

app.get("/ai", async (req, res, next) => {
  if (!req.query.topics) return res.status(404).json({});
  try {
    console.log(req.query.topics);
    const topics = req.query.topics;
    const data = await call_AI(topics.toString());
    return res.status(200).json(data);
  } catch {
    return res.status(400);
  }
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

app.listen(3000);
// module.exports.handler = serverless(app);
