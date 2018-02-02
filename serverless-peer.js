var topology = require('fully-connected-topology');
var jsonStream = require('duplex-json-stream');
//var wrtcSwarm = require('webrtc-swarm');
var streamSet = require('stream-set');
var register = require('register-multicast-dns');
var toPort = require('hash-to-port');

var me = process.argv[2];
var friends = process.argv.slice(3);

var swarm = topology(toAddress(me), friends.map(toAddress));
var streams = streamSet();
var id = Math.random();
var seq = 0;
var logs = {};

register(me);

swarm.on('connection', function (friend) {
	console.log('new connection!');
	friend = jsonStream(friend);
	streams.add(friend);

	friend.on('data', function (data) {
		if(logs[data.log] <= data.seq) return;
		logs[data.log] = data.seq;
		console.log(data.username + '> ' + data.message);
		streams.forEach(function (otherFriend) {
			otherFriend.write(data);
		});
	});
});

process.stdin.on('data', function (data) {
	var next = seq++;
	streams.forEach(function (friends) {
		friends.write({log: id, seq: seq, username: me,
				message: data.toString()});
	});
});

function toAddress (name) {
	return name + '.local:' + toPort(name);
}




