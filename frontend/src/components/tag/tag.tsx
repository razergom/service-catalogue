import React from 'react'
import styles from './styles.module.scss'

type TagProps = {
    value: string
}

export const Tag = (props: TagProps) =>
    <div className={styles.tag}>{props.value}</div>
