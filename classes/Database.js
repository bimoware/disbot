const { JsonDB, Config } = require("node-json-db");
module.exports = class Database extends JsonDB {
    constructor(dbFile) {
        super(new Config(dbFile, true, true, '.', true));
        this.sep = ".";
        this.currencyTypes = new Map()
            .set('BUMP', 1)
            .set('AIDE', 2)
    }
    async get(path) {
        return await this.getData(this.sep + path)
    }
    async has(path) {
        return Boolean(await this.exists(path));
    }
    async set(path, data) {
        return await this.push(this.sep + path, data, true)
    }
    async merge(path, data) {
        return await this.push(this.sep + path, data, true)
    }
    /** Filtre tous les elements et ne laisse que ceux qui répondent oui a la condition */
    async filterAndRemove(path, condition) {
        let data = await this.get(path)
        if (!Array.isArray(data)) return Promise.reject(`.filterAndRemove('${path}') - data is not an array but ${data}`)
        data = data.filter(condition);
        await this.set(path, data);
        return data;
    }
    async findAndRemove(path, condition) {
        let data = await this.get(path)
        if (!Array.isArray(data)) return Promise.reject(`.findAndRemove('${path}') - data is not an array but ${data}`)
        let i = data.findIndex(condition)
        data.splice(i, 1);
        await this.set(path, data);
        return data;
    }
    async getNumberOfBerries(userId, type, berries = null) {
        berries = berries || await this.getBerries(userId);
        if (type) {
            type = Number(type);
            berries = berries.filter(b => [type, this.currencyTypes.get(type)].some(k => k === b[0]))
        }
        if (!berries.length) return 0;
        return berries.length;
    }
    /**
     * @param {string} userId 
     * @returns {Promise<Array[]>}
     */
    async getBerries(userId) {
        let data = await this.get(`currency${this.sep}`)
        return data[userId] ?? [];
    }
    async setBerries(userId, data) {
        return await this.set(`currency${this.sep}${userId}`, data || []);
    }
    async getLeaderboard(type) {
        let data = await this.get(`currency${this.sep}`)
        // { "id" : [ [type, quand], [type, quand], ... ], "id" : [ [type, quand], ... ] }
        let leaderboard = [];
        let excluded = await this.get('excluded')
        for (let id of Object.keys(data)) {
            if (excluded.includes(id)) continue;
            let berries = await this.getNumberOfBerries(id, type, data[id]);
            if (!berries) continue;
            leaderboard.push([id, berries]);
        }
        return leaderboard.sort((a, b) => b[1] - a[1]);
        // [ [id, berries], [id, berries], [id,berries] ]
    }
    /**
     * @param {string} userId 
     * @param {number} type 
     */
    async addBerries(userId, type, extra) {
        let data = await this.get(`currency${this.sep}`) || {};
        if (!data[userId]) await this.setBerries(userId);
        let pushed = [this.currencyTypes.get(type) || type, Date.now()]
        if(extra) pushed.push(extra);
        console.log(pushed)
        data[userId].push(pushed)
        return await this.set(`currency${this.sep}`, data);
    }
    async resetBerries(userId) {
        if (!userId) return await this.set(`currency${this.sep}`, {})
        let data = await this.get(`currency`)
        delete data[userId]
        await this.set("currency", data)
    }
    async resetVoice() {
        await this.set("voice", {})
    }
    async addHistory({ userId, threadId, changes }) {
        return;
        let data = await this.get(`changes`)
        let arr = [ Date.now(), userId, changes ];
        if (!data[threadId]) data[threadId] = [];
        data[threadId].push(arr);
        return await this.set(`changes.${threadId}`,data[threadId]);
    }
    async getHistory(threadId){
        return;
        return this.get(`changes.${threadId}`).catch(() => null);
    }
    async isNewWikier(userId){
        let data = await this.get(`changes`)
        for(let datas of Object.values(data)){
            if(datas[1] === userId) return true;
        }
        return false;
    }
}