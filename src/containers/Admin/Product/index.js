import React, {Component, Fragment} from 'react';
import ProductForm from '../../../components/Product/ProductForm';
import SubHeader from '../../../components/SubHeader';
import ProgressIndicator from '../../../components/ProgressIndicator';
import {connect} from 'react-redux';

class Product extends Component {
    render() {
        return (
            <Fragment>
                {this.props.isCreating && <ProgressIndicator/>}
                <SubHeader content="Dodaj produkt"/>
                <ProductForm/>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    isCreating: state.product.isCreating,
});

export default connect(mapStateToProps)(Product);
