const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://kttak0315:pvdrlm3gRCMtrhyE@cluster0.atil3ka.mongodb.net/myFirstDatabse?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function run() {
    await client.connect();
    const adminDB = client.db('test').admin();
    const listDatabases = await adminDB.listDatabases();
    console.log(listDatabases);
    return "OK";
}

run()
    .then(console.log)
    .catch(console.error)
    .finally(() => client.close());



// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     client.close();
// });