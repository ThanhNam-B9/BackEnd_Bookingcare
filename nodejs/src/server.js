import express from "express";
import bodyParser from "body-parser"; // hỗ trợ lấy các tham số phía cline sửa dụng cho chúng ta
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
import connectDB from "./config/connectDB";
import cors from "cors";
require("dotenv").config(); // gọi đến  hàm config chạy được ,let port = process.env.PORT || 6969;
let app = express();
//app.use(cors({ origin: true }));
app.use(function (req, res, next) {
  // lỗi cors của gg không pháp tền miền hoặc cổng khác để truy lấy dữ liệu nên phải dung 1 middleware nhận biết bằng theo giá trị thứ ba next trong req,res,next
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", process.env.URL_REACT);

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});
//config app

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json({ limit: "500" }));
// app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

viewEngine(app);
initWebRoutes(app);
connectDB();
let port = process.env.PORT || 6969;
// port === undefined => port = 6969
app.listen(port, () => {
  //callback
  console.log("Backend Nodejs is runing on the port :" + port);
});
