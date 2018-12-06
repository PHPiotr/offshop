import React, {Component} from 'react';
import {connect} from 'react-redux';
import GridList from '../../components/GridList';
import {addToCart} from "../../actions/cart";

class Home extends Component {

    render() {
        return <GridList {...this.props} />
    }
}

const mapStateToProps = (state) => ({
    category: state.categories.items.find(c => c.id === state.categories.currentId),
    products: state.products.items.filter(p => p.categoryId === state.categories.currentId),
});

const mapDispatchToProps = (dispatch) => ({
    addToCart(e) {
        console.log(e);
        dispatch(addToCart(e.currentTarget.id));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
