import React from 'react'
import { useGate, useStore } from 'effector-react'
import { useParams, useHistory } from 'react-router-dom'
import { serviceInfoModel } from '../../models/service-info-model'
import { BuildStatus, ServiceId } from '../../api/services-api'
import { IdBanner } from '../../components/id-banner'
import { Loader } from '../../components/loader'
import { ProgressBar } from '../../components/progress-bar'
import { Button, Tooltip, Tabs, Tab, InputAdornment, TextField } from '@material-ui/core'
import { Search } from '@material-ui/icons'
import styles from './styles.module.scss'

export const ServiceInfoPage = () => {
    const { id }: any = useParams()
    useGate(serviceInfoModel.gate, id as ServiceId)

    const history = useHistory()

    const { service, searchString, isLoading } = useStore(serviceInfoModel.serviceInfoPage)

    const [tab, setTab] = React.useState(0)

    const handleRedirect = () => history.push('/services')

    const handleTabChange = (event: React.ChangeEvent<{}>, newTab: number) => {
        setTab(newTab)
    }

    if (isLoading) {
        return <Loader className={styles.loader} />
    }

    if (!service) {
        return <div>Service not found.</div>
    }

    const getBuildBackgroundColorClass = (buildStatus: BuildStatus) => {
        switch (buildStatus) {
            case BuildStatus.COMPLETED:
                return styles.borderGreen
            case BuildStatus.PROCESS:
                return styles.borderBlue
            case BuildStatus.FAILED:
                return styles.borderRed
        }
    }

    const currentBuilds = searchString === '' ? service.builds : service.builds.filter((b) => b.searchFlag)

    const notFoundBuilds = currentBuilds.length === 0 && service.builds.length !== 0
    const noBuilds = service.builds.length === 0

    return (
        <div className={styles.page}>
            <Button
                className={styles.btn}
                variant="contained"
                color="primary"
                onClick={handleRedirect}
            >
                Go to services
            </Button>
            <IdBanner idValue={service._id} name={service.name} />
            <Tabs indicatorColor="primary" className={styles.tabs} value={tab} onChange={handleTabChange}>
                <Tab className={styles.tab} label="Information" />
                <Tab className={styles.tab} label="Builds" />
            </Tabs>
            {tab === 0 && (
                <div className={styles.content}>
                    <div className={styles.serviceContent}>
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
            )}
            {tab === 1 && (
                <div className={styles.buildsContent}>
                    {service.builds.length !== 0 && (
                        <TextField
                            placeholder="search..."
                            className={styles.searchInput}
                            value={searchString}
                            onChange={(e) =>
                                serviceInfoModel.onChangeSearchString(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    )}
                    {noBuilds && <div className={styles.subInfo}>No builds for this service.</div>}
                    {notFoundBuilds && <div className={styles.subInfo}>{`No results for "${searchString}"'`}</div>}
                    {service.builds.length !== 0 && (
                        <div className={styles.builds}>
                            {currentBuilds.map((build) => (
                                <div
                                    key={build._id}
                                    className={`${styles.build} ${getBuildBackgroundColorClass(build.status)}`}
                                >
                                    <div>{build.name}</div>
                                    <div>{build.status}</div>
                                    {(build.status === BuildStatus.COMPLETED || build.status === BuildStatus.FAILED) && build.testResult && (
                                        <div className={styles.testWrapper}>
                                            <ProgressBar
                                                value={build.testResult.coverage}
                                                color={build.testResult.coverage < 70 ? 'secondary' : 'primary'} />
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
