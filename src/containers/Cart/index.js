import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import CartProducts from '../../components/Cart/Products';
import CartSummary from '../../components/Cart/Summary';
import CartEmpty from '../../components/Cart/Empty';
import SubHeader from '../../components/SubHeader';
import {addToCart, removeFromCart} from "../../actions/cart";

class Cart extends Component {
    render() {
        if (!this.props.products.length) {
            return <CartEmpty />;
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
});

const mapDispatchToProps = (dispatch) => ({
    addToCart(e) {
        dispatch(addToCart(e.currentTarget.id));
    },
    removeFromCart(e) {
        dispatch(removeFromCart(e.currentTarget.id));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
