import React from 'react'
import { Header } from '../components/header'
import { Routes } from '../routes'
import styles from './styles.module.scss'

export const App = () => {
    return (
        <div>
            <Header />
            <div className={styles.pageContent}>
                <div className={styles.content}>
                    <Routes />
                </div>
            </div>
        </div>
    )
}
