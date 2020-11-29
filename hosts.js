const Utilities = require('./utilities');

class Hosts {
	#utilities = null;
	#options = null;

	constructor(options) {
		this.#utilities = new Utilities;
		this.#options = options;
		return this;
	}

	async getHostGroups() {
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

	async getHosts() {
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

module.exports = Hosts;
