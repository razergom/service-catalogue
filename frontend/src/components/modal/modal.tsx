import React from 'react'
import { Modal as MaterialModal, ModalProps } from '@material-ui/core'
import styles from './styles.module.scss'

export const Modal = (props: ModalProps) => {
    return (
        <MaterialModal {...props} className={styles.modal}>
            <div className={props.className}>{props.children}</div>
        </MaterialModal>
    )
}
