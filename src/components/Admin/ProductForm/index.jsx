import React, {Fragment, useState, useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Field, Form, reduxForm, formValueSelector, isValid} from 'redux-form';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import {createProductIfNeeded, updateProductIfNeeded} from "../../../actions/admin/product/index";
import {showNotification} from "../../../actions/notification";
import SubHeader from '../../../components/SubHeader';
import {getAdminProductIfNeeded, resetAdminProduct} from '../../../actions/admin/product';
import {inputs, inputKeys, initialValues} from './config';
import RequestHandler from '../../../containers/RequestHandler';
import io from '../../../io';

const socket = io();

const FORM_NAME = 'product';

window.URL = window.URL || window.webkitURL;

const styles = theme => ({
    form: {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
    },
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
    const [currentImage, setCurrentImage] = useState(null);
    let action = null;

    const onAdminCreateProductListener = ({product}) => props.showNotification({
        message: `Produkt ${product.name} został dodany.`,
        variant: 'success',
    });

    const onAdminUpdateProductListener = ({product}) => props.showNotification({
        message: `Produkt ${product.name} został zmieniony.`,
        variant: 'success',
    });

    useEffect(() => {
        socket.on('adminCreateProduct', onAdminCreateProductListener);
        socket.on('adminUpdateProduct', onAdminUpdateProductListener);
        return () => {
            socket.off('adminCreateProduct', onAdminCreateProductListener);
            socket.off('adminUpdateProduct', onAdminUpdateProductListener);
        }
    }, []);
    if (props.match.params.productId) {
        action = () => props.getAdminProductIfNeeded(props.match.params.productId).then((response => {
            if (response.status === 200) {
                const {slug, images} = response.data;
                setCurrentSlug(slug);
                setCurrentImage(images[0].tile);
            }
            return response;
        }));
    } else {
        props.handleResetAdminProduct();
    }

    return (
        <RequestHandler action={action}>
            {() => (
                <Fragment>
                    <SubHeader content={`${props.match.params.productId ? 'Edytuj' : 'Dodaj'} produkt`}/>
                    <Form className={props.classes.form} onSubmit={props.handleSubmit} encType="multipart/form-data">
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
                                                    (!props.imageFile || props.imageFile.length === 0) && currentImage
                                                        ? (
                                                            (props.match.params.productId && currentSlug)
                                                                ? [{
                                                                    name: '',
                                                                    preview: `${process.env.REACT_APP_PRODUCT_PATH}/${currentImage}`,
                                                                    size: 0
                                                                }]
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
            )}
        </RequestHandler>
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
    showNotification(payload) {
        dispatch(showNotification(payload));
    },
    handleResetAdminProduct() {
        return dispatch(resetAdminProduct());
    },
    getAdminProductIfNeeded(productId) {
        return dispatch(getAdminProductIfNeeded(productId));
    },
    onSubmit: async (formProps, _, {accessToken, reset}) => {
        try {
            let response;
            if (ownProps.match.params.productId) {
                response = await dispatch(updateProductIfNeeded(formProps, accessToken));
            } else {
                response = await dispatch(createProductIfNeeded(formProps, accessToken));
            }

            const {status, data} = response;

            if (status === 200 || status === 201) {
                ownProps.history.push('/admin/products/list');
                reset();
            } else {
                dispatch(showNotification({message: data.message, variant: 'error'}));
            }

        } catch (e) {
            dispatch(showNotification({message: e.message, variant: 'error'}));
        }
    },
});

ProductForm = connect(mapStateToProps, mapDispatchToProps)(ProductForm);

export default withStyles(styles)(ProductForm);
