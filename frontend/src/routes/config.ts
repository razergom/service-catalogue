import { lazy } from 'react'
import { ReactRoute } from "./types";

const ServicesPage = lazy(() =>
    import('../pages/services-page').then((page) => ({ default: page.ServicesPage })))

export const routes: ReactRoute[] = [
    {
        title: 'services',
        path: '/services',
        component: ServicesPage,
        exact: true,
    }
]
