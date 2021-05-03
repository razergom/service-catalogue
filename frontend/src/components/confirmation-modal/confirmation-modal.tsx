import React from 'react'
import { Modal } from '@material-ui/core'
import { Button } from '@material-ui/core'
import styles from './styles.module.scss'

type ConfirmationModalProps = {
    open: boolean
    titleText: string
    acceptDisabled?: boolean
    acceptText?: string
    cancelText?: string
    onAccept?: () => void
    onCancel?: () => void
    onClose: () => void
    titleClass?: string
} & React.HTMLAttributes<HTMLDivElement>

export const ConfirmationModal = (props: ConfirmationModalProps) => {
    return (
        <Modal className={styles.modal} open={props.open} onClose={props.onClose}>
            <div className={styles.content}>
                <div className={`${styles.title} ${props.titleClass}`}>{props.titleText}</div>
                <div className={styles.description}>{props.children}</div>
                <div className={styles.control}>
                    {props.acceptText && (
                        <Button
                            disabled={props.acceptDisabled}
                            variant="contained"
                            color="secondary"
                            onClick={props.onAccept}
                        >
                            {props.acceptText}
                        </Button>
                    )}
                    {props.cancelText && (
                        <Button
                            variant="contained"
                            color="default"
                            onClick={props.onCancel}
                        >
                            {props.cancelText}
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    )
}
