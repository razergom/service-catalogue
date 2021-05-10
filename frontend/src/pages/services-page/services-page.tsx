import React from 'react'
import { useGate, useStore } from 'effector-react'
import { useHistory } from 'react-router-dom'
import { servicesModel } from '../../models/services-model'
import { registerServiceModel } from '../../models/register-service-model'
import { RegisterServiceModal } from '../../components/register-service-modal'
import { ConfirmationModal } from '../../components/confirmation-modal/confirmation-modal'
import { ServicesTable } from '../../components/services-table'
import { Loader } from '../../components/loader'
import { Button, TextField, InputAdornment } from '@material-ui/core'
import { Search } from '@material-ui/icons'
import styles from './styles.module.scss'

export const ServicesPage = () => {
    const {
        services,
        searchString,
        isLoading,
        isRemoving,
        removeConfirmationModalIsOpened,
    } = useStore(servicesModel.pageData)

    const history = useHistory()

    const handleRedirectToJsAudit = () => history.push('/services/audit/js')

    useGate(servicesModel.gate)

    const currentServices = searchString === '' ? services : services.filter((s) => s.searchFlag)

    const notFound = currentServices.length === 0 && services.length !== 0
    const noServices = services.length === 0

    return (
        <div className={styles.pageContent}>
            <ConfirmationModal
                open={removeConfirmationModalIsOpened}
                acceptDisabled={isRemoving}
                titleText="Are you sure?"
                onAccept={servicesModel.removeService}
                onCancel={servicesModel.closeRemoveConfirmationModal}
                onClose={servicesModel.closeRemoveConfirmationModal}
                acceptText="Delete"
                cancelText="Cancel"
            >
                <p>Do you really want to delete this service?</p>
                <p>This process cannot be undone.</p>
            </ConfirmationModal>

            <div className={styles.control}>
                <div className={styles.leftBtns}>
                    <Button
                        className={styles.leftBtn}
                        variant="contained"
                        color="primary"
                        onClick={() => registerServiceModel.openModal()}
                    >
                        Register Service
                    </Button>
                    <Button
                        className={styles.leftBtn}
                        variant="contained"
                        color="default"
                    >
                        Summary
                    </Button>
                    <Button
                        className={styles.leftBtn}
                        variant="contained"
                        color="default"
                        onClick={handleRedirectToJsAudit}
                    >
                        Run JS-Audit
                    </Button>
                </div>
                <TextField
                    placeholder="search..."
                    value={searchString}
                    onChange={(e) => servicesModel.onChangeSearchString(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                />
            </div>
            <RegisterServiceModal />
            {isLoading && <Loader className={styles.loader} /> }
            {!isLoading && (
                <ServicesTable
                    services={currentServices}
                    searchData={
                        {
                            searchString: searchString,
                            notFound: notFound,
                            noServices: noServices,
                        }
                    }
                />
            )}
        </div>
    )
}
