export interface IProps{
    id: number
    name: string
}

export type JobType = {
    id: number
    name: string
    avg_wage: number
    status: number
}

export type StatusType = {
    id: number
    name: string
    importance: number
}

export type CitizenType = {
    id: number
    first_name: string
    last_name: string
    name: string
    years: number
    status: number
    status_detail: StatusType
    job: number
    job_detail: JobType
    obey: number
    wage: number
    subordinates: number[]
    children: CitizenType[]
}