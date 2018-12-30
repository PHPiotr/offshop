import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import {setBuyerInputValue} from "../../../actions/buyer";

const BuyerForm = props => {
    const {inputKeys, inputs, setInputValue} = props;

    return (
        <Grid container spacing={24}>
            {inputKeys.reduce((acc, itemId) => {
                const {required, label, value, type} = inputs[itemId];
                if (type === 'hidden') {
                    return acc;
                }
                acc.push(
                    <Grid item xs={12} key={itemId}>
                        <TextField
                            required={required}
                            id={itemId}
                            name={itemId}
                            label={label}
                            fullWidth
                            value={value}
                            type={type}
                            onChange={setInputValue}
                        />
                    </Grid>
                );
                return acc;
            }, [])}
        </Grid>
    );
};

const mapStateToProps = state => ({
    inputKeys: state.buyer.ids,
    inputs: state.buyer.data,
});

const mapDispatchToProps = dispatch => ({
    setInputValue: ({target}) => {
        const {name, value} = target;
        dispatch(setBuyerInputValue(name, value));
    },
});

BuyerForm.propTypes = {
    inputKeys: PropTypes.array.isRequired,
    inputs: PropTypes.object.isRequired,
    setInputValue: PropTypes.func.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BuyerForm);
