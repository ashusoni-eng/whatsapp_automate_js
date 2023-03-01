const qrcode = require('qrcode-terminal');

const xlsx = require('xlsx');
const workbook = xlsx.readFile('numbers_list/num.xlsx');
const sheetName = 'Sheet1'; // replace with the name of your sheet
const sheet = workbook.Sheets[sheetName];
const range = xlsx.utils.decode_range(sheet['!ref']);

const numbers = [];         //number array

const { Client , LocalAuth, MessageMedia } = require('whatsapp-web.js');

const http = require('http');
const formidable = require('formidable');
const fs = require('fs');
const cors = require("cors");

http.use(cors());

http.createServer(function (req, res){
    if (req.url == '/fileupload') {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            let oldpath = files.filetoupload.filepath;
            let newpath = 'G:/Project/Whatsapp_auto_js/numbers_list/' + files.filetoupload.originalFilename;
            fs.rename(oldpath, newpath, function (err) {
              if (err) throw err;
              res.write('File uploaded and moved!');
              res.end();
            });
        });
    }else{
        res.writeHead(200,{'Content-Type':'text/html'});
        res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
        res.write('<input type="file" name="filetoupload"><br>');
        res.write('<input type="submit">');
        res.write('</form>');
        return res.end();
    }    
}).listen(8000);

//fetch xlsx file and store into array
for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
    const cellAddress = xlsx.utils.encode_cell({ r: rowNum, c: 0 });
    const cell = sheet[cellAddress];
    if (cell && cell.t === 'n') { // check if the cell contains a number
      numbers.push(cell.v);
    }
  }

//create client
const client = new Client({
    authStrategy: new LocalAuth()
});
 
//create qr code
client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});


client.on('ready', async () => {
    console.log('Client is ready!');
    // let url="https://margservice.in/emailtopp.jpg" ;
    // const media= await MessageMedia.fromUrl(url);
    // media.mimetype= "image/png";
    // media.filename="TEstingfile.jpg";
    // numbers.forEach((num,wait_time)=>{
    //     setTimeout(()=>{
            client.sendMessage("919098221369@c.us","Hellow This is test message ");
        // },8000*wait_time);
        
    // });
    
  
});

client.initialize();
 