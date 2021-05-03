import React from 'react'
import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import { servicesModel } from '../../models/services-model'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import { IconButton } from '@material-ui/core'
import { ServiceDto } from '../../api/services-api'
import { Delete } from '@material-ui/icons'
import styles from './styles.module.scss'

const StyledTableCell = withStyles((theme: Theme) =>
    createStyles({
        head: {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.common.white,
        },
        body: {
            fontSize: 14,
        },
    }),
)(TableCell)

const StyledTableRow = withStyles((theme: Theme) =>
    createStyles({
        root: {
            '&:nth-of-type(odd)': {
                backgroundColor: theme.palette.action.hover,
            },
        },
    }),
)(TableRow)

const useStyles = makeStyles({
    table: {
        minWidth: 700,
    },
})

type ServicesTableProps = {
    services: ServiceDto[]
    searchData?: {
        noServices: boolean
        notFound: boolean
        searchString: string
    }
}

export const ServicesTable = (props: ServicesTableProps) => {
    const classes = useStyles()

    const { services } = props

    return (
        <TableContainer
            component={Paper}
            className={styles.table}
        >
            <Table
                stickyHeader
                className={classes.table}
                aria-label="customized table"
            >
                <TableHead>
                    <TableRow>
                        <StyledTableCell>name</StyledTableCell>
                        <StyledTableCell align="left">owner</StyledTableCell>
                        <StyledTableCell align="left">lifecycle</StyledTableCell>
                        <StyledTableCell align="left">description</StyledTableCell>
                        <StyledTableCell align="left">tags</StyledTableCell>
                        <StyledTableCell />
                    </TableRow>
                </TableHead>
                <TableBody className={styles.tableBody}>
                    {!props.searchData?.notFound && !props.searchData?.noServices && (
                        services.map((service) => (
                            <StyledTableRow key={service._id}>
                                <StyledTableCell component="th" scope="row">
                                    <div className={styles.linkCell}>{service.name}</div>
                                </StyledTableCell>
                                <StyledTableCell align="left">
                                    {service.spec?.owner ?? '-'}
                                </StyledTableCell>
                                <StyledTableCell align="left">
                                    {service.spec?.lifecycle ?? '-'}
                                </StyledTableCell>
                                <StyledTableCell align="left">
                                    {service.description ? service.description : '-'}
                                </StyledTableCell>
                                <StyledTableCell align="left">
                                    {service.tags.length !== 0 && (
                                        <div className={styles.tags}>
                                            {service.tags.map(tag => (
                                                <div key={Math.random() * Date.now()} className={styles.tag}>{tag}</div>
                                            ))}
                                        </div>
                                    )}
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    <IconButton onClick={() => servicesModel.openRemoveConfirmationModal(service._id)}>
                                        <Delete />
                                    </IconButton>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            {props.searchData?.noServices && (
                <div className={styles.subInfo}>No services.</div>
            )}
            {props.searchData?.notFound && (
                <div className={styles.subInfo}>No results for "{props.searchData.searchString}".</div>
            )}
        </TableContainer>
    )
}
