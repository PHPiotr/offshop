import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import {retrieveOrder} from "../../actions/order";
import Typography from "@material-ui/core/Typography";
import SubHeader from "../../components/SubHeader";
class Order extends Component {
    componentDidMount() {
        const {extOrderId} = this.props.orderData;
        if (!extOrderId) {
            this.props.redirectToHome();
            return;
        }
        this.props.retrieveOrder(extOrderId);
    }

    render() {
        if (!this.props.orderData.extOrderId) {
            return null;
        }

        return (
            <Fragment>
                <SubHeader content="Dziękujemy za zakupy"/>
                <Typography variant="subtitle1">
                    {`Dziękujemy za zakupy, zamówienie zostanie zrealizowane po zaksięgowaniu wpłaty.`}
                </Typography>
                <Typography variant="subtitle1">
                    {`PRZEJDŹ DO TWOJEGO PANELU KLIENTA, ABY ZWERYFIKOWAĆ STAN ZAMÓWIENIA.`}
                </Typography>
                <Typography variant="subtitle1">
                    {`SKONTAKTUJ SIE Z DZIAŁEM OBSŁUGI KLIENTA, W PRZYPADKU PROBLEMÓW DOTYCZĄCYCH TEJ TRANSAKCJI`}
                </Typography>
                <Typography variant="subtitle1">
                    {`Numer Twojego zamówienia: ${this.props.orderData.extOrderId}`}
                </Typography>
                <Typography variant="subtitle1">
                    {`Więcej szczegółów znajdziesz w wiadomości, którą wysłaliśmy na Twój adres: ${this.props.orderData.buyer.email}`}
                </Typography>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    orderData: state.order.data || {},
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    retrieveOrder(extOrderId) {
        dispatch(retrieveOrder(extOrderId))
            .catch(e => console.log(e));
    },
    redirectToHome() {
        ownProps.history.replace('/');
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Order);
