import React from 'react'
import { useGate, useStore } from 'effector-react'
import { useParams } from 'react-router-dom'
import { serviceInfoModel } from '../../models/service-info-model'
import { ServiceId } from '../../api/services-api'
import { IdBanner } from '../../components/id-banner'
import { Loader } from '../../components/loader'
import { Button, Tooltip } from '@material-ui/core'
import styles from './styles.module.scss'

export const ServiceInfoPage = () => {
    const { id }: any = useParams()
    useGate(serviceInfoModel.gate, id as ServiceId)

    const { service, isLoading } = useStore(serviceInfoModel.serviceInfoPage)

    if (isLoading) {
        return <Loader className={styles.loader} />
    }

    if (!service) {
        return <div>Service not found.</div>
    }

    return (
        <div className={styles.page}>
            <Button className={styles.btn} variant="contained" color="default">
                back to services
            </Button>
            <IdBanner idValue={service._id} name={service.name} />
            <div className={styles.content}>
                <div className={styles.serviceContent}>
                    <h3>Information</h3>
                    <div><span className={styles.param}>version:</span> {service.version}</div>
                    {service.description && <div><span className={styles.param}>description:</span> {service.description}</div>}
                    {service.spec && (
                        <div>
                            <div><span className={styles.param}>owner:</span> {service.spec.owner}</div>
                            <div><span className={styles.param}>lifecycle:</span> {service.spec.lifecycle}</div>
                            <div><span className={styles.param}>type:</span> {service.spec.type}</div>
                        </div>
                    )}
                </div>
                {service.links.length !== 0 && (
                    <div className={styles.links}>
                        <h3>Links</h3>
                        {service.links.map((link) => (
                            <Tooltip key={Math.random() * Date.now()} title={link.url} enterDelay={1000}>
                                <div className={styles.link}>
                                    <span className={styles.param}>{link.title}: </span><a href={link.url} target="_blank">{link.url}</a>
                                </div>
                            </Tooltip>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
