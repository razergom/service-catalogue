import React, { Suspense } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

import { routes } from './config'
import { breadcrumbsModel } from '../models/breadcrumbs-model'

export const Routes = () => {
    React.useEffect(() => {
        breadcrumbsModel.setPath({
            title: routes.find((route) => route.path === `/${window.location.pathname.split('/')[1]}`)?.title ?? '404',
            path: `/${window.location.pathname.split('/')[1]}`,
        })
    }, [])

    return (
        <Suspense fallback={null}>
            <Switch>
                {routes.map((r) => (
                    <Route key={r.path} path={r.path} exact={r.exact} component={r.component} />
                ))}
                <Redirect exact from={'/'} to={'/services'} />
            </Switch>
        </Suspense>
    )
}
