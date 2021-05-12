import React from 'react'
import {Link, useHistory} from 'react-router-dom'
import { useGate, useStore } from 'effector-react'
import { jsAuditModel } from '../../models/js-audit-model'
import { Button } from '@material-ui/core'
import { Loader } from '../../components/loader'
import styles from './styles.module.scss'

export const JsAuditPage = () => {
    const history = useHistory()
    useGate(jsAuditModel.gate)

    const { jsAuditResults, isLoading } = useStore(jsAuditModel.auditPageData)

    const handleRedirectToServices = () => history.push('/services')

    const dependencies = jsAuditResults ? Object.entries(jsAuditResults).map(auditResult => auditResult[0]) : []

    const dependenciesEmpty = !jsAuditResults || (Object.keys(jsAuditResults).length === 0 && jsAuditResults.constructor === Object)

    return (
        <div className={styles.pageContent}>
            <Button
                className={styles.btn}
                variant="contained"
                color="primary"
                onClick={handleRedirectToServices}
            >
                Back to services
            </Button>
            {isLoading && (
                <div className={styles.loader}>
                    <Loader className={''} />
                    <div>running npm audit...</div>
                </div>
            )}
            {!isLoading && (
                <div className={styles.auditContent}>
                    <h2>JS-SERVICES AUDIT RESULTS</h2>
                    {!dependenciesEmpty && (
                        <div className={styles.auditList}>
                            {dependencies.map(d => (
                                <div key={Math.random() * Date.now()}>
                                    <div className={styles.dependency}>{d}</div>
                                    {jsAuditResults && (
                                        <div className={styles.serviceWrapper}>
                                            {jsAuditResults[d].map(dRes => (
                                                <div key={dRes._id} className={styles.service}>
                                                    <Link to={`/services/${dRes._id}`} target="_blank">
                                                        <div className={styles.serviceLink}>{dRes.name}</div>
                                                    </Link>
                                                    <div className={styles.serviceRecommendation}> ({dRes.recommendation})</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    {dependenciesEmpty && <div>no vulnerabilities or js-services</div>}
                </div>
            )}
        </div>
    )
}
