const express = require("express");
const handlebars = require("express-handlebars");
const mongodbConnection = require("./configs/mongodb-connection");
const postService = require("./services/post-service");

const app = express();
let collection;

// 1. 뷰 엔진 설정 (Handlebars)
app.engine(
  "handlebars",
  handlebars.create({
    defaultLayout: "main", // 기본 레이아웃 (main.handlebars)
    layoutsDir: __dirname + "/views/layouts", // 레이아웃 디렉토리 경로
    helpers: require("./configs/handlebars-helpers"), // 헬퍼 함수 로드
  }).engine
);
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

// 2. 미들웨어 설정
app.use(express.json()); // JSON 요청 파싱
app.use(express.urlencoded({ extended: true })); // 폼 데이터 파싱

// 3. 라우터 설정
app.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const search = req.query.search || "";
  try {
    const [posts, paginator] = await postService.list(collection, page, search);
    res.render("home", { title: "테스트 게시판", search, paginator, posts });
  } catch (error) {
    console.error(error);
    res.render("home", { title: "테스트 게시판"});
  }
});

app.get("/write", (req, res) => {
  res.render("write", { title: "테스트 게시판", mode: "create" });
});

app.get("/modify/:id", async (req, res) => {
  const post = await postService.getPostById(collection, req.params.id);
  console.log(post);
  res.render("write", { title: "테스트 게시판 ", mode: "modify", post });
});

app.post("/modify", async (req, res) => {
  const { id, title, writer, password, content } = req.body;

  const post = {
    title,
    writer,
    password,
    content,
    createdDt: new Date().toISOString(),
  };
  const result = await postService.updatePost(collection, id, post);
  res.redirect(`/detail/${id}`);
});

app.post("/write", async (req, res) => {
  const post = req.body;
  const result = await postService.writePost(collection, post);
  res.redirect(`/detail/${result.insertedId}`);
});




app.get("/detail/:id", async (req, res) => {
    try {
      const post = await postService.getDetailPost(collection, req.params.id);
      res.render("detail", {
        title: "테스트 게시판",
        post: post.value, // ← 여기 중요! findOneAndUpdate는 result.value에 있음
      });
    } catch (error) {
      console.error(error);
      res.redirect("/");
    }
  });

app.post("/check-password", async (req, res) => {
    const { id, password } = req.body;
    const post = await postService.getPostByIdAndPassword(collection, { id, password });
    if (!post) {
        return res.status(404).json({ isExist: false });
    } else {
        return res.json({ isExist: true });
    }
});


// 4. 서버 시작 및 MongoDB 연결
app.listen(3000, async () => {
  console.log("Server started on http://localhost:3000");

  const mongoClient = await mongodbConnection();
  collection = mongoClient.db().collection("post");

  console.log("MongoDB connected");
});