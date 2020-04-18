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
                            stepPrice: '',
                        },
                    };
                }
                if (`${action.payload}`.indexOf('.') === -1 && `${action.payload}`.indexOf(',') === -1) {
                    const unitPrice = parseInt(state.values.unitPrice, 10);
                    const stepPrice = parseInt(state.values.stepPrice, 10);

                    return {
                        ...state,
                        values: {
                            ...state.values,
                            unitPrice: unitPrice > 0 ? `${unitPrice}.00` : '',
                            stepPrice: stepPrice > 0 ? `${stepPrice}.00` : '',
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

                const matchStepPrice = (get(state, 'values.stepPrice') || '0.00').match(/^\D*(\d*)\D*[.,]+\D*(\d*)\D*\.*$/);
                matchStepPrice.shift();
                const [integralStepPrice, fractionalStepPrice] = matchStepPrice;
                let integerStepPrice, fractionStepPrice;

                if (integralStepPrice.length === 0) {
                    integerStepPrice = '00';
                } else {
                    integerStepPrice = integralStepPrice;
                }

                if (fractionalStepPrice.length === 1) {
                    fractionStepPrice = `${fractionalStepPrice}0`;
                } else {
                    fractionStepPrice = fractionalStepPrice.substring(0, 2);
                }
                const stepPrice = `${integerStepPrice}.${fractionStepPrice}`;

                return {
                    ...state,
                    values: {
                        ...state.values,
                        unitPrice: unitPrice > 0 ? unitPrice : '',
                        stepPrice: stepPrice > 0 ? stepPrice : '',
                    },
                };
            default:
                return state;
        }
    }
});
