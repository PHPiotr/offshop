import React, {useState, useEffect, useContext} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Field, Form, reduxForm, formValueSelector, isValid} from 'redux-form';
import {Box} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core';
import {showNotification} from "../../../../actions/notification";
import {resetAdminProduct} from '../../../../modules/Products/actions';
import {inputs, inputKeys, initialValues, formName} from '../../config';
import {useSocket} from '../../../../contexts/SocketContext';

const useStyles = makeStyles(theme => ({
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
}));

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

const getImageFile = (currentImage, currentSlug, imageFile) => {
    if (!imageFile || imageFile.length === 0 && currentImage) {
        return [{
            name: currentImage,
            preview: `${process.env.REACT_APP_PRODUCT_PATH}/${currentImage}`,
        }];
    }
    return imageFile;
};

let ProductForm = props => {
    const [currentSlug, setCurrentSlug] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);
    const classes = useStyles();
    const socket = useSocket();

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
        if (props.adminProduct && props.adminProduct.id) {
            const {slug, images} = props.adminProduct;
            setCurrentSlug(slug);
            setCurrentImage(images[0].tile);
        } else {
            props.handleResetAdminProduct();
        }
        return () => {
            props.handleResetAdminProduct();
        };
    }, []);

    return (
        <Form className={classes.form} onSubmit={props.handleSubmit} encType="multipart/form-data">
            {inputKeys.reduce((acc, itemId) => {
                const {label, type, validate, component, inputProps} = inputs[itemId];

                if (type === 'file') {
                    let validation = validate;
                    if (props.match.params.id) {
                        validation = [];
                    }
                    acc.push(
                        <Box key={itemId} className={classes.box}>
                            <Field
                                data-testid={itemId}
                                name={itemId}
                                component={component}
                                type={type}
                                imagefile={getImageFile(currentImage, currentSlug, props.imageFile)}
                                handleOnDrop={handleOnDrop}
                                validate={validation}
                                InputProps={inputProps}
                            />
                        </Box>
                    );
                } else if (type === 'switch') {
                    acc.push(
                        <Box key={itemId} className={classes.box}>
                            <Field
                                data-testid={itemId}
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
                        <Box key={itemId} className={classes.box}>
                            <Field
                                data-testid={itemId}
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
            <div className={classes.buttons}>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    disabled={props.submitting || !props.isValidProduct}
                    type="submit"
                >
                    Zapisz
                </Button>
            </div>
        </Form>
    );
};

ProductForm = reduxForm({
    form: formName,
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

const selector = formValueSelector(formName);

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
        isValidProduct: isValid(formName)(state),
        initialValues,
        adminProduct: state.adminProduct.data[state.adminProduct.id],
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
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductForm);
