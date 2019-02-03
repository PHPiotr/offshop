import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import Typography from "@material-ui/core/Typography";
import SubHeader from "../../components/SubHeader";

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
                <SubHeader content="Dziękujemy za udane zakupy!"/>
                <Typography variant="subtitle1">
                    {`Numer Twojego zamówienia: ${extOrderId}`}
                </Typography>
                <Typography variant="subtitle1">
                    Wszystkie informacje znajdziesz w wiadomości, którą wysłaliśmy na Twój adres e-mail.
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
