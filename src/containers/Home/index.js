import React, {Component} from 'react';
import {connect} from 'react-redux';
import Products from '../../components/Products';
import {addToCart, removeFromCart} from "../../actions/cart";

class Home extends Component {
    render() {
        return <Products {...this.props} />
    }
}

const mapStateToProps = (state) => ({
    category: state.categories.items.find(c => c.id === state.categories.currentId),
    products: state.products.items.filter(p => p.categoryId === state.categories.currentId),
});

const mapDispatchToProps = (dispatch) => ({
    addToCart(e) {
        dispatch(addToCart(e.currentTarget.id));
    },
    removeFromCart(e) {
        dispatch(removeFromCart(e.currentTarget.id));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
