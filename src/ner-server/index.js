// index.js
var spawn = require('child_process').spawn;
var _ = require('underscore');
var net = require('net');

var ner_port = 9191
var ner_host = 'localhost'

module.exports = {
	post: post
};

function post(host, port, text, callback) {
	var socket = new net.Socket();
	port = port? port: ner_port;
	host = host? host: ner_host;
	
	socket.connect(port, host, function () {
		socket.setNoDelay(true);
		socket.write(text.replace(/\r?\n|\r|\t/g, ' ') + '\n');
	});

	socket.on('data', function (data) {
		var re = /<([A-Z]+?)>(.+?)<\/\1>/g;
		var str = data.toString();
		var res = {};
		res.tags = parse(str);
		socket.destroy();
		callback(undefined, res);
	});

	socket.on('error', function (err) {
		callback(err, undefined);
	});
}

var parse = function(slashtags) {
	// console.log('original string result:', slashtags)
	var tokenized   = slashtags.split(/\s/gmi);
	var splitRegex  = new RegExp('(.+)/([A-Z]+)','g');
	var tagged = _.map(tokenized, 
		function(token) {
			var parts = new RegExp('(.+)/([A-Z]+)','g').exec(token);
			return (parts)? { w: parts[1], t: parts[2] }: null;
		}
	);

	tagged = _.compact(tagged);
    //console.log('tagged:', tagged)
	// Now we extract the neighbors into one entity
	var entities = {};
	var prevEntity = false;
	var entityBuffer = [];
	for (var i=0;i<tagged.length;i++) {
		if (tagged[i].t != 'O') {
            //console.log("recognized", tagged[i])
			if (tagged[i].t != prevEntity) {
				// New tag!
				// Was there a buffer?
				if (entityBuffer.length>0) {
					// There was! We save the entity
					if (!entities.hasOwnProperty(prevEntity)) {
						entities[prevEntity] = [];
					}
					entities[prevEntity].push(entityBuffer.join(' '));
					// Now we set the buffer
					entityBuffer = [];
				}
				// Push to the buffer
				entityBuffer.push(tagged[i].w);
			} else {
				// Prev entity is same a current one. We push to the buffer.
                entityBuffer.push(tagged[i].w);
			}
		} else {
			if (entityBuffer.length>0) {
				// There was! We save the entity
				if (!entities.hasOwnProperty(prevEntity)) {
					entities[prevEntity] = [];
				}
                //console.log('saving entity:', entityBuffer.join(' '))
				entities[prevEntity].push(entityBuffer.join(' '));
				// Now we set the buffer
				entityBuffer = [];
			}
		}
		// Save the current entity
		prevEntity = tagged[i].t;
	}
    
    // Check entityBuffer one last time to make sure we account for the last term
	if (entityBuffer.length>0) {
		// There was! We save the entity
		if (!entities.hasOwnProperty(prevEntity)) {
			entities[prevEntity] = [];
		}
		entities[prevEntity].push(entityBuffer.join(' '));
		// Now we set the buffer
		entityBuffer = [];
	}
    
	return entities;
}