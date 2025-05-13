import BaseService from "@/services/BaseService";

export default class Classifica extends BaseService {
    static async getClassificaHome(idUtente : number): Promise<any> {
        return await this.perform({
            url: '/classifica/home/'+ idUtente,
            method: 'GET'
        })
    }

    static async getClassificaParziale(idUtente : number): Promise<any> {
        return await this.perform({
            url: '/classifica/'+ idUtente,
            method: 'GET'
        })
    }
}
