
// const mysql = require('mysql');
const mysql = require('mysql2');
const express = require('express');
const app = express();
var bodyParser = require('body-parser');

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(bodyParser.json());
app.listen( 3000 ,function(){
    console.log('Node server running @ http://localhost:3000')
});
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Ttm@2010",
  database: "test2"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!!!")
});

app.get('/', (req, res) =>{
  res.send('Test Get Method')
})

app.post('/api/login', (req, res) => {
  console.log('req :' ,req.body)
  const { email, password } = req.body;

  // Thực hiện kiểm tra đăng nhập trong cơ sở dữ liệu
  const query = 'SELECT * FROM user WHERE email = ? AND password = ?';
  con.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (results.length > 0) {
        // Đăng nhập thành công
        res.status(200).json({ message: 'Login successful' });
      } else {
        // Sai thông tin đăng nhập
        res.status(401).json({ message: 'Invalid email or password' });
        
      }
    }
  });
});

app.post('/api/register', (req, res) => {
  console.log('req: ', req.body);
  const { email, password } = req.body;

  // Thực hiện kiểm tra xem email đã tồn tại trong cơ sở dữ liệu chưa
  const checkEmailQuery = 'SELECT * FROM user WHERE email = ?';
  con.query(checkEmailQuery, [email], (checkEmailErr, emailResults) => {
    if (checkEmailErr) {
      console.error('Error executing MySQL query:', checkEmailErr);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (emailResults.length > 0) {
        // Email đã tồn tại, trả về lỗi
        res.status(409).json({ error: 'Email already exists' });
      } else {
        // Email chưa tồn tại, thực hiện truy vấn INSERT để thêm người dùng mới
        const insertUserQuery = 'INSERT INTO user (email, password) VALUES (?, ?)';
        con.query(insertUserQuery, [email, password], (insertErr) => {
          if (insertErr) {
            console.error('Error executing MySQL query:', insertErr);
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            // Đăng ký thành công
            res.status(201).json({ message: 'Registration successful' });
          }
        });
      }
    }
  });
});