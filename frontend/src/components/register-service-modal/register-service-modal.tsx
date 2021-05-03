import React from 'react'
import { useStore } from 'effector-react'
import { Modal } from '../modal'
import {Button, PropTypes, TextField} from '@material-ui/core'
import { registerServiceModel } from '../../models/register-service-model'
import styles from './styles.module.scss'

export const RegisterServiceModal = () => {
    const { isOpened, isPending, configUrl } = useStore(registerServiceModel.modalData)

    const saveDisabled = configUrl === '' || isPending

    return (
        <Modal open={isOpened} onClose={() => registerServiceModel.closeModal()}>
            <div className={styles.modal}>
                <h3>register service</h3>
                <TextField
                    autoComplete="off"
                    variant="outlined"
                    className={styles.input}
                    value={configUrl}
                    id="outlined-basic"
                    label="URL"
                    placeholder="https://github.com/<username>/<repository>/blob/main/<path>"
                    onChange={(e) =>
                        registerServiceModel.urlChanged(e.target.value)}
                />
                <div className={styles.btnWrapper}>
                    <Button
                        disabled={saveDisabled}
                        className={styles.btn}
                        variant="contained"
                        color="primary"
                        onClick={() => registerServiceModel.registerServiceClicked()}
                    >
                        Register
                    </Button>
                    <Button
                        className={styles.btn}
                        variant="contained"
                        color="default"
                        onClick={() => registerServiceModel.closeModal()}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </Modal>
    )
}
