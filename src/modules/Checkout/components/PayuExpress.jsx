import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import * as PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {formValueSelector} from 'redux-form';
import {createOrderIfNeeded, handleCreateOrderError} from '../actions';
import withPayuExpress from '../hoc/withPayuExpress';

const styles = theme => ({
    button: {
        marginTop: theme.spacing(1),
        marginLeft: 0,
        border: 0,
        height: '42px',
        width: '240px',
        backgroundSize: 'contain',
        background: 'url(http://static.payu.com/pl/standard/partners/buttons/payu_account_button_long_03.png) no-repeat',
        cursor: 'pointer',
        margin: 0,
        padding: 0,
    },
});

const PayuExpress = ({classes}) => (
    <button data-testid="payu-express-btn" id="pay-button" className={classes.button}></button>
);

PayuExpress.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    totalAmount: (state.cart.totalPriceWithDelivery / 100).toFixed(2),
    customerEmail: formValueSelector('buyer')(state, 'email'),
});

export default connect(mapStateToProps, {createOrderIfNeeded, handleCreateOrderError})(withStyles(styles)(withPayuExpress(PayuExpress)));
