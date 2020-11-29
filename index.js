const https = require('https');
const Rx = require('rxjs');

class Icinga2API {
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
			this.#options.auth = username + ':' + password;
			this.#options.host = host;
			this.#options.port = port;
			try {
				const options = Object.assign({}, this.#options);
				delete options.headers;
				const data = await this.makeRequest(options);
				//// TODO: Parse permissions from response and check against all future requests for more informational errors than just a 404.
				resolve(this);
			} catch(e) {
				reject(e);
			}
		});
	}


	events(queue, types) {
		return Rx.Observable.create((subject) => {
			const options = Object.assign({}, this.#options);
			options.method = 'POST';
			options.path += '/events?queue='+queue;
			types.forEach((type) => {
				options.path += '&types='+type;
			});

			this.makeKeepAliveRequest(options).subscribe((data) => { subject.next(data) });
		});
	}


	makeRequest(options) {
		return new Promise((resolve, reject) => {
			let ret = { code: 0, status: "", data: "" };
			const req = https.request(options, (res) => {
				ret.code = res.statusCode;
				ret.status = res.statusMessage;
				res.on('data', (data) => { ret.data += data });
			});
			req.end();

			req.on('error', (e) => {
				reject(e);
			});

			req.on('close', (e) => {
				if (ret.code == "200") {
					resolve(ret);
				} else {
					reject(ret);
				}
			})
		});
	}
	makeKeepAliveRequest(options) {
		options.agent = new https.Agent({
			keepAlive: true,
			maxSockets: 1
		});
		return Rx.Observable.create((subject) => {
			let ret = { code: 0, status: "", data: "" };
			const connect = () => {
				const req = https.request(options, (res) => {
					res.on('data', (data) => {
						if (data.length != 1) {
							let event = JSON.parse(data);
							subject.next(event);
						}
					});
				});
				req.end();

				req.on('error', (e) => {
					setTimeout(() => {
						connect();
					}, 2500);
				});
				req.on('close', (e) => {
					setTimeout(() => {
						connect();
					}, 2500);
				})
			}
			connect();
		});
	}
}

module.exports = Icinga2API;
