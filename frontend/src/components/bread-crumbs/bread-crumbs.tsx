import React from 'react'
import { Link } from 'react-router-dom'
import styles from './styles.module.scss'

type Item = { title: string; path: string }

type BreadcrumbsProps = React.HTMLAttributes<HTMLDivElement> & {
    items: Item[]
}

export const Breadcrumbs = (props: BreadcrumbsProps) => {
    return (
        <div className={`${styles.breadcrumbs} ${props.className ?? ''}`}>
            {props.items.map((i, index, array) => {
                const isLast = index + 1 === array.length

                if (isLast) {
                    return (
                        <Link key={i.path} to={i.path} className={styles.active}>
                            {i.title}
                        </Link>
                    )
                }

                return (
                    <React.Fragment key={i.path}>
                        <Link to={i.path}>{i.title}</Link>
                        <span> / </span>
                    </React.Fragment>
                )
            })}
        </div>
    )
}
