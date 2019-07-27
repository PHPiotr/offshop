import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import * as PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {formValueSelector} from 'redux-form';
import {createOrderIfNeeded, handleCreateOrderError} from '../../../../actions/order';
import withPayuExpress from '../../../../hoc/withPayuExpress';

const styles = theme => ({
    button: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(1),
        border: 0,
        height: '50px',
        width: '291px',
        background: 'url(http://static.payu.com/pl/standard/partners/buttons/payu_account_button_long_03.png) no-repeat',
        cursor: 'pointer',
        margin: 0,
        padding: 0,
    },
});

const PayuExpress = ({classes}) => (
    <button id="pay-button" className={classes.button}></button>
);

PayuExpress.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    totalAmount: (state.cart.totalPriceWithDelivery / 100).toFixed(2),
    src: `${process.env.REACT_APP_PAYU_BASE_URL}/front/widget/js/payu-bootstrap.js`,
    successCallback: 'test',
    currencyCode: process.env.REACT_APP_CURRENCY_CODE,
    customerEmail: formValueSelector('buyer')(state, 'email'),
    //customerLanguage: 'pl',
    merchantPosId: process.env.REACT_APP_POS_ID,
    shopName: process.env.REACT_APP_MERCHANT_NAME,
    secondKeyMd5: process.env.REACT_APP_SECOND_KEY,
});

export default connect(mapStateToProps, {createOrderIfNeeded, handleCreateOrderError})(withStyles(styles)(withPayuExpress(PayuExpress)));
