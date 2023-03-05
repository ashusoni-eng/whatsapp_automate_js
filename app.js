const qrcode = require('qrcode');
const currentDate = new Date();
const formattedDate = currentDate.toLocaleString('en-US', { timeZone: 'America/New_York' });
let filen=formattedDate+".png"

// console.log(filen);

qrcode.toFile(filen,"https://margservice.in", function(err){
  if(err) return console.log(err);
})
