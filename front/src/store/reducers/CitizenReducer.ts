import {createSlice} from "@reduxjs/toolkit"
import {CitizenType, IProps, JobType, StatusType} from "../../models/ICitizen"
import {
    deleteCitizen,
    getCitizen,
    getCitizens,
    getCitizensByStatus,
    getJobs,
    getStatus,
    updateCitizen
} from "../actions/citizen"
import {deleteElementFromList, recursiveTree, updateElementInList} from "../../utils";

interface ICitizenState {
    citizen: CitizenType | null
    citizens: CitizenType[]
    citizensByStatus: IProps[]
    status: StatusType[]
    jobs: JobType[]
}

const initialState: ICitizenState = {
    citizen: null,
    citizens: [],
    citizensByStatus: [],
    status: [],
    jobs: []
}

export const citizenSlice = createSlice({
    name: 'citizen',
    initialState,
    reducers: {
        setCitizen: (state, {payload}) => {
            state.citizen = payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getCitizens.fulfilled, (state, {payload}) => {
            state.citizens = recursiveTree(payload)
        })
        builder.addCase(getCitizen.fulfilled, (state, {payload}) => {
            state.citizen = payload
        })
        builder.addCase(getCitizensByStatus.fulfilled, (state, {payload}) => {
            state.citizensByStatus = payload
        })
        builder.addCase(getStatus.fulfilled, (state, {payload}) => {
            state.status = payload
        })
        builder.addCase(getJobs.fulfilled, (state, {payload}) => {
            state.jobs = payload
        })
    }
})

export const {setCitizen} = citizenSlice.actions
export default citizenSlice.reducer