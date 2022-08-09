import express from "express";
const app = express();
import dbConnect from "./db/db-connect.js";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
app.use(cors());

app.use(express.static(path.join(__dirname, "Tailwind/build")));

import articles from "./routes/articles.js";

// import notFoundRoute from "./middleware/notFound.js";
import auth from "./routes/auth.js";

app.use(express.json());
// app.get("/", (req, res) => {
//   res.send("welcome to backend of Blogsium");
// });

app.use("/api/articles", articles);
app.use("/api/user", auth);
// app.use(notFoundRoute);
app.get("*", (req, res) => {
  // Serve index.html file if it doesn't recognize the route
  // res.sendFile(path.resolve(__dirname, "Tailwind/build", "index.html")); // <- Here !
  res.sendFile(path.resolve(__dirname, "./Tailwind/build/index.html")); // <- Here !
});
const port = process.env.PORT || 5000;

// if (process.env.NODE_ENV == "production") {
//   app.use(express.static(path.join(__dirname, '../Tailwind/build')));
//   // app.use(express.static("Tailwind/build"));
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "Tailwind", "build", "index.html"));
//   });
// }
if (process.env.NODE_ENV === "production") {
  app.use(express.static("Tailwind/build"));
  // Serve static files
}

const server = async () => {
  try {
    await dbConnect(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`server is listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};
server();
