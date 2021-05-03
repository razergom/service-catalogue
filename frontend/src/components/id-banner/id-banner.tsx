import React from 'react'
import styles from './styles.module.scss'

type IdBannerProps = {
    name: string
    idValue: string
}

export const IdBanner = (props: IdBannerProps) => (
    <div className={styles.idBanner}>
        <h2>{props.name}</h2>
        <div>ID: {props.idValue}</div>
    </div>
)
