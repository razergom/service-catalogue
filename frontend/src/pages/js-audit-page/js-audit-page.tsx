import React from 'react'
import { useHistory } from 'react-router-dom'
import styles from './styles.module.scss'

export const JsAuditPage = () => {
    const history = useHistory()

    const handleRedirect = () => history.push('/services')

    return (
        <div>JS-Audit</div>
    )
}
