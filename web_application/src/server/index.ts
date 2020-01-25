import * as express from "express";
import { resolve } from "path";
import * as cors from "cors";

const port = 1050;

const static_path = resolve(__dirname, "../../static");
const content_path = resolve(__dirname, "../../src/index.html");

const server = express();

server.use(cors());
server.use(express.static(static_path));
server.use((req, _res, next) => {
    console.log(req.originalUrl);
    next();
});

console.log(`Server listening on port ${port}...`);

server.get("/", (_req, res) => res.redirect("/logo"));
server.get("/logo", (_req, res) => {
    res.sendFile(content_path);
});

server.get("/currentUser", (_req, res) => {
    res.send({
        first_name: "Samuel",
        last_name: "Wilkins",
        email: "samuel_wilkins@brown.edu",
        phone: "4158239674"
    });
});

server.listen(port);
