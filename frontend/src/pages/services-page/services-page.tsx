import React from 'react'
import { useGate, useStore } from 'effector-react'
import { servicesModel } from '../../models/services-model'
import { registerServiceModel } from '../../models/register-service-model'
import { RegisterServiceModal } from '../../components/register-service-modal'
import { ServicesTable } from '../../components/services-table'
import { Loader } from '../../components/loader'
import { Button } from '@material-ui/core'
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
            <Button
                className={styles.registerBtn}
                variant="outlined"
                color="primary"
                onClick={() => registerServiceModel.openModal()}
            >
                Register Service
            </Button>
            <RegisterServiceModal />
            <ServicesTable services={services} />
        </div>
    )
}
