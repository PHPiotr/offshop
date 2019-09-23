import React from 'react';
import {Link as RouterLink} from 'react-router-dom';
import {Error} from '@material-ui/icons';
import Link from '@material-ui/core/Link';
import {withStyles} from '@material-ui/core/styles';
import {Tooltip} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    errorWrapper: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        zIndex: 1,
        textAlign: 'center',
    },
    errorInner: {
        position: 'absolute',
        margin: theme.spacing(2),
        top: '40%',
        left: '50%',
        marginLeft: -70,
        marginTop: -70,
    },
});

const ErrorPage = props => (
    <div className={props.classes.errorWrapper}>
        <div className={props.classes.errorInner}>
            <Typography variant='p' component='h1'>
                {props.status}
            </Typography>
            <Typography component='p'>
                {props.message}
            </Typography>
            <div>
                <Tooltip title={props.message}>
                    <Error color="error" style={{fontSize: 140}}/>
                </Tooltip>
            </div>
            <div>
                <Link component={RouterLink} to="/">Wróć do strony głównej.</Link>
            </div>
        </div>
    </div>
);
export default withStyles(styles)(ErrorPage);
