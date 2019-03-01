import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Field, Form, reduxForm} from 'redux-form';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import {CREATE_PRODUCT_REQUEST, CREATE_PRODUCT_SUCCESS, createNewProductIfNeeded} from "../../../actions/product/index";

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

    handleFormSubmit = (formProps, dispatch) => {
        dispatch(createNewProductIfNeeded(formProps, this.props.accessToken));
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
        <Form onSubmit={this.props.handleSubmit} encType="multipart/form-data">
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

function submit(formProps, dispatch, props) {
    dispatch(() => ({type: CREATE_PRODUCT_REQUEST}));
    dispatch(() => ({type: CREATE_PRODUCT_SUCCESS}));
    dispatch(createNewProductIfNeeded(formProps, props.accessToken));
}

ProductForm = reduxForm({
    form: 'product',
    destroyOnUnmount: true,
    initialValues: {
        quantity: 1,
        unit: 'kg',
        unitsPerProduct: 1,

    },
    onSubmit: submit
})(ProductForm);

ProductForm.propTypes = {
    inputKeys: PropTypes.array,
    inputs: PropTypes.object,
};

ProductForm.defaultProps = {
    inputKeys: [],
    inputs: {},
};

const mapStateToProps = state => ({
    inputKeys: state.product.ids,
    inputs: state.product.data,
});

ProductForm = connect(mapStateToProps)(ProductForm);

export default withStyles(styles)(ProductForm);
