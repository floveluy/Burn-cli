const Controller = require('burnjs').Controller;

class Index extends Controller {
    async index() {
        this.ctx.body = `<h1>hello burn.js</h1>
        <ul>
        <li>service check: ${ await this.ctx.service.svs.sum()}</li>
        <li>config default: ${ this.app.config.hardcode}</li>
        <li>config dev: ${ this.app.config.dev}</li>
        </ul>
        `;
        this.ctx.set('Content-Type', 'text/html;charset="utf-8"');
    }
}

module.exports = Index;