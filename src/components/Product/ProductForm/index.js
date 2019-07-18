import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Field, Form, reduxForm, formValueSelector, isValid} from 'redux-form';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import {createNewProductIfNeeded} from "../../../actions/product/index";
import {showNotification} from "../../../actions/notification";

window.URL = window.URL || window.webkitURL;

const styles = theme => ({
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        marginLeft: theme.spacing(1),
    },
});

class ProductForm extends Component {

    handleOnDrop = ([newImageFile], onChange) => {
        const imageFile = {
            file: newImageFile,
            name: newImageFile.name,
            preview: URL.createObjectURL(newImageFile),
            size: newImageFile.size
        };
        onChange(imageFile);
        window.URL.revokeObjectURL(newImageFile);
    };

    render = () => (
        <Form onSubmit={this.props.handleSubmit} encType="multipart/form-data">
            <Grid container spacing={10}>
                {this.props.inputKeys.reduce((acc, itemId) => {
                    const {label, type, validate, component, inputProps} = this.props.inputs[itemId];

                    if (type === 'file') {
                        acc.push(
                            <Grid item xs={12} key={itemId}>
                                <Field
                                    name={itemId}
                                    component={component}
                                    type={type}
                                    imagefile={this.props.imageFile || []}
                                    handleOnDrop={this.handleOnDrop}
                                    validate={validate}
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
                                    InputProps={inputProps}
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
                    className={this.props.classes.button}
                    disabled={this.props.submitting || !this.props.isValidProduct}
                    type="submit"
                >
                    Dodaj produkt
                </Button>
            </div>
        </Form>
    );
}

const FORM_NAME = 'product';

ProductForm = reduxForm({
    form: FORM_NAME,
    initialValues: {
        stock: 1,
        weight: 1,
    },
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
})(ProductForm);

ProductForm.propTypes = {
    inputKeys: PropTypes.array,
    inputs: PropTypes.object,
    isValidProduct: PropTypes.bool,
};

ProductForm.defaultProps = {
    inputKeys: [],
    inputs: {},
    isValidProduct: false,
};

const selector = formValueSelector(FORM_NAME);

const mapStateToProps = state => {
    const imageFile = selector(state, 'img');
    return {
        inputKeys: state.product.ids,
        inputs: state.product.data,
        imageFile: imageFile ? [imageFile] : [],
        accessToken: state.auth.accessToken,
        isValidProduct: isValid(FORM_NAME)(state),
    };
};

const mapDispatchToProps = dispatch => ({
    onSubmit: async (formProps, _, {accessToken, reset}) => {
        try {
            await dispatch(createNewProductIfNeeded(formProps, accessToken));
            reset();
        } catch (e) {
            dispatch(showNotification({message: e.message, variant: 'error'}));
        }
    },
});

ProductForm = connect(mapStateToProps, mapDispatchToProps)(ProductForm);

export default withStyles(styles)(ProductForm);
