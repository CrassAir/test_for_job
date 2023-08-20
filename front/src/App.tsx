import React, {useEffect, ReactElement, useMemo} from 'react';
import './App.scss';
import {Navigate, Route, Routes, useLocation} from "react-router-dom";
import {checkToken, logout} from "./store/actions/auth";
import {useAppDispatch, useAppSelector} from "./hooks";
import {
    Box, CircularProgress,
    createTheme,
    ThemeProvider
} from '@mui/material';
import {useSnackbar} from "notistack";
import {grey} from "@mui/material/colors";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ru'
import utc from 'dayjs/plugin/utc';
import CitizensPage from './components/Citizens/CitizensPage';
import AboutPage from "./components/AboutPage";
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import InfoIcon from '@mui/icons-material/Info';

dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.locale('ru')


let theme = createTheme({
    typography: {
        fontFamily: 'Arial',
        subtitle1: {
            color: grey[500]
        },
    },
    palette: {
        // mode: 'dark',
        background: {
            // default: '#d7edf1',
            paper: '#f5f8f8'
        },
        primary: {
            main: '#2c6e6a',
        },
        secondary: {
            main: '#2da3c2'
        },
    },
    components: {
        MuiListItem: {
            styleOverrides: {
                root: {
                    transition: '500ms',
                    '&.Mui-selected': {
                        backgroundColor: 'rgba(44,109,106, 0.5)',

                        'svg, span': {
                            color: '#f5f8f8'
                        }
                    }
                }
            }
        }
    }
})


export interface INavItem {
    name: string
    icon: ReactElement
    start_path: string
    path: string
    validate?: boolean
    component: ReactElement
    children?: INavItem[]
}

export var defaultNavList: INavItem[] = [
    {
        name: 'О себе',
        icon: <InfoIcon/>,
        start_path: 'about',
        path: '',
        validate: false,
        component: <AboutPage/>,
        children: [
            {
                name: '',
                icon: <div/>,
                start_path: 'login',
                path: '',
                component: <div/>,
            }
        ]
    }, {
        name: 'Какой то город',
        icon: <AccountTreeIcon/>,
        start_path: 'citizens',
        path: '/:id?/create_group?',
        validate: true,
        component: <CitizensPage/>,
        children: [
            {
                name: '',
                icon: <div/>,
                start_path: 'citizen',
                path: '/create?/edit?',
                component: <div/>,
            }
        ]
    }
]

const App: React.FC = () => {
    const location = useLocation()
    const dispatch = useAppDispatch()
    const {enqueueSnackbar} = useSnackbar()
    const {authState, isAuth, navList, error} = useAppSelector(state => state.authReducer)

    useEffect(() => {
        if (error?.message && error?.code !== 401) {
            enqueueSnackbar(error.message, {variant: 'error'})
        }
    }, [error])

    useEffect(() => {
        dispatch(checkToken())
    }, [])

    function recursiveBuildNav(navItem: INavItem) {
        if (navItem.children && navItem.children.length > 0) {
            const childs = navItem.children?.map(nav => recursiveBuildNav(nav))
            return <Route key={navItem.name} path={navItem.start_path + navItem.path} element={navItem.component}>
                {childs}
            </Route>
        }
        return <Route key={navItem.name} path={navItem.start_path + navItem.path} element={navItem.component}/>
    }

    const navigationList = useMemo(() => {
        let nav = '/'
        const newList = navList.map((navItem, index) => {
            if (index === 0 && navItem.path !== '/') nav = navItem.start_path
            return recursiveBuildNav(navItem)
        })
        if (nav !== '/') newList.push(<Route key={'redirect'} path="/" element={<Navigate to={nav}/>}/>)
        return newList
    }, [navList])


    const routes = () => {
        if (authState) {
            return (
                <Box className={'login-container'}>
                    <CircularProgress/>
                </Box>
            )
        }
        if (location.pathname.includes('logout')) {
            dispatch(logout())
        }
        return (
            <Routes>
                <Route path="logout" element={<Navigate replace to={'/'}/>}/>
                <Route path="/" element={<HomePage/>}>
                    <Route path="login" element={<Navigate replace to={'/login'}/>}/>
                    {navigationList}
                </Route>
            </Routes>
        )
    }

    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                {routes()}
            </div>
        </ThemeProvider>
    )
}

export default App;
