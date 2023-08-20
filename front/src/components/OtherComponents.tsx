import React, {cloneElement, useEffect, useState} from "react";
import {TransitionProps} from "@mui/material/transitions";
import {
    Box, Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle, Drawer,
    IconButton, ImageListItem, ImageListItemBar,
    Slide,
    Stack,
    Typography,
    useMediaQuery
} from "@mui/material";
import {useLocation, useNavigate, useParams, useSearchParams} from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import CancelIcon from "@mui/icons-material/Cancel";

export const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />
})

type MainDialogProps = {
    open_key: string
    children: React.ReactElement
    [rest: string]: any
}

export function MainDialog(props: MainDialogProps) {
    const {open_key, children, prevLoc, ...rest} = props
    const matches = useMediaQuery((theme: any) => theme.breakpoints.down('md'))
    const navigate = useNavigate()
    let location = useLocation()

    function handleClose() {
        if (location.key === 'default') {
            const locArr = location.pathname.split('/')
            navigate(locArr.slice(0, locArr.length - 2).join('/'))
        } else if (location.state?.from) {
            navigate(location.state.from)
        } else {
            navigate(-1)
        }
    }

    return (
        <Dialog
            fullScreen={matches}
            open={location.pathname.split('/').includes(open_key)}
            fullWidth
            maxWidth={rest.maxWidth || 'xs'}
            onClose={handleClose}
            TransitionComponent={Transition}
        >
            <DialogTitle sx={{pb: 1}}>
                <Box sx={{float: 'right'}}>
                    <Button onClick={handleClose} variant={'text'} sx={{fontWeight: 700}}
                            startIcon={<ArrowBackIosNewIcon sx={{fontSize: 20}}/>}>Назад</Button>
                </Box>
            </DialogTitle>
            <DialogContent>
                {cloneElement(children, {handleClose})}
            </DialogContent>
        </Dialog>
    )
}

type MainDrawerProps = {
    title: string
    open_key: string
    children: React.ReactElement
    width_md?: number
}

export function MainDrawer(props: MainDrawerProps) {
    const {title, open_key, children, width_md} = props
    const navigate = useNavigate()
    let location = useLocation()

    function handleClose() {
        if (location.key === 'default') navigate('/')
        else {
            navigate(-1)
        }
    }

    return (
        <Drawer
            anchor={'right'}
            open={location.pathname.includes(open_key)}
            onClose={handleClose}
            PaperProps={{
                sx: {width: {xs: '100%', md: width_md || 800}}
            }}
        >
            <DialogTitle sx={{pb: 1}}>
                <Box sx={{width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Typography variant={'h6'}>{title}</Typography>
                    <Button onClick={handleClose} variant={'text'} sx={{fontWeight: 700}}
                            startIcon={<ArrowBackIosNewIcon sx={{fontSize: 20}}/>}>Назад</Button>
                </Box>
            </DialogTitle>
            <DialogContent>
                {children}
            </DialogContent>
        </Drawer>
    )
}

type InfoTitleProps = {
    subtitle: string
    title?: string
}

export function InfoTitle({subtitle, title}: InfoTitleProps) {
    return (
        <Stack direction={{xs: 'column', md: 'row'}} sx={{zIndex: 1}} spacing={1} alignItems={'start'}>
            <Typography variant={'subtitle1'}>{subtitle}:</Typography>
            <Typography sx={{lineHeight: 1.75}}>{title ?? 'Не указано'}</Typography>
        </Stack>
    )
}


type FileDetailProps = {
    file: File
    index: number
    deleteFiles(index: number): void
}

export function FileDetail(props: FileDetailProps) {
    const {file, index, deleteFiles} = props
    const [src, setSrc] = useState('')

    useEffect(() => {
        const reader = new FileReader();
        if (reader) reader.onload = (e) => setSrc(e.target?.result?.toString() || '')
        reader.readAsDataURL(file)
    }, [file])


    return <ImageListItem key={src}>
        <img src={src} alt={file.name}/>
        <ImageListItemBar
            position={'top'}
            title={<Typography fontSize={'small'}>{file.name}</Typography>}
            actionIcon={
                <IconButton color={'error'} onClick={() => deleteFiles(index)}>
                    <CancelIcon/>
                </IconButton>
            }
        /></ImageListItem>
}
