import React from 'react'
import { useGate, useStore } from 'effector-react'
import { summaryModel } from '../../models/summary-model'
import styles from './styles.module.scss'
import { Button } from '@material-ui/core'
import { Loader } from '../../components/loader'
import { useHistory } from 'react-router-dom'

export const SummaryPage = () => {
    const history = useHistory()
    useGate(summaryModel.gate)

    const { summaries, isLoading } = useStore(summaryModel.summaryData)

    const handleRedirectToServices = () => history.push('/services')

    console.log(summaries)

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
                </div>
            )}
            {!isLoading && (
                <div>
                    {summaries.map(s => <div key={Math.random() * Date.now()}>{s.tag} - {s.percent}</div>)}
                </div>
            )}
        </div>
    )
}
