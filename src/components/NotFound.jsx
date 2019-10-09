import React from 'react';
import {Link as RouterLink} from 'react-router-dom';
import {Error} from '@material-ui/icons';
import Link from '@material-ui/core/Link';
import {withStyles} from '@material-ui/core/styles';
import {Tooltip} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    errorWrapper: {
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto',
        marginTop: theme.spacing(2),
        flexDirection: 'column',
    },
});

const NotFound = props => (
    <div className={props.classes.errorWrapper}>
        <Typography variant='p' component='h1'>
            Błąd 404
        </Typography>
        <Typography component='p'>
            Strona nie istnieje.
        </Typography>
        <div>
            <Tooltip title='Strona nie istnieje'>
                <Error color="error" style={{fontSize: 140}}/>
            </Tooltip>
        </div>
        <div>
            <Link component={RouterLink} to="/">Wróć do strony głównej.</Link>
        </div>
    </div>
);
export default withStyles(styles)(NotFound);
