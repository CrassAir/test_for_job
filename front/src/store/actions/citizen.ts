import {createAsyncThunk} from "@reduxjs/toolkit"
import {AxiosError} from "axios"
import api, {apiError, apiUrl} from "../../api"
import {CitizenType, IProps, JobType, StatusType} from "../../models/ICitizen";


export const getCitizens = createAsyncThunk(
    'getCitizens',
    async (_, thunkAPI) => {
        try {
            const {data} = await api.get<CitizenType[]>(apiUrl + `citizens/citizens/`)
            return data
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e as Error | AxiosError))
        }
    }
)

export const getCitizen = createAsyncThunk(
    'getCitizen',
    async (id: number, thunkAPI) => {
        try {
            const {data} = await api.get<CitizenType>(apiUrl + `citizens/citizens/${id}/`)
            return data
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e as Error | AxiosError))
        }
    }
)

export const getCitizensByStatus = createAsyncThunk(
    'getCitizensByStatus',
    async (query: any, thunkAPI) => {
        try {
            const {data} = await api.get<IProps[]>(apiUrl + `citizens/citizens/`, {params: query})
            return data
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e as Error | AxiosError))
        }
    }
)


export const getStatus = createAsyncThunk(
    'getStatus',
    async (_, thunkAPI) => {
        try {
            const {data} = await api.get<StatusType[]>(apiUrl + `citizens/status/`)
            return data
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e as Error | AxiosError))
        }
    }
)

export const getJobs = createAsyncThunk(
    'getJobs',
    async (query: any, thunkAPI) => {
        try {
            const {data} = await api.get<JobType[]>(apiUrl + `citizens/job/`, {params: query})
            return data
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e as Error | AxiosError))
        }
    }
)

export const createRandomCitizens = createAsyncThunk(
    'createRandomCitizens',
    async (post: any, thunkAPI) => {
        try {
            await api.post(apiUrl + `citizens/citizens/create_seeds/`, post)
            thunkAPI.dispatch(getCitizens())
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e as Error | AxiosError))
        }
    }
)

export const createCitizen = createAsyncThunk(
    'createCitizen',
    async (post: any, thunkAPI) => {
        try {
            await api.post(apiUrl + `citizens/citizens/`, post)
            thunkAPI.dispatch(getCitizens())
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e as Error | AxiosError))
        }
    }
)

export const updateCitizen = createAsyncThunk(
    'updateCitizen',
    async (post: any, thunkAPI) => {
        try {
            const {data} = await api.put(apiUrl + `citizens/citizens/${post.id}/`, post)
            thunkAPI.dispatch(getCitizens())
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e as Error | AxiosError))
        }
    }
)

export const deleteCitizen = createAsyncThunk(
    'deleteCitizen',
    async (id: number, thunkAPI) => {
        try {
            await api.delete(apiUrl + `citizens/citizens/${id}/`)
            thunkAPI.dispatch(getCitizens())
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e as Error | AxiosError))
        }
    }
)
