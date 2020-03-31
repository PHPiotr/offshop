import React from 'react';
import PropTypes from 'prop-types';
import {Link as RouterLink} from 'react-router-dom';
import {Link, Tooltip, Typography} from '@material-ui/core';
import {ShoppingCart} from '@material-ui/icons';
import {withStyles} from '@material-ui/core/styles';

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

const Empty = props => (
    <div className={props.classes.wrapper} data-testid="empty-cart">
        <Typography variant='h5' component='h1'>
            {props.label}
        </Typography>
        <div>
            <Tooltip title={props.label}>
                <ShoppingCart color="error" style={{fontSize: 140}}/>
            </Tooltip>
        </div>
        {props.linkLabel && props.linkTo && (
            <div>
                <Link component={RouterLink} to={props.linkTo}>{props.linkLabel}</Link>
            </div>
        )}
    </div>
);

Empty.propTypes = {
    label: PropTypes.string.isRequired,
    linkLabel: PropTypes.string,
    linkTo: PropTypes.string,
};

Empty.defaultProps = {
    linkLabel: '',
    linkTo: '',
};

export default withStyles(styles)(Empty);
