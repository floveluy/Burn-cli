import { Service } from "burnjs";

export default class svs extends Service {
    index() {
        return 'this is service'
    }

}

declare module 'burnjs' {
    export interface FService {
        svs: svs
    }
}