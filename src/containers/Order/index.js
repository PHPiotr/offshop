import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import {retrieveOrder} from "../../actions/order";
import SubHeader from "../../components/SubHeader";
import Typography from "@material-ui/core/Typography";

class Order extends Component {
    componentDidMount() {
        this.props.retrieveOrder();
    }

    render() {
        return (
            <Fragment>
                <SubHeader content={`Dziękujemy za zamówienie`}/>
                <Typography variant="subtitle1">
                    {`Numer Twojego zamówienia to Wysłaliśmy do Ciebie maila ze szczegółami.`}
                </Typography>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({

});

const mapDispatchToProps = (dispatch, ownProps) => ({
    retrieveOrder() {
        dispatch(retrieveOrder(ownProps.match.params.extOrderId));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Order);
