import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import * as PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createOrder} from '../../../actions/order';
import {setActiveStepId} from '../../../actions/checkout';
import {showNotification} from '../../../actions/notification';
import {formValueSelector} from 'redux-form';
import withPayU from '../../../hoc/withPayU';

const styles = theme => ({
    button: {
        marginTop: theme.spacing.unit * 3,
        marginLeft: theme.spacing.unit,
        border: 0,
        height: '50px',
        width: '291px',
        background: 'url(http://static.payu.com/pl/standard/partners/buttons/payu_account_button_long_03.png) no-repeat',
        cursor: 'pointer',
        margin: 0,
        padding: 0,
    },
});

const PayuButton = ({classes}) => (
    <button id="pay-button" className={classes.button}></button>
);

PayuButton.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    totalAmount: ((state.cart.totalPrice + state.deliveryMethods.data[state.deliveryMethods.currentId].unitPrice * 100 * state.cart.quantity) / 100).toFixed(2),
    src: `${process.env.REACT_APP_PAYU_BASE_URL}/front/widget/js/payu-bootstrap.js`,
    successCallback: 'test',
    currencyCode: process.env.REACT_APP_CURRENCY_CODE,
    customerEmail: formValueSelector('buyer')(state, 'email'),
    customerLanguage: 'pl',
    merchantPosId: process.env.REACT_APP_POS_ID,
    shopName: process.env.REACT_APP_MERCHANT_NAME,
    secondKeyMd5: process.env.REACT_APP_SECOND_KEY,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    async handleCreateOrderRequest(payMethods) {
        try {
            const payload = await dispatch(createOrder(payMethods));
            const {redirectUri} = payload;
            if (redirectUri) {
                window.location.href = redirectUri;
            } else {
                dispatch(setActiveStepId(0));
                ownProps.history.replace('/order');
            }
        } catch (e) {
            dispatch(setActiveStepId(2));
            dispatch(showNotification({message: e.message, variant: 'error'}));
        }
    },

    handleGooglePayError(err) {
        console.log(err);
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withPayU(PayuButton)));
