import { lazy } from 'react'
import { ReactRoute } from './types'

const ServicesPage = lazy(() =>
    import('../pages/services-page').then((page) => ({ default: page.ServicesPage })))

const ServiceInfoPage = lazy(() =>
    import('../pages/service-info-page').then((page) => ({ default: page.ServiceInfoPage })))

const JsAuditPage = lazy(() =>
    import('../pages/js-audit-page').then((page) => ({ default: page.JsAuditPage })))

const SummaryPage = lazy(() =>
    import('../pages/summary-page').then((page) => ({ default: page.SummaryPage })))

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
    },
    {
        title: 'summary',
        path: '/services/summary/diagram',
        component: SummaryPage,
        exact: true,
    },
    {
        title: 'js-audit',
        path: '/services/audit/js',
        component: JsAuditPage,
        exact: true,
    },
]
