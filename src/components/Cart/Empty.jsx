import React from 'react';
import {Link as RouterLink} from 'react-router-dom';
import {ShoppingCart} from '@material-ui/icons';
import Link from '@material-ui/core/Link';
import {withStyles} from '@material-ui/core/styles';
import {Tooltip} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    wrapper: {
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto',
        flexDirection: 'column',
    },
});

const EmptyCart = props => (
    <div className={props.classes.wrapper}>
        <Typography variant='p' component='h1'>
            Pusty koszyk
        </Typography>
        <div>
            <Tooltip title={`Pusty koszyk`}>
                <ShoppingCart color="error" style={{fontSize: 140}}/>
            </Tooltip>
        </div>
        <div>
            <Link component={RouterLink} to="/">Wróć do strony głównej.</Link>
        </div>
    </div>
);

export default withStyles(styles)(EmptyCart);
