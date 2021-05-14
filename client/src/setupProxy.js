const proxy = require("http-proxy-middleware");

//api 호출을 통한 포트는 5000으로 지정
module.exports = function(app) {

    app.use(proxy("/api", { target: "http://localhost:5000/" }));

};
