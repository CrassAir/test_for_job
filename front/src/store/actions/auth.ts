import axios, {AxiosError} from "axios";
import {IAuth, IAuthResponse} from "../../models/IAuth";
import {apiUrl, restAuthUrl} from "../../api";
import {createAsyncThunk} from "@reduxjs/toolkit";
import api, {apiError} from "../../api";

let interceptor = 0;


export const login = createAsyncThunk(
    'login',
    async (post: IAuth, thunkAPI) => {
        try {
            const {data} = await axios.post<IAuthResponse>(restAuthUrl + 'login/', post,)
            localStorage.setItem('token', data.key)
            interceptor = api.interceptors.request.use((config: any) => {
                config.headers["Authorization"] = `Token ${data.key}`;
                return config
            })
            return {token: data.key, interceptor: interceptor}
        } catch (e) {
            return thunkAPI.rejectWithValue({code: 0, message: 'Неверный логин или пароль'})
        }
    }
)

export const logout = createAsyncThunk(
    'logout',
    async (_, thunkAPI) => {
        localStorage.removeItem('token');
        let reg = await navigator.serviceWorker.getRegistration(process.env.PUBLIC_URL + '/static/sw.js')
        if (reg?.active?.state === 'activated') {
            reg.pushManager.getSubscription().then(val => val?.unsubscribe())
        }
        try {
            await api.post(restAuthUrl + "logout/", {})
            api.interceptors.request.eject(interceptor)
            return {}
        } catch (e) {
            api.interceptors.request.eject(interceptor)
            return thunkAPI.rejectWithValue(apiError(e as Error | AxiosError))
        }
    }
)

export const checkToken = createAsyncThunk(
    'checkToken',
    async (_, thunkAPI) => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                interceptor = api.interceptors.request.use((config: any) => {
                    config.headers["Authorization"] = `Token ${token}`;
                    return config
                })
                await api.post<IAuthResponse>(apiUrl + 'citizens/check_authorization/')
                return {token: token, interceptor: interceptor}
            } catch (e) {
                thunkAPI.dispatch(logout());
                return thunkAPI.rejectWithValue(apiError(e as Error | AxiosError))
            }
        } else if (token === undefined) {
            thunkAPI.dispatch(logout());
        } else {
            return thunkAPI.rejectWithValue({code: 0, message: null})
        }
    }
)