import {reducer as form} from 'redux-form';

export default form.plugin({
    product: (state, action) => {
        switch (action.type) {
            case '@@redux-form/RESET':
                return undefined;
            case '@@redux-form/BLUR':
                if (!action.meta || !state.values || !state.values.unitPrice || action.meta.field !== 'unitPrice') {
                    return state;
                }
                if (action.payload.indexOf('.') === -1 && action.payload.indexOf(',') === -1) {
                    const unitPrice = parseInt(state.values.unitPrice, 10);

                    return {
                        ...state,
                        values: {
                            ...state.values,
                            unitPrice: unitPrice > 0 ? `${unitPrice}.00` : '',
                        },
                    };
                }

                const match = state.values && state.values.unitPrice.match(/^\D*(\d*)\D*[.,]+\D*(\d*)\D*\.*$/);
                if (match) {
                    match.shift();
                    const [integral, fractional] = match;
                    let integer, fraction;

                    if (integral.length === 0) {
                        integer = '00';
                    } else {
                        integer = integral;
                    }

                    if (fractional.length === 0) {
                        fraction = `00`;
                    } else if (fractional.length === 1) {
                        fraction = `${fractional}0`;
                    } else {
                        fraction = fractional.substring(0, 2);
                    }
                    const unitPrice = `${integer}.${fraction}`;
                    return {
                        ...state,
                        values: {
                            ...state.values,
                            unitPrice: unitPrice > 0 ? unitPrice : '',
                        },
                    };
                }
                return state;
            default:
                return state;
        }
    }
});
