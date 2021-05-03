import React from 'react'
import { useGate, useStore } from 'effector-react'
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
    const { services, isLoading, isRemoving, removeConfirmationModalIsOpened } = useStore(servicesModel.pageData)

    useGate(servicesModel.gate)

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
                <Button
                    className={styles.registerBtn}
                    variant="contained"
                    color="default"
                    onClick={() => registerServiceModel.openModal()}
                >
                    Register Service
                </Button>
                <TextField
                    placeholder="search..."
                    value=""
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
                <ServicesTable services={services} />
            )}
        </div>
    )
}
