const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode");
const socketIO = require("socket.io");
const express = require("express");
const fs = require("fs");
const http = require("http");
const formidable = require("formidable");
const path= require("path");

const port = 8080;

const app = express();
const staticPath= path.join(__dirname, "/public");
// console.log(staticPath);
app.use('/assets',express.static(staticPath+'/assets'));
const server = http.createServer(app);
const io = socketIO(server);

//create client
const client = new Client({
  authStrategy: new LocalAuth(),
});

app.get("/", (req, res) => {
  res.sendFile(staticPath+'/index.html');
  // res.sendFile("public/index.html", { root: __dirname });
});

// client.on('message',msg=>{
//   if(msg.body=='!ping'){
//     msg.reply('pong');
//   }else if(msg.body=='good morning'){
//     msg.reply('good morning');
//   }
// });

// client.initialize();

io.on("connection", function (socket) {
  socket.emit("message", "Connecting....");

  client.on("qr", (qr) => {
    // console.log("QR RECEIVED", qr);
    qrcode.toDataURL(qr, (err, url) => {
      socket.emit("qr", url);
      socket.emit("message", "QR Code Received, Scan Please!");
    });
  });

  client.on("ready", () => {
    socket.emit("ready", "Whatsapp is Ready!");
    socket.emit("message", "Whatsapp is Ready!");
  });

  client.on("authenticated", () => {
    socket.emit("authenticated", "Whatsapp is Authenticated!");
    socket.emit("message", "Whatsapp is Authenticated!");
    console.log("AUTHENTICATED");
  });
});

//send Bulk Message Redirect
app.post("/sendBulkWithMedia", (req, res) => {
  res.sendFile(__dirname + "/public/sendBulkWithMedia.html");
});

//Send single message Redirect
app.post("/sendBulkWoMedia", (req, res) => {
  res.sendFile(__dirname + "/public/sendBulkWoMedia.html");
});

//Send single message without media Redirect
app.post("/sendSingleWithMedia", (req, res) => {
  res.sendFile(__dirname + "/public/sendSingleWithMedia.html");
});

//Send single message without media Redirect
app.post("/sendSingleWoMedia", (req, res) => {
  res.sendFile(__dirname + "/public/sendSingleWoMedia.html");
});

//xlsx file upload code
app.post("/sbwm", (req, res) => {
  //Create an instance of the form object
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    let sbwmurl = fields.sbwmurl;
    let sbwmmsg = fields.sbwmmsg;
    let oldpath = files.fileupload.filepath;
    let newpath =
      "C:/Users/Public/Public Documents" + files.fileupload.originalFilename;
    fs.rename(oldpath, newpath, async function (err) {
      if (err) throw err;
      // res.write("File uploaded and Message Sending in Progress.....!");
      
      res.sendFile(__dirname + "/public/success.html");

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
      const media = await MessageMedia.fromUrl(sbwmurl);
      media.mimetype = "image/png";
      media.filename = "TEstingfile.jpg";
      numbers.forEach((num, wait_time) => {
        let formatnum = "91" + num + "@c.us";
        setTimeout(() => {
          client
            .isRegisteredUser(formatnum)
            .then(function (isRegisteredUser) {
              if (isRegisteredUser) {
                client.sendMessage(formatnum, media, { caption: sbwmmsg });
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

//send message without media
app.post("/sbwom", (req, res) => {
   //Create an instance of the form object
   const form = new formidable.IncomingForm();
   form.parse(req, (err, fields, files) => {
     let sbwommsg = fields.sbwommsg;
     let oldpath = files.fileupload.filepath;
     let newpath =
       "C:/Users/Public/Public Documents" + files.fileupload.originalFilename;
     fs.rename(oldpath, newpath, async function (err) {
       if (err) throw err;
       // res.write("File uploaded and Message Sending in Progress.....!");
       res.sendFile(__dirname + "/public/success.html");
 
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
 
       numbers.forEach((num, wait_time) => {
        let formatnum = "91" + num + "@c.us";
         setTimeout(() => {
           client
             .isRegisteredUser(formatnum)
             .then(function (isRegisteredUser) {
               if (isRegisteredUser) {
                 client.sendMessage(formatnum,  sbwommsg );
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


//send single message
app.post("/sswm", (req, res) => {
  //Create an instance of the form object
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    let swmurl = fields.swmurl;
    let swmmsg = fields.swmmsg;
    let swmnum = fields.swmnum;
    let formatnum = "91" + swmnum + "@c.us";
    // res.write("Message Sending in Progress.....!");
    res.sendFile(__dirname + "/public/success.html");

    // let url="https://margservice.in/emailtopp.jpg" ;
    const media = await MessageMedia.fromUrl(swmurl);
    media.mimetype = "image/png";
    media.filename = "testingfile.jpg";
    client.isRegisteredUser(formatnum).then(function (isRegisteredUser) {
      if (isRegisteredUser) {
        client.sendMessage(formatnum, media, { caption: swmmsg });
      } else {
        console.log(snum + " is not registered on whatsapp");
      }
    });
    res.end();
  });
});

//send message without media
app.post("/sswom", (req, res) => {
  //Create an instance of the form object
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    let swommsg = fields.swommsg;
    let swomnum = fields.swomnum;
    let formatnum = "91" + swomnum + "@c.us";
    res.sendFile(__dirname + "/public/success.html");

    client.isRegisteredUser(formatnum).then(function (isRegisteredUser) {
      if (isRegisteredUser) {
        client.sendMessage(formatnum, swommsg);
      } else {
        console.log(swomnum + " is not registered on whatsapp");
      }
    });
    res.end();
  });
});




client.initialize();

server.listen(port, function () {
  console.log("______________Created By Ashish Soni______________")
  console.log("Listening on PORT: " + port);
});
