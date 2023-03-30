const http = require("http");
const app = require("./app");
const PORT = process.env.PORT || 500;
http.createServer(app).listen(PORT,()=>{
    console.log(`Server is runing on port ${PORT}`);
});


