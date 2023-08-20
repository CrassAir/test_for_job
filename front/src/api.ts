import axios, {AxiosError} from 'axios'
import dayjs from "dayjs";

const actualUrl = {
    'test': {hostname: 'localhost', port: '8888', protocol: 'http:', ws: 'ws:'},
    'main': {
        hostname: window.location.hostname,
        port: window.location.port,
        protocol: window.location.protocol,
        ws: 'wss:'
    },
}

// const server = window.location.port === '3000' ? 'test' : 'main'
const server = 'test'

export function getHostname(use_ws = false) {
    const {ws, hostname, port, protocol} = actualUrl[server]
    if (use_ws) return `${ws}//${hostname}${port ? ':' + port : ''}`
    return `${protocol}//${hostname}${port ? ':' + port : ''}`
}

export const apiUrl = `${getHostname()}/api/`
export const restAuthUrl = `${getHostname()}/rest-auth/`
export const wsUrl = getHostname(true)


const api = axios.create({
    baseURL: apiUrl,
    responseType: "json",
});
// api.interceptors.request.use((config) => {
//     config.headers["X-CSRFToken"] = new Cookies().get("csrftoken");
//     // console.log("api.interceptors.request: ", config.headers);
//     return config;
// });

export interface IApiError {
    code: number
    message: string
}

export const apiError = (e: Error | AxiosError) => {
    if (axios.isAxiosError(e)) {
        let data = e.response?.data
        if (typeof data === 'string' && data.length < 100) return {code: e.response?.status, message: data}
        return {code: e.response?.status, message: e.message.toString()}
    }
    return {code: 0, message: e?.message}
}

export const downloadReport = (range?: any) => {
    return api.post(`${apiUrl}task/download_tasks/`, range, {responseType: 'blob'})
        .then(res => {
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Report-${dayjs().format('DD-MM-YYYY')}.xlsx`);
            document.body.appendChild(link);
            link.click();
        })
}

export const sendWebPushRegistrationData = async (data?: any) => {
    try {
        return await api.post(`${getHostname()}/push/device/webpush/`, data).then(resp => {
            // return api.post(`${getHostname()}/api/taskers/test_save_info`, data).then(resp => {
            return resp.status === 201
        })
    } catch (e) {
        return false
    }

}

export default api