# Hướng dẫn bài vẽ đồ thị bậc 2

Tác giả Trịnh Minh Cường, bài giảng trong khóa học [Full Stack Node.js 2017](https://techmaster.vn/khoa-hoc/25544/full-stack-nodejs-2017)

## Bài này gồm có 3 bước:
1. Người dùng nhập vào 3 giá trị a, b, c của hàm ```y = f(x) = a.x^2 + b.x + c``` ấn nút submit
2. Tính nghiệm x1 và x2
3. Vẽ đồ thị theo các kỹ thuật khác nhau: không dùng promise, dùng promise, dùng async-await

## Các kỹ thuật demo
- BlueBird Promise, xem [promise.js](https://github.com/TechMaster/vedothibac2/blob/master/promise.js)
- Asyc Await trong ES7, xem [asynawait.js](https://github.com/TechMaster/vedothibac2/blob/master/asynawait.js)
- Viết gulp file để start ứng dụng tự động [gulpfile.js](https://github.com/TechMaster/vedothibac2/blob/master/gulpfile.js)

## Yêu cầu khi làm bài này cần:
1. Sử dụng pattern SOLID, tách phần tính nghiệm, và sinh dữ liệu ra khỏi phần đồ thị để trong tương
lai nếu đổi thư viện vẽ đồ thị, thì chúng ta chỉ phải chỉnh sửa ít nhất

2. Nếu đã tách bách được các module, thành phần thì sẽ kiểm thử sẽ rất dễ dàng


## Chạy thử ứng dụng

```bash
git clone https://github.com/TechMaster/vedothibac2.git
cd vedothibac2
npm install
node nopromise.js
node promise.js
node --harmony-async-await asynwait.js
node --harmony-async-await awaitajax.js
```
Sử dụng browser để truy cập:

- nopromise.js hứng ở cổng 3000, http://localhost:3000
- promise.js hứng ở cổng 4000, http://localhost:4000
- asynawait.js hứng ở cổng 5000, http://localhost:5000. Chú ý phải có option --harmony-async-await khi dùng node chạy.
- awaitajax.js hứng ở cổng 7000, http://localhost:7000.

## Sử dụng gulp chạy tự động
Thay vì gõ lệnh Node để khởi động 4 web server ta viết code khởi động vào [gulpfile.js](https://github.com/TechMaster/vedothibac2/blob/master/gulpfile.js) sau đó chạy lệnh gulp
Để chạy gulp cần cài thêm các module gulp, gulp-util, child_process
gulp tiết kiệm rất nhiều thời gian gõ lệnh terminal.

## Mẫu dữ liệu [a, b, c] truyền vào:

1. [1, 1, 1]: báo lỗi không vẽ được do đồ thị vô nghiệm
2. [1, 10, 7]: có nghiệm vẽ được đồ thị
3. [-1, 10, 7]: đồ thị úp ngược lại
4. [2, 0, 0]: đáy đồ thị ở gốc [0.0, 0.0]


## Các bước thực hiện

1. Tạo Express web app đơn giản. [Hướng dẫn chi tiết](express_boilerplate.md)
2. Viết hàm tính phương trình bậc 2, cần viết nó độc lập hoàn toàn với Expres hay các IO feature.
3. Viết hàm vẽ đồ thị sử dụng 2 mảng x_series và y_series

## Dùng hay không dùng Promise?

Có 2 ví dụ: promise.js và nopromise.js

### nopromise.js
```javascript
app.post('/', (req, res) => {
  try {
    [a, b, c] = math.validate_abc(req.body.a, req.body.b, req.body.c);    
    renderChart(a, b, c);
    res.render('index.html', {'a': a, 'b': b, 'c': c});  //trả về ngay mà không chờ kết quả ảnh đã tạo xong chưa
  } catch (err) {
    res.send(`Error: ${err.message}`);
  }
});
```

Ở đây renderChart là hàm asynchronous, nếu res.render không đợi kết quả nó trả về thì server trả về trang web ngay mà 
không quan tâm đồ thị đã được sinh xong hay chưa.

### promise.js
Trong renderChart tạo ra một Promise. Khi nào đồ thị tạo xong thì resolve(), báo hoàn tất. Lúc này mới trả về trang web.
Trang web render sẽ đờ đẫn khi biểu đồ phức tạp, mất nhiều thời gian để vẽ.

Để xử lý vấn đề này, hãy sử dụng kỹ thuật AJAX

```javascript
function renderChart(a, b, c) {
  return new Promise((resolve, reject) => {
    let x_series, y_series;
    try {
      [x_series, y_series] = math.gendata(a, b, c);
    } catch (err) {
      reject(`math.gendata failed: ${err}`);
    }

    let trace = {
      x: x_series,
      y: y_series,
      type: "scatter"
    };

    let figure = {'data': [trace]};

    let imgOpts = {
      format: 'png',
      width: 1000,
      height: 500
    };


    plotly.getImage(figure, imgOpts, function (error, imageStream) {
      if (error) {
        reject(`plotly.getImage failed: ${error}`);
      }

      let filePath = __dirname.concat('/public/1.png');

      let fileStream = fs.createWriteStream(filePath);
      imageStream.pipe(fileStream);
      resolve();
    });

  });
}
```

## Async Await
Trong Node.js phiên bản trước 7.6, async await chỉ là tính năng thử nghiệm phải có option --harmony-async-await khi chạy.
Từ phiên bản 7.6 sau nay, [https://github.com/nodejs/node/blob/master/doc/changelogs/CHANGELOG_V7.md#7.6.0](async await được hỗ trợ do Node.js đã sử dụng V8 Engine version 5.5)

async await giúp viết code dễ hiểu hơn một chút so với Promise.then. Nếu callback thì hàm xử lý kết quả lồng nhau (nest call back).
Với Promise thì hàm xử lý lại nối chuỗi .then().then().then().
Còn async await viết hàm async nhưng phong cách tuần tự từng dòng lệnh như là viết hàm sync.

```javascript
//Phong cách Promise
renderChart(a, b, c)
  .then((x1, x2, filePath) => {  
  
  })

//Phong cách async await nhìn thân thương hơn nhiều
[x1, x2, filePath] = await renderChart(a, b, c);
```

#AJAX
Đây là cách hợp lý nhất về trải nghiệm người dùng, nghiệm trả về và đồ thị là kết quả trả về của lời gọi AJAX.
Form sẽ không phải load.

Xem ví dụ [awaitajax.js](https://github.com/TechMaster/vedothibac2/blob/master/awaitajax.js) và 
[views/index3.html](https://github.com/TechMaster/vedothibac2/blob/master/views/index3.html)

```javascript
 var str = $("#paramform").serialize();  //ghép giá trị các trường trong form thành một chuỗi
    $.ajax({
      type: 'POST',
      url: "/",  //địa chỉ server
      data: str,
      dataType: 'json',  //Kiểu dữ liệu mong muốn là JSON
      success: function (data) {  //Hàm hứng sự kiện trả về
        $("#x1").text('x1= '.concat(data.x1));
        $("#x2").text('x2= '.concat(data.x2));
        $("#graph").attr("src", data.filePath);
      }
    })
```


