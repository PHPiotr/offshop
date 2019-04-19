import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import Typography from "@material-ui/core/Typography";
import Paper from '@material-ui/core/Paper/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import SubHeader from "../../components/SubHeader";
import {injectIntl, FormattedMessage} from 'react-intl';
import Grid from "@material-ui/core/Grid";
import {resetOrderData} from '../../actions/order';

const styles = theme => ({
    paper: {
        marginTop: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 3,
        padding: theme.spacing.unit * 2,
        [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
            marginTop: 0,
            marginBottom: 0,
            padding: theme.spacing.unit * 3,
        },
        width: '100%',
    },
});

class Order extends Component {

    componentDidMount() {
        if (!this.props.orderData.extOrderId) {
            this.props.history.replace('/');
        }
    }

    componentWillUnmount() {
        this.props.resetOrderData();
    }

    render() {

        const {extOrderId} = this.props.orderData;

        if (!extOrderId) {
            return null;
        }

        return (
            <Fragment>
                <SubHeader content={this.props.intl.formatMessage({id: 'order.thanks'})}/>
                <Paper className={this.props.classes.paper}>
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
                </Paper>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    orderData: state.order.data || {},
});

export default connect(mapStateToProps, {resetOrderData})(injectIntl(withStyles(styles)(Order)));
