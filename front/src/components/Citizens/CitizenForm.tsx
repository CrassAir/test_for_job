import {Button, LinearProgress, Stack} from '@mui/material';
import React, {useEffect} from 'react';
import {useForm} from "react-hook-form";
import {FormAutocomplete, FormSelect, FormTextField} from "../FormComponents";
import {useLocation, useParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {
    createCitizen, createRandomCitizens,
    getCitizen,
    getCitizensByStatus,
    getJobs,
    getStatus,
    updateCitizen
} from "../../store/actions/citizen";
import {setCitizen} from "../../store/reducers/CitizenReducer";

type CitizenFormProps = {
    handleClose?(): void
}

export default function CitizenForm({handleClose}: CitizenFormProps) {
    const {control, handleSubmit, watch, reset, resetField} = useForm()
    const dispatch = useAppDispatch()
    const {status, jobs, citizensByStatus, citizen} = useAppSelector(state => state.citizenReducer)
    const {id} = useParams()
    const location = useLocation()

    useEffect(() => {
        dispatch(getStatus())
        if (!id) {
            dispatch(getJobs({}))
        }
        return () => {
            dispatch(setCitizen(null))
        }
    }, []);

    useEffect(() => {
        if (id) {
            dispatch(getCitizen(Number(id)))
            dispatch(getJobs({}))

        }
    }, [id])

    useEffect(() => {
        if (citizen) {
            dispatch(getCitizensByStatus({status: citizen.status_detail.importance + 1})).then(() => reset(citizen))
        }
    }, [citizen]);

    useEffect(() => {
        if (status.length > 0 && !id) {
            dispatch(getJobs({status: status[0].id}))
            dispatch(getCitizensByStatus({status: status[0].id}))
        }
    }, [status]);

    React.useEffect(() => {
        const subscription = watch((value, {name, type}) => {
            if (name === 'status' && type === 'change') {
                dispatch(getJobs({status: value.status}))
                const stat = status.find(v => v.id === value.status)
                dispatch(getCitizensByStatus({status: stat!.importance + 1}))
                reset({...value, obey: undefined, job: undefined})
            }
            if (name === 'job' && type === 'change') {
                const job = jobs.find(v => v.id === value.job)
                reset({
                    ...value,
                    wage: Math.round(job!.avg_wage * (Math.random() * (1.1 - 0.9) + 0.9)),
                })
            }
        });
        return () => subscription.unsubscribe();
    }, [watch, status, jobs]);

    function onSubmit(values: any) {
        if (location.pathname.split('/').includes('edit')) {
            dispatch(updateCitizen(values)).then(v => {
                if (v.meta.requestStatus === 'fulfilled') handleClose!()
            })
        } else {
            dispatch(createCitizen(values)).then(v => {
                if (v.meta.requestStatus === 'fulfilled') handleClose!()
            })
        }
    }


    if (status.length === 0 || jobs.length === 0 || (id && !citizen)) return <LinearProgress/>

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={1} sx={{mt: 1}}>
                <FormTextField fieldName={'first_name'} label={'Имя'} control={control} required/>
                <FormTextField fieldName={'last_name'} label={'Фамилия'} control={control} required/>
                <FormTextField fieldName={'years'} label={'Возраст'} control={control}/>
                <FormSelect fieldName={'status'} label={'Статус'} control={control} searchList={status} required/>
                <FormAutocomplete fieldName={'job'} label={'Работа'} control={control} searchList={jobs}
                                  disabled={citizensByStatus.length === 0} required/>
                <FormAutocomplete fieldName={'obey'} label={'Подчиняется'} control={control}
                                  disabled={citizensByStatus.length === 0}
                                  searchList={citizensByStatus} freeSolo/>
                <FormTextField fieldName={'wage'} label={'Зарплата'} control={control} number/>
                <Button type={'submit'} variant={'contained'}>Отправить</Button>
            </Stack>
        </form>
    )
}


type CitizenGroupFormProps = {
    handleClose?(): void
}

export function CitizenGroupForm({handleClose}: CitizenGroupFormProps) {
    const {control, handleSubmit} = useForm()
    const dispatch = useAppDispatch()

    function onSubmit(values: any) {
        dispatch(createRandomCitizens(values))
        handleClose!()
    }

    return <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={1} sx={{mt: 1}}>
            <FormTextField fieldName={'create'} label={'Сколько создать?'} control={control} number/>
            <Button type={'submit'} variant={'contained'}>Отправить</Button>
        </Stack>
    </form>
}
 