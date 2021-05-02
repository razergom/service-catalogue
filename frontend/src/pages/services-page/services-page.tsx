import React from 'react'
import { useGate, useStore } from 'effector-react'
import { servicesModel } from '../../models/services-model'
import { ServicesTable } from '../../components/services-table'
import { Loader } from '../../components/loader'
import styles from './styles.module.scss'

export const ServicesPage = () => {
    const services = useStore(servicesModel.$services)
    const isLoading = useStore(servicesModel.$isLoading)
    useGate(servicesModel.gate)

    if (isLoading) {
        return (
            <Loader className={styles.loader} />
        )
    }

    return (
        <div className={styles.pageContent}>
            <ServicesTable services={services} />
        </div>
    )
}
