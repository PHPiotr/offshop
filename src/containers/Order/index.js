import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import Typography from "@material-ui/core/Typography";
import SubHeader from "../../components/SubHeader";
import {FormattedMessage} from 'react-intl';

class Order extends Component {

    componentDidMount() {
        if (!this.props.orderData.extOrderId) {
            this.props.redirectToHome();
        }
    }

    render() {

        const {extOrderId} = this.props.orderData;

        if (!extOrderId) {
            return null;
        }

        return (
            <Fragment>
                <SubHeader content={<FormattedMessage id="order.thanks" />}/>
                <Typography variant="title">
                    <FormattedMessage id="order.number" values={{extOrderId: extOrderId}} />
                </Typography>
                <Typography variant="subheading">
                    <FormattedMessage id="order.info" />
                </Typography>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    orderData: state.order.data || {},
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    redirectToHome() {
        ownProps.history.replace('/');
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Order);
