import BaseService from "@/services/BaseService";

export default class Competizioni extends BaseService {

    static async getListaCompetizioniAperte(utente: number): Promise<any> {
        return await this.perform({
            url: '/competizioni/aperte/'+ utente,
            method: 'GET',
        })
    }
    static async getCompetizioniAdmin(): Promise<any> {
        return await this.perform({
            url: '/competizioni',
            method: 'GET',
        })
    }
    static async getCompetizioniUtente(utente : number): Promise<any> {
        return await this.perform({
            url: '/competizioni/utente/'+ utente,
            method: 'GET',
        })
    }

    static async aggiungiCompetizione(competizione: number, utente : number): Promise<any> {
        return await this.perform({
            url: '/competizioni/'+ competizione + '/utente/'+ utente,
            method: 'POST',
        })
    }
}
