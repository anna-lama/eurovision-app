
import axios from 'axios'

type HttpRequest = {
    url: string,
    method?: 'get' | 'post' | 'put' | 'delete' | 'patch' | 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    auth?: boolean,
    body?: any,
    params?: any,
    token?: string
};
export type APIResponse = {
    error: boolean,
    code: number,
    msg: string,
    data: any
};
const baseUrl = "https://evb.sceltaintelligente.it"
class BaseService {
    static async perform(request: HttpRequest):Promise<APIResponse> {
        try {
            const config = {
                url: `${baseUrl}${request.url}`,
                method: request.method,
                headers: {
                    'Cache-Control': 'no-cache',
                    "authorization": sessionStorage.getItem('token')
                },
                data: request.body,
                params: request.params
            };
            return (await axios(config)).data

        } catch (error:any) {
            if (error.response.status === 401) {
                // if (error.response.data.code === 'ERR_CHECK_AUTH_2') {
                setTimeout(() => {
                    sessionStorage.removeItem("user");
                    window.location.href = "/login";
                }, 1200);
            }
            return error.response.data
        }
    }
}

// Esportiamo la classe "BaseService" in modo che possa essere utilizzata altrove
export default BaseService;
