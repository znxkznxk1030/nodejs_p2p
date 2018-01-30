var topology = require('fully-connected-topology');
var jsonStream = require('duplex-json-stream');
var streamSet = require('stream-set');
var register = require('register-multicast-dns');
var toPort = require('hash-to-port');

var me = process.argv[2];
var friends = process.argv.slice(3);

var swarm = topology(toAddress(me), friends.map(toAddress));
var streams = streamSet();

register(me);

swarm.on('connection', function (friend) {
	console.log('new connection!');
	friend = jsonStream(friend);
	streams.add(friend);

	friend.on('data', function (data) {
		console.log(data.username + '> ' + data.message);
	});
});

process.stdin.on('data', function (data) {
	streams.forEach(function (friends) {
		friends.write({username: me,
				message: data.toString()});
	});
});

function toAddress (name) {
	return name + '.local:' + toPort(name);
}
