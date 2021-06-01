import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useGate, useStore } from 'effector-react'
import { jsAuditModel } from '../../models/js-audit-model'
import { Button, InputAdornment, TextField } from '@material-ui/core'
import { Search } from '@material-ui/icons'
import { Loader } from '../../components/loader'
import styles from './styles.module.scss'

export const JsAuditPage = () => {
    const history = useHistory()
    useGate(jsAuditModel.gate)

    const { jsAuditResults, searchString, isLoading } = useStore(jsAuditModel.auditPageData)

    const handleRedirectToServices = () => history.push('/services')

    const dependencies = jsAuditResults ? Object.entries(jsAuditResults).map(auditResult => auditResult[0]) : []

    const dependenciesEmpty = !jsAuditResults || (Object.keys(jsAuditResults).length === 0 && jsAuditResults.constructor === Object)

    const foundedDependencies = jsAuditResults ? dependencies.filter(d =>
        d.trim().toLowerCase().includes(searchString.trim().toLowerCase()) ||
        jsAuditResults[d].find(dRes => dRes.name.trim().toLowerCase().includes(searchString.trim().toLowerCase()))) : []

    const notFoundDependencies = foundedDependencies.length === 0 && !dependenciesEmpty

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
                    <div className={styles.control}>
                        <h2>JS-services audit results ({foundedDependencies.length} vulnerabilities)</h2>
                        <TextField
                            placeholder="search..."
                            value={searchString}
                            onChange={(e) => jsAuditModel.onChangeSearchString(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>
                    {notFoundDependencies && <div className={styles.subInfo}>no results for {searchString}.</div>}
                    {dependenciesEmpty && <div className={styles.subInfo}>no vulnerabilities or js-services</div>}
                    {!dependenciesEmpty && (
                        <div className={styles.auditList}>
                            {foundedDependencies.map(d => (
                                <div key={Math.random() * Date.now()}>
                                    <div className={styles.dependency}>{d}</div>
                                    {jsAuditResults && (
                                        <div className={styles.serviceWrapper}>
                                            {jsAuditResults[d].map(dRes => (
                                                <div key={dRes._id} className={styles.service}>
                                                    <Link to={`/services/${dRes._id}`} target="_blank">
                                                        <div className={styles.serviceLink}>{dRes.name}</div>
                                                    </Link>
                                                    <div>&nbsp;&nbsp; - &nbsp;&nbsp;</div>
                                                    <div className={styles.serviceErrorTitle}>{dRes.description}</div>
                                                    <div className={styles.serviceRecommendation}>({dRes.recommendation})</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
