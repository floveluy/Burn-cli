const Service = require('burnjs').Service;
module.exports = class svs extends Service {
    async sum() {
        return 5 + 10
    }
}