const {Client, LocalAuth, MessageMedia}= require("whatsapp-web.js");
const qrcode= require("qrcode");
const socketIO= require("socket.io");
const express= require("express");
const fs= require("fs");
const http= require('http');
const formidable = require("formidable");

const port= 8080;

const app= express();
const server= http.createServer(app);
const io= socketIO(server);


//create client
const client = new Client({
  authStrategy: new LocalAuth(),
});

app.get('/',(req,res)=>{
  res.sendFile('index.html',{root:__dirname});
})

// client.on('message',msg=>{
//   if(msg.body=='!ping'){
//     msg.reply('pong');
//   }else if(msg.body=='good morning'){
//     msg.reply('good morning');
//   }
// });

// client.initialize();

io.on('connection', function(socket){
  socket.emit('message', 'Connecting....');

  client.on('qr', (qr)=>{
    // console.log("QR RECEIVED", qr);
    qrcode.toDataURL(qr, (err, url)=>{
      socket.emit('qr',url);
      socket.emit('message',"QR Code Received, Scan Please!");
    });
  });
  
  client.on('ready', ()=>{
    socket.emit('ready', 'Whatsapp is Ready!');
    socket.emit('message', 'Whatsapp is Ready!');
  });  

  client.on('authenticated',()=>{
    socket.emit('authenticated', 'Whatsapp is Authenticated!');
    socket.emit('message', 'Whatsapp is Authenticated!');
    console.log("AUTHENTICATED");
  })

});

app.post('/sendMsg',(req,res)=>{
  res.sendFile(__dirname + "/sendBulkMsg.html")
})

app.post('/sendSingleMsg',(req,res)=>{
  res.sendFile(__dirname + "/sendSingleMsg.html")
})


app.post("/upload", (req, res) => {
  //Create an instance of the form object
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    let url = fields.url;
    let msg = fields.msg;
    let oldpath = files.fileupload.filepath;
    let newpath ="C:/Users/Public/Public Documents" + files.fileupload.originalFilename;
    fs.rename(oldpath, newpath, async function (err) {
      if (err) throw err;
      // res.write("File uploaded and Message Sending in Progress.....!");
      res.sendFile(__dirname + '/success.html');

      const xlsx = require("xlsx");
      const workbook = xlsx.readFile(newpath);
      const sheetName = "Sheet1"; // replace with the name of your sheet
      const sheet = workbook.Sheets[sheetName];
      const range = xlsx.utils.decode_range(sheet["!ref"]);

      const numbers = []; //number array

      //fetch xlsx file and store into array
      for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
        const cellAddress = xlsx.utils.encode_cell({ r: rowNum, c: 0 });
        const cell = sheet[cellAddress];
        if (cell && cell.t === "n") {
          // check if the cell contains a number
          numbers.push(cell.v);
        }
      }
       
        // let url="https://margservice.in/emailtopp.jpg" ;
        const media = await MessageMedia.fromUrl(url);
        media.mimetype = "image/png";
        media.filename = "TEstingfile.jpg";
        numbers.forEach((num, wait_time) => {
          setTimeout(() => {
            client
              .isRegisteredUser(num + "@c.us")
              .then(function (isRegisteredUser) {
                if (isRegisteredUser) {
                  client.sendMessage(num + "@c.us", media, { caption: msg });
                } else {
                  console.log(num + " is not registered on whatsapp");
                }
              });
          }, 5000 * wait_time);
        });



      res.end();
    });
  });
});
//Upload section fininshed

app.post("/sendSingle", (req, res) => {
  //Create an instance of the form object
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    let surl = fields.surl;
    let smsg = fields.smsg;
    let snum= fields.smobile;
    let formatnum= '91'+snum+"@c.us";
    // res.write("Message Sending in Progress.....!");
    res.sendFile(__dirname + '/success.html');

      // let url="https://margservice.in/emailtopp.jpg" ;
        const media = await MessageMedia.fromUrl(surl);
        media.mimetype = "image/png";
        media.filename = "TEstingfile.jpg";
            client
              .isRegisteredUser(formatnum)
              .then(function (isRegisteredUser) {
                if (isRegisteredUser) {
                  client.sendMessage(formatnum, media, { caption: smsg });
                } else {
                  console.log(num + " is not registered on whatsapp");
                }
              });
      res.end();
    });
  });

//single send completed
client.initialize();

server.listen(port,function(){
  console.log("Listening on PORT: "+port);
})