import BaseService from "@/services/BaseService";

export default class Classifica extends BaseService {
    static async getClassificaHome(idUtente : number, competizione: number): Promise<any> {
        return await this.perform({
            url: '/classifica/competizione/'+ competizione + '/home/' + idUtente,
            method: 'GET'
        })
    }

    static async getClassificaParziale(idUtente : number, competizione: number): Promise<any> {
        return await this.perform({
            url: '/classifica/competizione/'+ competizione + '/personale/' + idUtente,
            method: 'GET'
        })
    }
    static async getClassificaTotale(competizione: number): Promise<any> {
        return await this.perform({
            url: '/classifica/competizione/'+ competizione + '/totale',
            method: 'GET'
        })
    }
    static async abilitaTotale(competizione: number, total: boolean): Promise<any> {
        return await this.perform({
            url: '/competizioni/'+ competizione + '/totale',
            method: 'PATCH',
            body:{
                abilitaTotale : total
            }
        })
    }
}
