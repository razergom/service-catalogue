import React from 'react'
import { useGate } from 'effector-react'
import { servicesModel } from '../../models/services-model'
import styles from './styles.module.scss'

export const ServicesPage = () => {
    useGate(servicesModel.gate)

    return (
        <div>services</div>
    )
}