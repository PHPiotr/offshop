import React, {Fragment, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Field, Form, reduxForm, formValueSelector, isValid} from 'redux-form';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import {createProductIfNeeded, updateProductIfNeeded} from "../../../actions/admin/product/index";
import {showNotification} from "../../../actions/notification";
import SubHeader from '../../../components/SubHeader';
import ProgressIndicator from '../../../components/ProgressIndicator';
import {getAdminProductIfNeeded} from '../../../actions/admin/product';
import {inputs, inputKeys, initialValues} from './config';

const FORM_NAME = 'product';

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

const handleOnDrop = ([newImageFile], onChange) => {
    const imageFile = {
        file: newImageFile,
        name: newImageFile.name,
        preview: URL.createObjectURL(newImageFile),
        size: newImageFile.size
    };
    onChange(imageFile);
    window.URL.revokeObjectURL(newImageFile);
};

let ProductForm = props => {
    const [currentSlug, setCurrentSlug] = useState(null);
    useEffect(() => {
        if (props.match.params.productId) {
            props.getAdminProductIfNeeded(props.match.params.productId)
                .then(({entities, result}) => {
                    setCurrentSlug(entities.products[result].slug);
                });
        }
    }, [props.match.params.productId]);

    return (
        <Fragment>
            {props.isRequestInProgress && <ProgressIndicator/>}
            <SubHeader content={`${props.match.params.productId ? 'Edytuj' : 'Dodaj'} produkt`}/>
            <Form onSubmit={props.handleSubmit} encType="multipart/form-data">
                <Grid container spacing={10}>
                    {inputKeys.reduce((acc, itemId) => {
                        const {label, type, validate, component, inputProps} = inputs[itemId];

                        if (type === 'file') {
                            let validation = validate;
                            if (props.match.params.productId) {
                                validation = [];
                            }
                            acc.push(
                                <Grid item xs={12} key={itemId}>
                                    <Field
                                        name={itemId}
                                        component={component}
                                        type={type}
                                        imagefile={
                                            (!props.imageFile || props.imageFile.length === 0)
                                                ? (
                                                    (props.match.params.productId && currentSlug)
                                                        ? [{name: '', preview: `${process.env.REACT_APP_PRODUCT_PATH}/${props.match.params.productId}.tile.jpg?${(new Date()).getTime()}`, size: 0}]
                                                        : []
                                                ) : props.imageFile
                                        }
                                        handleOnDrop={handleOnDrop}
                                        validate={validation}
                                    />
                                </Grid>
                            );
                        } else if (type === 'switch') {
                            acc.push(
                                <Grid item xs={12} key={itemId}>
                                    <Field
                                        name={itemId}
                                        component={component}
                                        label={label}
                                        validate={validate}
                                        checked={!!props.active}
                                    />
                                </Grid>
                            )
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
                <div className={props.classes.buttons}>
                    <Button
                        variant="contained"
                        color="primary"
                        className={props.classes.button}
                        disabled={props.submitting || !props.isValidProduct}
                        type="submit"
                    >
                        {`${props.match.params.productId ? 'Edytuj' : 'Dodaj'} produkt`}
                    </Button>
                </div>
            </Form>
        </Fragment>
    );
};

ProductForm = reduxForm({
    form: FORM_NAME,
    initialValues,
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
})(ProductForm);

ProductForm.propTypes = {
    isValidProduct: PropTypes.bool,
};

ProductForm.defaultProps = {
    isValidProduct: false,
};

const selector = formValueSelector(FORM_NAME);

const mapStateToProps = state => {
    const imageFile = selector(state, 'img');
    const initialValues = {...state.adminProduct.data[state.adminProduct.id]};
    if (initialValues.unitPrice) {
        initialValues.unitPrice = (initialValues.unitPrice / 100).toFixed(2);
    }
    if (initialValues.weight) {
        initialValues.weight = (initialValues.weight / 100).toFixed(2);
    }
    return {
        isRequestInProgress: state.adminProduct.isCreating || state.adminProduct.isFetching || state.adminProduct.isDeleting,
        imageFile: imageFile ? [imageFile] : [],
        active: selector(state, 'active'),
        accessToken: state.auth.accessToken,
        isValidProduct: isValid(FORM_NAME)(state),
        initialValues,
        values: state.adminProduct.data[state.adminProduct.id],
    };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
    getAdminProductIfNeeded(productId) {
        return dispatch(getAdminProductIfNeeded(productId));
    },
    onSubmit: async (formProps, _, {accessToken, reset}) => {
        try {
            if (ownProps.match.params.productId) {
                await dispatch(updateProductIfNeeded(formProps, accessToken));
            } else {
                await dispatch(createProductIfNeeded(formProps, accessToken));
            }
            ownProps.history.push('/admin/products/list');
            reset();
        } catch (e) {
            dispatch(showNotification({message: e.message, variant: 'error'}));
        }
    },
});

ProductForm = connect(mapStateToProps, mapDispatchToProps)(ProductForm);

export default withStyles(styles)(ProductForm);
