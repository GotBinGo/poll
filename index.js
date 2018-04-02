var fs = require('fs')
var login = require("facebook-chat-api");
const md5File = require('md5-file')
var http = require('http')
var fbuser = require('./config.js')

var url = 'http://bordak.eu'

//tom mat tryn
//1647754308607499
function router(command, thread, api){
	console.log(command)
	var arr = command.split(' ');
	if (arr[0] == 'bot')
	{
		if(arr[1] == 'time')
		{
			api.sendMessage((new Date()).toString(), thread);
		}
		else if(arr[1] == 'change')
		{
			change(command, thread, api)
		}
		else
		{
			api.sendMessage('commands:\nbot time - current time\nbot help - this help', thread);
		}

	}
}
login({email: fbuser.email, password: fbuser.pass}, (err, api) => {
	if(err) return console.error(err);
	api.listen((err, message) => {
		console.log(message.body);
		router(message.body, message.threadID, api);
	});
});

function change(command, thread, api)
{
	var file = fs.createWriteStream('./' + 'store/file_new.txt');
	http.get(url, function(res) {
		res.pipe(file);
		file.on('finish', function() {
			file.close(function(err) {
				console.log('done');
				try {
					const hash = md5File.sync('./store/file.txt')

					const hash_new = md5File.sync('./store/file_new.txt')
					if(hash == hash_new)
					{
						console.log('ua')
						api.sendMessage('ua', thread);
					}
					else
					{
						api.sendMessage('valtozott', thread);
						console.log('valtozott')
					}
				}
				catch(e) {}
				fs.renameSync('./store/file_new.txt', './store/file.txt');
				file.end();
			})
		})
	});
}
