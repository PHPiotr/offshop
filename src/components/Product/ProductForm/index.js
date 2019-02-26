import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Field, Form, reduxForm} from 'redux-form';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import {createProduct} from '../../../api/products';

const styles = theme => ({
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginTop: theme.spacing.unit * 3,
        marginLeft: theme.spacing.unit,
    },
});

class ProductForm extends Component {

    state = {imageFile: []};

    constructor(props) {
        super(props);
        this.handleFormSubmit.bind(this);
    }

    handleFormSubmit = formProps => {
        const fd = new FormData();
        fd.append('img', formProps.img.file);
        fd.append('name', formProps.name);
        fd.append('price', formProps.price);
        fd.append('quantity', formProps.quantity);
        fd.append('unit', formProps.unit);
        fd.append('unitsPerProduct', formProps.unitsPerProduct);

        createProduct(fd);
    };

    handleOnDrop = (newImageFile, onChange) => {
        const imageFile = {
            file: newImageFile[0],
            name: newImageFile[0].name,
            preview: URL.createObjectURL(newImageFile[0]),
            size: newImageFile[0].size
        };

        this.setState({imageFile: [imageFile]}, () => onChange(imageFile));
    };

    render = () => (
        <Form onSubmit={this.props.handleSubmit(this.handleFormSubmit)} encType="multipart/form-data">
            <Grid container spacing={24}>
                {this.props.inputKeys.reduce((acc, itemId) => {
                    const {label, type, validate, component, min, max, format, normalize} = this.props.inputs[itemId];

                    if (type === 'file') {
                        acc.push(
                            <Grid item xs={12} key={itemId}>
                                <Field
                                    name={itemId}
                                    component={component}
                                    type={type}
                                    imagefile={this.state.imageFile}
                                    handleOnDrop={this.handleOnDrop}
                                    validate={validate}
                                    format={format}
                                    normalize={normalize}
                                />
                            </Grid>
                        );
                    } else {
                        acc.push(
                            <Grid item xs={12} key={itemId}>
                                <Field
                                    name={itemId}
                                    component={component}
                                    label={label}
                                    fullWidth
                                    type={type}
                                    validate={validate}
                                    format={format}
                                    normalize={normalize}
                                    InputProps={{inputProps: {min: min, max: max}}}
                                />
                            </Grid>
                        );
                    }
                    return acc;
                }, [])}
            </Grid>
            <div className={this.props.classes.buttons}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={this.props.handleNext}
                    className={this.props.classes.button}
                    disabled={this.props.submitting}
                    type="submit"
                >
                    Dodaj produkt
                </Button>
            </div>
        </Form>
    );
}

ProductForm = reduxForm({
    form: 'product',
    destroyOnUnmount: false,
    initialValues: {
        quantity: 1,
        unit: 'kg',
        unitsPerProduct: 1,

    },
})(ProductForm);

ProductForm.propTypes = {
    inputKeys: PropTypes.array,
    inputs: PropTypes.object,
    onSubmit: PropTypes.func,
};

ProductForm.defaultProps = {
    inputKeys: [],
    inputs: {},
    onSubmit: () => null,
};

const mapStateToProps = state => ({
    inputKeys: state.product.ids,
    inputs: state.product.data,
});

const mapDispatchToProps = dispatch => ({});

ProductForm = connect(mapStateToProps, mapDispatchToProps)(ProductForm);

export default withStyles(styles)(ProductForm);
