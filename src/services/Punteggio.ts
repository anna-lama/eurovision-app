import BaseService from "@/services/BaseService";

export default class Punteggio extends BaseService {
    static async aggiungiPunteggio(body : any): Promise<any> {
        return await this.perform({
            url: '/punteggio/add',
            method: 'POST',
            body: body
        })
    }
}
