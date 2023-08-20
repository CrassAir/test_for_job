export interface IAuth {
    username: string
    password: string
    source: string
}

export interface IAccessModel {
    id: number
    name: string
    name_plural: string
}

export interface IRole {
    id: number
    name: string
    edit: IAccessModel[]
    read: IAccessModel[]
}

type ProfileType = {
    all_dep_visor: boolean
    card?: number
    code?: string
    deletion_mark: boolean
    department: number
    fault_log_operator: boolean
    id: number
    individual: number
    is_supervisor_department: boolean
    job_title?: string
    main_back_username: string
    main_token?: string
    phone_number: string
    ref_id: string
    send_mobile_push: boolean
    send_to_email: boolean
    send_to_telegram: boolean
    send_to_web_push: boolean
    telegram_user_id: string
    third_name: string
    user: number
    web_push_token?: string
}

export interface IAccount {
    id: number
    username: string
    first_name: string
    last_name: string
    profile: ProfileType
    is_superuser: boolean

}

export interface IAuthResponse {
    key: string
    user: IAccount
}