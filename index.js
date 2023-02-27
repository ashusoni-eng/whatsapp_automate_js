const qrcode = require('qrcode-terminal');

const { Client , LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth()
});
 

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
    client.getChats().then((chats)=>{
        const myChat= chats.find(
            (chat)=>chat.name==="Ashish Jio"
        );
        client.on('message', message => {
            if(message.body.toLowerCase() === 'ping') {
                message.reply('pong');
            }
        });
        
        // client.sendMessage(myChat.id._serialized,"Hello ")
    });
});

client.initialize();
 