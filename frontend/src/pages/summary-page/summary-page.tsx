import React from 'react'
import { useHistory } from 'react-router-dom'
import { useGate, useStore } from 'effector-react'
import { summaryModel } from '../../models/summary-model'
import { Button } from '@material-ui/core'
import { Doughnut } from 'react-chartjs-2'
import { Loader } from '../../components/loader'
import styles from './styles.module.scss'

export const SummaryPage = () => {
    const history = useHistory()
    useGate(summaryModel.gate)

    const { summaries, isLoading } = useStore(summaryModel.summaryData)

    const handleRedirectToServices = () => history.push('/services')

    const getShade = () => Math.floor(Math.random() * (Math.floor(255) - Math.ceil(1) + 1)) + Math.ceil(1)

    const colors = summaries.map((_) => `rgba(${getShade()}, ${getShade()}, ${getShade()}, 1)`)

    const data = {
        labels: summaries.map(s => s.tag),
        datasets: [
            {
                label: '%',
                data: summaries.map(s => s.percent),
                backgroundColor: colors,
                borderColor: colors,
                borderWidth: 1,
            },
        ],
    }

    const options = {
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: (context: any) =>
                        `${context.label.toUpperCase()}: ${context.dataset.data[context.dataIndex]}%`
                }
            },
        },
    }

    return (
        <div className={styles.pageContent}>
            <Button
                variant="contained"
                color="primary"
                onClick={handleRedirectToServices}
            >
                Back to services
            </Button>
            <h2>Summary</h2>
            {isLoading && (
                <div className={styles.loader}>
                    <Loader />
                </div>
            )}
            {!isLoading && (
                <div className={styles.pieContent}>
                    <div className={styles.summaryInfo}>
                        <h3>Technologies</h3>
                        {summaries.map((s, index) => (
                            <div key={Math.random() * Date.now()} className={styles.legendWrapper}>
                                <div style={{ backgroundColor: colors[index] }} className={styles.legendColor} />
                                <div className={styles.legendTag}>{s.tag.toUpperCase()}</div>
                                <div className={styles.legendValue}>({Number(s.percent).toFixed(2)}%)</div>
                            </div>
                        ))}
                    </div>
                    <div className={styles.pieWrapper}>
                        <Doughnut
                            data={data}
                            options={options}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
