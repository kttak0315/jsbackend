const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Person = require("./person-model");

mongoose.set("strictQuery", false); // 설정해줘야 경고가 뜨지 않음

const app = express();
app.use(bodyParser.json()); // HTTP에서  Body를 파싱하기 위한 설정
app.listen(3000, async () => {
    console.log("Server started");
    const mongodbUri = "mongodb+srv://kttak0315:pvdrlm3gRCMtrhyE@cluster0.atil3ka.mongodb.net/test?retryWrites=true&w=majority";
    mongoose
        .connect(mongodbUri, { useNewUrlParser: true })
        .then(console.log("connected to MongoDB"));
});

app.get("/person", async (req, res) => {
    const person = await Person.find({});
    res.send(person);
});

app.get("/person/:email", async (req, res) => {
    const person = await Person.findOne({ email: req.params.email });
    res.send(person);
});

app.post("/person", async (req, res) => {
    const person = new Person(req.body);
    await person.save();
    res.send(person);
});

app.put("/person/:email", async (req, res) => {
    const person = await Person.findOneAndUpdate(
        { email: req.params.email },
        { $set: req.body },
        { new: true }
    );
    console.log(person);
    res.send(person);
});

app.delete("/person/:email", async (req, res) => {
    await Person.deleteMany({ email: req.params.email });
    res.send({ success: true});
});