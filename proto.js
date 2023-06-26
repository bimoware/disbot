const dayjs = require('dayjs')
console.logg = function (...args) {
    console.log(`${dayjs().format("DD/M HH:mm")}|${args[0]} | ${args.slice(1).join('')}`)
}

module.exports = {
    chunk: function (elem, n) {
        let arr = [];
        for (let i = 0; i < elem.length; i += n)
            arr.push(elem.slice(i, i + n));
        return arr;
    }
}