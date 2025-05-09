const paginator = require("../utils/paginator");
const { ObjectId } = require("mongodb");

async function writePost(collection, post) {
    post.hits = 0;
    post.createDt = new Date().toISOString();
    return await collection.insertOne(post);
}

async function list(collection, page, search) {
    const perPage =  10;
    const query = {title: new RegExp(search, "i") };
    const cursor = collection.find(query, { limit: perPage, skip: (page - 1) * perPage }).sort({
        createDt: -1,
    });
    const totalCount = await collection.count(query);
    const posts = await cursor.toArray();
    const paginatorObj = paginator({ totalCount, page, perPage: perPage });
    return [posts, paginatorObj];
}

const projectionOption = {
    projection: {
        password: 0,
        "comment.password": 0,
    },
};


async function getDetailPost(collection, id) {
    if (!ObjectId.isValid(id)) {
        throw new Error("유효하지 않은 ObjectId 형식입니다: " + id);
    }

    return await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $inc: { hits: 1 } },
        projectionOption
    );
}

async function getPostByIdAndPassword(collection, { id, password }) {
    return await collection.findOne({ _id: ObjectId(id), password: password }, projectionOption);
}

async function getPostById(collection, id) {
    return await collection.findOne({ _id: ObjectId(id) }, projectionOption);
}

async function updatePost(collection, id, post) {
    const toUpdatePost = {
        $set: {
            ...post,
        },
    };
    return await collection.updateOne({ _id: ObjectId(id) }, toUpdatePost);
}

module.exports = {
    list,
    writePost,
    getDetailPost,
    updatePost,
    getPostById,
    getPostByIdAndPassword,
    updatePost,
};