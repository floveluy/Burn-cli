import { Controller } from 'burnjs';

export default class user extends Controller {

    async index() {
        this.ctx.service.svs.index()
    }
}


