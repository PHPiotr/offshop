import React, {Component, Fragment} from 'react';
import ProductForm from '../../../components/Product/ProductForm';
import SubHeader from '../../../components/SubHeader';

class Product extends Component {
    render() {
        return (
            <Fragment>
                <SubHeader content="Dodaj produkt"/>
                <ProductForm accessToken={this.props.auth.getAccessToken()}/>
            </Fragment>
        );
    }
}

export default Product;
