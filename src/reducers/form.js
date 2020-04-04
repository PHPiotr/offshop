import {reducer as form} from 'redux-form';
import get from 'lodash.get';

export default form.plugin({
    product: (state, action) => {
        switch (action.type) {
            case '@@redux-form/INITIALIZE':
                return {...state, values: {...state.values, img: undefined}};
            case '@@redux-form/BLUR':
                if (!action.payload) {
                    return {
                        ...state,
                        values: {
                            ...state.values,
                            unitPrice: '',
                        },
                    };
                }
                if (`${action.payload}`.indexOf('.') === -1 && `${action.payload}`.indexOf(',') === -1) {
                    const unitPrice = parseInt(state.values.unitPrice, 10);

                    return {
                        ...state,
                        values: {
                            ...state.values,
                            unitPrice: unitPrice > 0 ? `${unitPrice}.00` : '',
                        },
                    };
                }

                const match = (get(state, 'values.unitPrice') || '0.00').match(/^\D*(\d*)\D*[.,]+\D*(\d*)\D*\.*$/);
                match.shift();
                const [integral, fractional] = match;
                let integer, fraction;

                if (integral.length === 0) {
                    integer = '00';
                } else {
                    integer = integral;
                }

                if (fractional.length === 1) {
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
            default:
                return state;
        }
    }
});
