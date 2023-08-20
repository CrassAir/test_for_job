import React, {useEffect, useState} from 'react';
import {Box, IconButton, InputAdornment, Paper, Stack, TextField, Typography} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../hooks";
import {login} from "../store/actions/auth";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {LoadingButton} from "@mui/lab";
import {useForm, Controller} from "react-hook-form";
import {useNavigate} from "react-router-dom";

type LoginPageProps = {}

export default function LoginPage() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const {control, handleSubmit} = useForm()
    const {token, isLoading} = useAppSelector(state => state.authReducer)
    const [showPassword, setShowPassword] = useState(false)

    useEffect(() => {
        if (token) navigate('/', {replace: true})
    }, [token])

    function onSubmit(value: any) {
        dispatch(login(value))
        setShowPassword(false)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2} sx={{padding: 1}}>
                <Typography variant={'h5'} sx={{textAlign: 'center', fontWeight: 'bold'}}>Тестовое задание</Typography>
                <Controller
                    name={'username'}
                    control={control}
                    defaultValue={''}
                    render={({field}) => (
                        <TextField {...field} label="Логин" fullWidth/>
                    )}
                />
                <Controller
                    name={'password'}
                    control={control}
                    defaultValue={''}
                    render={({field}) => (
                        <TextField {...field} label="Пароль" type={showPassword ? 'text' : 'password'} fullWidth
                                   InputProps={{ // <-- This is where the toggle button is added.
                                       endAdornment: (
                                           <InputAdornment position="end">
                                               <IconButton
                                                   aria-label="toggle password visibility"
                                                   onClick={() => setShowPassword(val => !val)}
                                               >
                                                   {showPassword ? <VisibilityOffIcon/> : <VisibilityIcon/>}
                                               </IconButton>
                                           </InputAdornment>
                                       )
                                   }}/>
                    )}
                />
                <Box>
                    <Stack sx={{float: 'right'}} direction={'row'} spacing={2}>
                        <LoadingButton loading={isLoading} sx={{float: 'right'}} size={'large'} type={'submit'}
                                       variant={'contained'}>
                            Войти
                        </LoadingButton>
                    </Stack>
                </Box>
            </Stack>
        </form>
    )
}
