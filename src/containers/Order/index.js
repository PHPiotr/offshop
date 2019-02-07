import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import Typography from "@material-ui/core/Typography";
import SubHeader from "../../components/SubHeader";
import {injectIntl, FormattedMessage} from 'react-intl';
import Grid from "@material-ui/core/Grid";

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
                <SubHeader content={this.props.intl.formatMessage({id: 'order.thanks'})}/>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Typography variant="subheading">
                        <FormattedMessage id="order.number" values={{extOrderId: extOrderId}}/>
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Typography variant="subheading">
                        <FormattedMessage id="order.info"/>
                    </Typography>
                </Grid>
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

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Order));
