import React, {Fragment, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Field, Form, reduxForm, formValueSelector, isValid, reset} from 'redux-form';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import {createProductIfNeeded, updateProductIfNeeded} from "../../../actions/admin/product/index";
import {showNotification} from "../../../actions/notification";
import SubHeader from '../../../components/SubHeader';
import ProgressIndicator from '../../../components/ProgressIndicator';
import {getAdminProductIfNeeded} from '../../../actions/admin/product';
import {inputs, inputKeys, initialValues} from './config';
import ImagePreview from '../../FileInput/ImagePreview';

const FORM_NAME = 'product';

window.URL = window.URL || window.webkitURL;

const styles = theme => ({
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginTop: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 3,
        marginLeft: theme.spacing.unit,
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
    const [currentImageName, setCurrentImageName] = useState(null);
    useEffect(() => {
        if (props.match.params.productId) {
            props.getAdminProductIfNeeded(props.match.params.productId)
                .then(({entities, result}) => {
                    setCurrentImageName(entities.products[result].slug);
                });
        }
    }, [props.match.params.productId]);

    return (
        <Fragment>
            {props.isRequestInProgress && <ProgressIndicator/>}
            <SubHeader content={`${props.match.params.productId ? 'Edytuj' : 'Dodaj'} produkt`}/>
            <Form onSubmit={props.handleSubmit} encType="multipart/form-data">
                <Grid container spacing={24}>
                    {inputKeys.reduce((acc, itemId) => {
                        const {label, type, validate, component, inputProps} = inputs[itemId];

                        if (type === 'file') {
                            let validation = validate;
                            if (props.match.params.productId) {
                                validation = [];
                            }
                            currentImageName && acc.push(<ImagePreview key="currentImage" imagefile={[{name: 'hello', preview: `${process.env.REACT_APP_API_HOST}/images/products/${currentImageName}.tile.png`, size: 100}]}/>);
                            acc.push(
                                <Grid item xs={12} key={itemId}>
                                    <Field
                                        name={itemId}
                                        component={component}
                                        type={type}
                                        imagefile={props.imageFile || []}
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
    return {
        isRequestInProgress: state.adminProduct.isCreating || state.adminProduct.isFetching || state.adminProduct.isDeleting,
        imageFile: imageFile ? [imageFile] : [],
        active: selector(state, 'active'),
        accessToken: state.auth.accessToken,
        isValidProduct: isValid(FORM_NAME)(state),
        initialValues: state.adminProduct.data[state.adminProduct.id],
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
            reset();
        } catch (e) {
            dispatch(showNotification({message: e.message, variant: 'error'}));
        }
    },
});

ProductForm = connect(mapStateToProps, mapDispatchToProps)(ProductForm);

export default withStyles(styles)(ProductForm);
