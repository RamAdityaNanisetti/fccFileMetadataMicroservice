var express = require('express');
var cors = require('cors');
require('dotenv').config()

var app = express();

const fs = require('fs');

if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

const path = require('path'); 
const multer = require('multer');
//const { path } = require('express/lib/application');
const storage = multer.diskStorage({
  destination: (req, file, cb)=>{
    cb(null, 'uploads/');
  },
  filename: (req, file, cb)=>{
    cb(null, Date.now()+path.extname(file.originalname));
  }
})
const upload = multer({ storage: storage });

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/fileanalyse', upload.single('upfile'), (req, res)=>{
  console.log(req.file);
  const uploadedFile = req.file;
  if(!uploadedFile) return res.status(400).send('No file uploaded.');
  res.send({
    name: uploadedFile.originalname,
    type: uploadedFile.mimetype,
    size: uploadedFile.size,
  });
});


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
