const Rx = require('rxjs');
const Utilities = require('./utilities');
const Host = require('./host');

class Icinga2API {
	#utilities = null;
	#options = {
		path: '/v1',
		method: 'GET',
		timeout: 15000,
		rejectUnauthorized: false,
		headers: {
			'Accept': 'application/json'
		}
	};

	constructor(username, password, host = 'localhost', port = '5665') {
		return new Promise(async (resolve, reject) => {
			this.#utilities = new Utilities;
			this.#options.auth = username + ':' + password;
			this.#options.host = host;
			this.#options.port = port;
			try {
				const options = Object.assign({}, this.#options);
				delete options.headers;
				const data = await this.#utilities.makeRequest(options);
				//// TODO: Parse permissions from response and check against all future requests for more informational errors than just a 404.
				resolve(this);
			} catch(e) {
				reject(e);
			}
		});
	}

	host(hostname = null) {
		return new Host(this.#options, hostname);
	}


	events(queue, types) {
		return Rx.Observable.create((subject) => {
			const options = Object.assign({}, this.#options);
			options.method = 'POST';
			options.path += '/events?queue='+queue;
			types.forEach((type) => {
				options.path += '&types='+type;
			});

			this.#utilities.makeKeepAliveRequest(options).subscribe((data) => { subject.next(data) });
		});
	}
}

module.exports = Icinga2API;
