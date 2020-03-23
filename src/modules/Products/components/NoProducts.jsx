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
        marginTop: theme.spacing(2),
        flexDirection: 'column',
    },
});

const NoProducts = props => (
    <div className={props.classes.wrapper} data-testid="empty-cart">
        <Typography variant='h5' component='h1'>
            Brak produktów
        </Typography>
        <div>
            <Tooltip title={`Brak produktów`}>
                <ShoppingCart color="error" style={{fontSize: 140}}/>
            </Tooltip>
        </div>
    </div>
);

export default withStyles(styles)(NoProducts);
