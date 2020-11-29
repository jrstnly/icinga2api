const https = require('https');
const Rx = require('rxjs');

class Utilities {
	constructor() { return this; }

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

module.exports = Utilities;
