const Controller = require('burnjs').Controller;

class Index extends Controller {
    async index() {
        this.ctx.body = 'hello burn.js';
    }
}

module.exports = Index;