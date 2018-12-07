import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import CartProducts from '../../components/Cart/Products';
import CartSummary from '../../components/Cart/Summary';
import SubHeader from '../../components/SubHeader';
import {addToCart, removeFromCart, removeItemFromCart} from "../../actions/cart";

class Cart extends Component {
    render() {
        if (!this.props.products.length) {
            return <SubHeader content="Koszyk jest pusty" />
        }
        return (
            <Fragment>
                <SubHeader content="Koszyk" />
                <CartProducts {...this.props} />
                <CartSummary {...this.props} />
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    cart: state.cart,
    products: state.products.items.filter(p => p.inCart > 0),
    supply: state.supply,
});

const mapDispatchToProps = (dispatch) => ({
    addOneToCart(e) {
        dispatch(addToCart(e.currentTarget.id));
    },
    removeOneFromCart(e) {
        dispatch(removeFromCart(e.currentTarget.id));
    },
    removeItemFromCart(e, amount) {
        dispatch(removeItemFromCart(e.currentTarget.id, amount));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
