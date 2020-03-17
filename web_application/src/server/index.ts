import * as express from "express";
import { resolve } from "path";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import { Database } from "./database";
import { Job } from "../client/models/Job";

const port = 1050;
const database = {
    name: "InTurn",
    userCollection: "users"
}

const static_path = resolve(__dirname, "../../static");
const content_path = resolve(__dirname, "../../src/index.html");

const server = express();

server.use(express.static(static_path));

server.use(bodyParser.json({ limit: "10mb" }));
server.use(bodyParser.urlencoded({ extended: true }));
server.use(cors());

server.get("/", (_req, res) => res.redirect("/home"));
server.get("/home", (_req, res) => res.sendFile(content_path));

server.post("/inquireUser", async (req, res) => {
    const { body: { user } } = req;
    const users = await Database.getOrCreateCollection(database.userCollection)
    users.findOne({ email: user }, { projection: { _id: 0 } }, (error, result) => {
        res.send(error ? undefined : result);
    });
});

server.get("/delete", (_req, res) => {
    Database.clearCollections("jobs");
    res.redirect("/");
});

server.post("/jobs", async (req, res) => {
    const { body } = req;
    if (!Object.keys(body).length) {
        const jobs = await Database.getOrCreateCollection("jobs");
        const cursor = jobs.find();
        let collector: Job[] = [];
        await cursor.forEach(job => collector.push(job));
        res.send(collector);
    } else {
        const result = await Database.insert("jobs", body);
        if ("insertedId" in result) {
            res.send(result.insertedId);
        } else if ("insertedIds" in result) {
            const { insertedIds } = result;
            const collected = Object.keys(insertedIds).map(key => insertedIds[Number(key)])
            res.send(collected);
        } else {
            res.send(undefined);
        }
    }
});

server.post("/jobUpdate", async (req, res) => {
    const { body } = req;
    await Database.updateField("jobs", body.job, body.field);
    res.send();
});

(async () => {
    const { userCollection, name } = database;
    await Database.connect(name);
    if (!(await Database.existsCollection(userCollection))) {
        await Database.insert(userCollection, {
            first_name: "Samuel",
            last_name: "Wilkins",
            email: "samuel_wilkins@brown.edu",
            phone: "4158239674",
            linkedin_profile: "www.linkedin.com/in/sam-wilkins-173b09132",
            university: "Brown University",
            website: "http://www.samwilkins.me",
            attributes: {
                gender: "male",
                hispanic_latino: false,
                race: "white",
                veteran: false,
                disabled: false
            }
            // attributes: false
        });
    }
    server.listen(port, () => console.log(`Server listening on port ${port}...`));
})();