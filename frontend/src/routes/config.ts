import { lazy } from 'react'
import { ReactRoute } from './types'

const ServicesPage = lazy(() =>
    import('../pages/services-page').then((page) => ({ default: page.ServicesPage })))

const ServiceInfoPage = lazy(() =>
    import('../pages/service-info-page').then((page) => ({ default: page.ServiceInfoPage })))

export const routes: ReactRoute[] = [
    {
        title: 'services',
        path: '/services',
        component: ServicesPage,
        exact: true,
    },
    {
        title: 'service',
        path: '/services/:id',
        component: ServiceInfoPage,
        exact: true,
    }
]
