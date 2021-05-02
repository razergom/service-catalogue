import React from 'react'
import { useStore } from 'effector-react'
import { Breadcrumbs } from '../components/bread-crumbs'
import { Header } from '../components/header'
import { Routes } from '../routes'
import { breadCrumbsModel } from '../models/breadCrumbs'
import styles from './styles.module.scss'

export const App = () => {
    const breadCrumbs = useStore(breadCrumbsModel.$path)

    return (
        <div>
            <Header />
            <div className={styles.pageContent}>
                <Breadcrumbs items={breadCrumbs} />
                <div className={styles.content}>
                    <Routes />
                </div>
            </div>
        </div>
    )
}
