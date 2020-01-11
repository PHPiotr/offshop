import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Field, Form, reduxForm, formValueSelector, isValid} from 'redux-form';
import {Box} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import {createProductIfNeeded, updateProductIfNeeded} from "../../../../modules/Products/actions";
import {showNotification} from "../../../../actions/notification";
import SubHeader from '../../../../components/SubHeader';
import {getAdminProductIfNeeded, resetAdminProduct} from '../../../../modules/Products/actions';
import {inputs, inputKeys, initialValues} from '../../config';
import io from '../../../../io';
import RequestHandler from '../../../../components/RequestHandler';

const socket = io();

const FORM_NAME = 'product';

window.URL = window.URL || window.webkitURL;

const styles = theme => ({
    form: {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        width: '100%',
    },
    box: {
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3),
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-start',
    },
    button: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
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

const getImageFile = (currentImage, currentSlug, imageFile, productId) => {
    if (!currentImage) {
        return [];
    }
    if (!imageFile || imageFile.length === 0) {
        return [{
            name: '',
            preview: `${process.env.REACT_APP_PRODUCT_PATH}/${currentImage}`,
            size: 0
        }];
    }
    return imageFile;
};

let ProductForm = props => {
    const [currentSlug, setCurrentSlug] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);

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

    useEffect(() => {
        if (props.match.params.productId && props.values) {
            const {slug, images} = props.values;
            setCurrentSlug(slug);
            setCurrentImage(images[0].tile);
        } else {
            props.handleResetAdminProduct();
        }
    }, [props.match.params.productId, props.values]);

    return (
        <RequestHandler
            action={() => props.match.params.productId ? props.getAdminProductIfNeeded(props.match.params.productId) : Promise.resolve({})}
        >
            <SubHeader content={`${props.match.params.productId ? 'Edytuj' : 'Dodaj'} produkt`}/>
            <Form className={props.classes.form} onSubmit={props.handleSubmit} encType="multipart/form-data">
                {inputKeys.reduce((acc, itemId) => {
                    const {label, type, validate, component, inputProps} = inputs[itemId];

                    if (type === 'file') {
                        let validation = validate;
                        if (props.match.params.productId) {
                            validation = [];
                        }
                        acc.push(
                            <Box key={itemId} className={props.classes.box}>
                                <Field
                                    name={itemId}
                                    component={component}
                                    type={type}
                                    imagefile={getImageFile(currentImage, currentSlug, props.imageFile, props.match.params.productId)}
                                    handleOnDrop={handleOnDrop}
                                    validate={validation}
                                />
                            </Box>
                        );
                    } else if (type === 'switch') {
                        acc.push(
                            <Box key={itemId} className={props.classes.box}>
                                <Field
                                    name={itemId}
                                    component={component}
                                    label={label}
                                    validate={validate}
                                    checked={!!props.active}
                                />
                            </Box>
                        )
                    } else {
                        acc.push(
                            <Box key={itemId} className={props.classes.box}>
                                <Field
                                    name={itemId}
                                    component={component}
                                    label={label}
                                    fullWidth
                                    type={type}
                                    validate={validate}
                                    InputProps={inputProps}
                                />
                            </Box>
                        );
                    }
                    return acc;
                }, [])}
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
