const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://kttak0315:pvdrlm3gRCMtrhyE@cluster0.atil3ka.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// const url = "mongodv+srv://kttak0315:pvdrlm3gRCMtrhyE@cluster0.atil3ka.mongodb.net/test?retryWrites=true&w=majority";

const client = new MongoClient(url, { useNewUrlParser: true });

async function main() {
    try {
        await client.connect();
        console.log('MongoDB 접속 성공');
        const collection = client.db('test').collection('person');
        await collection.insertOne({ name: 'Andy', age: 30 });
        console.log('문서 추가 완료');
        const documents = await collection.find({ name: 'Andy' }).toArray();
        console.log('찾은 문서:', documents);
        await collection.updateOne({ name: 'Andy' }, { $set: { age:31 } });
        console.log('문서 업데이트');
        const updatedDocuments = await collection.find({ name: 'Andy' }).toArray();
        console.log('갱신된 문서 :', updatedDocuments);
        
        await client.close();
    } catch (err) {
        console.error(err);
    }
}

main();