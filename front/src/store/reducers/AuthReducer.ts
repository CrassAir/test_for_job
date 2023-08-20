import {AnyAction, createSlice, isFulfilled, isPending, isRejected} from "@reduxjs/toolkit";
import {checkToken, login, logout} from "../actions/auth";
import api, {IApiError} from "../../api";
import {INavItem, defaultNavList} from "../../App";
import {checkNavValidate} from "../../utils";


interface IAuthState {
    token: string | null
    navList: INavItem[]
    isLoading: boolean
    error: IApiError | null
    interceptor: number
    isAuth: boolean
    authState: boolean
}

const initialState: IAuthState = {
    token: null,
    navList: checkNavValidate(defaultNavList, false),
    isLoading: false,
    error: null,
    interceptor: 0,
    isAuth: false,
    authState: true
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(login.fulfilled, (state, {payload}) => {
            state.token = payload.token
            state.navList = checkNavValidate(defaultNavList, true)
            state.interceptor = payload.interceptor
            state.isLoading = false
            state.error = null
            state.isAuth = true
            state.authState = false
        })
        builder.addCase(checkToken.pending, (state) => {
            state.authState = true
        })
        builder.addCase(checkToken.fulfilled, (state, {payload}) => {
            state.token = payload?.token || null
            state.navList = checkNavValidate(defaultNavList, true)
            state.interceptor = payload?.interceptor || 0
            state.isLoading = false
            state.error = null
            state.isAuth = true
            state.authState = false
        })
        builder.addCase(logout.fulfilled, (state) => {
            state.token = null
            state.isLoading = false
            state.navList = checkNavValidate(defaultNavList, false)
            state.error = null
            state.isAuth = false
            state.authState = false
        })

        builder.addMatcher(isFulfilled, (state) => {
            state.isLoading = false
            state.error = null
        })
        builder.addMatcher(isPending, (state) => {
            state.isLoading = true
        })
        builder.addMatcher(isRejected, (state, action: AnyAction) => {
            if (action.payload?.code === 401) {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                api.interceptors.request.eject(state.interceptor)
                state.token = null
                state.isAuth = false
            }
            state.isLoading = false
            state.authState = false
            state.error = action.payload
        })
    }
})

export default authSlice.reducer