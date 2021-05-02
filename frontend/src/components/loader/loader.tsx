import React from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            '& > * + *': {
                marginLeft: theme.spacing(2),
            },
        },
    }),
)

type LoaderProps = {
    className?: string
}

export const Loader = (props: LoaderProps) => {
    const classes = useStyles()

    return (
        <div className={`${classes.root} ${props.className ? props.className : ''}`}>
            <CircularProgress />
        </div>
    )
}
