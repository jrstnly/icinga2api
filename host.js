const Utilities = require('./utilities');

class Host {
	#utilities = null;
	#options = null;
	#name = null;

	constructor(options, host) {
		this.#utilities = new Utilities;
		this.#options = options;
		this.#name = host;
		return this;
	}

	async groups() {
		return new Promise(async (resolve, reject) => {
			const options = Object.assign({}, this.#options);
			options.path += '/objects/hostgroups';

			const res = await this.#utilities.makeRequest(options);
			if (res.code == 200) {
				const data = JSON.parse(res.data);
				resolve(data.results);
			} else {
				reject(res);
			}
		});
	}

	async all() {
		return new Promise(async (resolve, reject) => {
			const options = Object.assign({}, this.#options);
			options.path += '/objects/hosts';

			const res = await this.#utilities.makeRequest(options);
			if (res.code == 200) {
				const data = JSON.parse(res.data);
				resolve(data.results);
			} else {
				reject(res);
			}
		});
	}

}

module.exports = Host;
