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
    static async listaUtenti(competizione: number): Promise<any> {
        return await this.perform({
            url: '/utenti/competizione/' + competizione,
            method: 'GET'
        })
    }

    static async modificaUtente(id : number, value: boolean): Promise<any> {
        return await this.perform({
            url: '/utenti/edit',
            method: 'PATCH',
            body: {
                id: id,
                value: value
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
