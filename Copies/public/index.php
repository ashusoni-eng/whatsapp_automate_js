<!DOCTYPE html>
<html>
<head>
	<title>WhatsApp Bulk Sender</title>
	<style>
		body {
			background-color: #e6e6e6;
			font-family: Arial, sans-serif;
		}
		.container {
			margin: 0 auto;
			max-width: 500px;
			padding: 20px;
			background-color: #fff;
			border: 1px solid #d9d9d9;
			box-shadow: 0 0 10px #d9d9d9;
			text-align: center;
		}
		h1 {
			font-size: 28px;
			margin-bottom: 20px;
		}
		ul {
			list-style: none;
			padding: 0;
			margin: 0;
			text-align: left;
		}
		li {
			margin-bottom: 10px;
		}
		img {
			width: 200px;
			height: 200px;
			margin-bottom: 20px;
		}
	</style>
</head>
<body>
	<div class="container">
		<h1>WhatsApp Web</h1>
		<img src="" alt="QR CODE" id="qrcode">
		<h3>Logs: </h3>
        <ul class="logs"></ul>
	</div>
    <div style="display: flex;justify-content: center;margin-top: 20px;">
        <form action="sendMsg" method="POST">
            <button style="background-color: #25D366;margin-right:20px; color: #fff; font-family: 'Helvetica Neue', sans-serif; font-size: 16px; padding: 10px 20px; border: none; border-radius: 5px;cursor: pointer;">
                Send Bulk Message
            </button>
        </form>

		<form action="sendMsgWoMedia" method="POST">
            <button style="background-color: #25D366; margin-left:20px;color: #fff; font-family: 'Helvetica Neue', sans-serif; font-size: 16px; padding: 10px 20px; border: none; border-radius: 5px;cursor: pointer;">
                Send Single Text Message
            </button>
        </form>

		<form action="sendSingleMsg" method="POST">
            <button style="background-color: #25D366; margin-left:20px;color: #fff; font-family: 'Helvetica Neue', sans-serif; font-size: 16px; padding: 10px 20px; border: none; border-radius: 5px;cursor: pointer;">
                Send Single Message
            </button>
        </form>
    </div>


    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.3/jquery.min.js" integrity="sha512-STof4xm1wgkfm7heWqFJVn58Hm3EtS31XFaagaa8VMReCXAkQnJZ+jEy8PCC/iT18dFy95WcExNHFTqLyp72eQ==" crossorigin="anonymous"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.6.1/socket.io.min.js" integrity="sha512-AI5A3zIoeRSEEX9z3Vyir8NqSMC1pY7r5h2cE+9J6FLsoEmSSGLFaqMQw8SWvoONXogkfFrkQiJfLeHLz3+HOg==" crossorigin="anonymous"></script>

    <script>
        $(document).ready(function(){
            var socket= io.connect('http://localhost:8080', {path:'/socket.io'});

            socket.on('message', function(msg){
                $('.logs').append($('<li>').text(msg));
            });

            socket.on('qr', function(src){
                $('#qrcode').attr('src', src);
            })

            socket.on('ready', function(src){
                $('#qrcode').attr('src','https://margservice.in/imagelink/upload/64037f4264354.jpg');
            })

            socket.on('authenticated', function(src){
                $('#qrcode').attr('src','https://margservice.in/imagelink/upload/64037f4264354.jpg');
            })
        });
    </script>
</body>
</html>
