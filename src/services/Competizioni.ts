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

    static async creaCompetizione(competizione: {
        nome: string,
        anno: number,
        citta?: string | null,
        paeseOspitante?: string | null,
        closed?: boolean,
        abilitaTotale?: boolean
    }): Promise<any> {
        return await this.perform({
            url: '/competizioni',
            method: 'POST',
            body: competizione
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
