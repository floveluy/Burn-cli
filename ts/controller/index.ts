import { Controller, Blueprint } from 'burnjs';



export default class Index extends Controller {
    @Blueprint.get('/')
    async first() {
        this.ctx.service.svs.index()
    }

    @Blueprint.post('/post')
    async second() {
        this.ctx.service.svs.index()
    }

    @Blueprint.put('/put')
    async third() {
        this.ctx.service.svs.index()
    }
    @Blueprint.del('/del')
    async forth() {
        this.ctx.service.svs.index()
    }
}


