import React from 'react';
import Grid from "@mui/material/Unstable_Grid2";
import {CardMedia, Divider, Link, Paper, Stack, Typography} from "@mui/material";
import i from '../assets/i.jpeg'
import {InfoTitle} from "./OtherComponents";

type AboutPageProps = {}

export default function AboutPage(props: AboutPageProps) {
    return <Grid container spacing={1} sx={{mt: {xs: 8, md: 12}}} className={'about_grid_anim'}>
        <Grid xs={12} md={4} mdOffset={2}>
            <Paper sx={{p: 1, height: {xs: 'auto', md: 207}, zIndex: 3, position: 'relative'}}>
                <Typography variant={'h5'}>Тирских Никита</Typography>
                <Typography> Мужчина, 31 год, родился 29 апреля 1992</Typography>
                <Divider variant={'middle'} sx={{mt: 1, md: 1}}/>
                <Typography variant={'subtitle1'}>Контакты</Typography>
                <Stack spacing={1} direction={{xs: 'column', md: 'row'}}>
                    <Typography variant={'subtitle1'}>tel:</Typography>
                    <Link sx={{lineHeight: 1.75}} href={'tel:+7 (916) 822-79-67'} underline={'hover'}>+7 (916)
                        822-79-67</Link>
                </Stack>
                <Stack spacing={1} direction={{xs: 'column', md: 'row'}}>
                    <Typography variant={'subtitle1'}>email:</Typography>
                    <Link sx={{lineHeight: 1.75}} href={'mailto:crassair92@gmail.com'}
                          underline={'hover'}>crassair92@gmail.com</Link>
                </Stack>
                <Stack spacing={1} direction={{xs: 'column', md: 'row'}}>
                    <Typography variant={'subtitle1'}>tg:</Typography>
                    <Link sx={{lineHeight: 1.75}} href={'https://t.me/CrassAir'} underline={'hover'}>CrassAir</Link>
                </Stack>
                <Stack spacing={1} direction={{xs: 'column', md: 'row'}}>
                    <Typography variant={'subtitle1'}>gitHub:</Typography>
                    <Link sx={{lineHeight: 1.75}} href={'https://github.com/CrassAir'}
                          underline={'hover'}>CrassAir</Link>
                </Stack>
            </Paper>
        </Grid>
        <Grid xs={12} md={4}>
            <Paper className={'about_img_anim'} sx={{transform: {xs: 'translateY(-102%)', md: 'translateX(-102%)'}}}>
                <CardMedia
                    component="img"
                    image={i}
                    height={223}
                    sx={{borderRadius: 1}}
                    alt="my photo"
                />
            </Paper>
        </Grid>
        <Grid xs={12} md={8} mdOffset={2}>
            <Paper className={'about_text_anim'}
                   sx={{p: 1, transform: {xs: 'translateY(-180%)', md: 'translateY(-105%)'}}}>
                <Typography variant={'h5'}>Обо мне</Typography>
                <Typography variant={'subtitle1'}>Основной стек:</Typography>
                <InfoTitle subtitle={'backend'} title={'Django, DRF, postgreSQL, Celery, channels'}/>
                <InfoTitle subtitle={'frontend'} title={'React JS, MUI, redux-toolkit, axios, TypeScript'}/>
                <InfoTitle subtitle={'mobile'} title={'Flutter, GetX, Dio (only android)'}/>

                <Typography>Ответственный, пунктуальный, не конфликтный.
                    Присутствует здоровое чувство юмора.
                    Стремлюсь изучать что то новое, решать сложные задачи.</Typography>
            </Paper>
        </Grid>
    </Grid>
}

