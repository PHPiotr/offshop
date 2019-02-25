import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Field, Form, reduxForm} from 'redux-form';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import DropZoneField from '../../../components/FileInput/DropzoneField';
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

const renderTextField = ({input, label, meta, ...custom}) => (
    <TextField
        label={label}
        error={meta.touched && !!meta.error}
        helperText={meta.touched && meta.error}
        {...input}
        {...custom}
    />
);

//const validateRequired = value => typeof value === 'string' && value.trim() ? undefined : 'To pole jest wymagane';
const validateEmail = value => value && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? undefined : 'Niepoprawny email';

const validateRequired = value => (!value ? 'To pole jest wymagane' : undefined);

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
        // append any additional Redux form fields
        // create an AJAX request here with the created formData
        createProduct(fd);

        //alert(JSON.stringify(formProps, null, 4));
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

    resetForm = () => this.setState({imageFile: []}, () => this.props.reset());

    render = () => (
        <Form onSubmit={this.props.handleSubmit(this.handleFormSubmit)} encType="multipart/form-data">
            <Grid container spacing={24}>
                {this.props.inputKeys.reduce((acc, itemId) => {
                    const {label, type, validate, min, max} = this.props.inputs[itemId];
                    const validateFunctions = [];
                    let required = false;
                    validate.forEach(rule => {
                        switch (rule) {
                            case 'required':
                                validateFunctions.push(validateRequired);
                                required = true;
                                break;
                            case 'email':
                                validateFunctions.push(validateEmail);
                                break;
                            default:
                                throw Error('Unknown validation rule');
                        }
                    });
                    if (type === 'file') {
                        acc.push(
                            <Grid item xs={12} key={itemId}>
                                <Field
                                    name={itemId}
                                    component={DropZoneField}
                                    type="file"
                                    imagefile={this.state.imageFile}
                                    handleOnDrop={this.handleOnDrop}
                                    validate={[validateRequired]}
                                />
                            </Grid>
                        );
                    } else {
                        acc.push(
                            <Grid item xs={12} key={itemId}>
                                <Field
                                    name={itemId}
                                    component={renderTextField}
                                    label={label}
                                    fullWidth
                                    type={type}
                                    required={required}
                                    validate={validateFunctions}
                                    noValidate
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
                    disabled={false}
                    type="submit"
                >
                    Dodaj
                </Button>
            </div>

            <button
                type="button"
                className="uk-button uk-button-default uk-button-large clear"
                disabled={this.props.pristine || this.props.submitting}
                onClick={this.resetForm}
                style={{float: "right"}}
            >
                Clear
            </button>
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
