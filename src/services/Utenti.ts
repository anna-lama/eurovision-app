import BaseService from "@/services/BaseService";

export default class Utenti extends BaseService {
    static async aggiungiUtente(username : string, password: string): Promise<any> {
        return await this.perform({
            url: '/utenti/add',
            method: 'POST',
            body: {
                nome: username,
                pin: password
            }
        })
    }
    static async login(username : string, password: string): Promise<any> {
        return await this.perform({
            url: '/utenti/login',
            method: 'POST',
            body: {
                nome: username,
                pin: password
            }
        })
    }

}
