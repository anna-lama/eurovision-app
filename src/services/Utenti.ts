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

    static async listaTuttiUtenti(): Promise<any> {
        return await this.perform({
            url: '/utenti/lista',
            method: 'GET'
        })
    }

    static async promuoviAdmin(id: number): Promise<any> {
        return await this.perform({
            url: '/utenti/admin/' + id,
            method: 'POST'
        })
    }

    static async modificaEsclusioneTotale(competizione: number, utente: number, esclusoTotale: boolean): Promise<any> {
        return await this.perform({
            url: '/utenti/competizione/' + competizione + '/' + utente + '/escluso',
            method: 'PUT',
            body: {
                esclusoTotale
            }
        })
    }

    static async modificaPassword(id : number, pin: string): Promise<any> {
        return await this.perform({
            url: '/utenti/password',
            method: 'PATCH',
            body: {
                id: id,
                pin: pin
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
