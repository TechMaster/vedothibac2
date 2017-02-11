# Hướng dẫn tạo một Express web app đơn giản nhất

### Cài đặt các Node module cần thiết của ví dụ này
```bash
npm init
npm install --save express body-parser nunjucks
vim server.js
```

### Tạo server express sử dụng template engine Nunjucks đơn giản nhất
```javascript
const express = require('express');
const app = express();
const nunjucks = require('nunjucks');
const bodyParser = require("body-parser");

//Cấu hình nunjucks
nunjucks.configure('views', {
  autoescape: true,
  cache: false,
  express: app,
  watch: true
});


app.use('/public', express.static('public'));


// parse application/x-www-form-urlencoded
// for easier testing with Postman or plain HTML forms
app.use(bodyParser.urlencoded({
  extended: true
}));


// Set Nunjucks as rendering engine for pages with .html suffix
app.engine('html', nunjucks.render);
app.set('view engine', 'html');

app.get('/', (req, res) => {
  res.render('index.html');
});

app.listen(8080, () => {
  console.log('Web app listens at port 8080');
});
```
Sau đó chỉnh sửa entry script start ở package.json
```"start": "node server.js"```