import {reducer as form} from 'redux-form';

export default form.plugin({
    product: (state, action) => {
        switch (action.type) {
            case '@@redux-form/FOCUS':
                if (action.meta && state.values && action.meta.field === 'price') {
                    // return {
                    //     ...state,
                    //     values: {
                    //         ...state.values,
                    //         price: state.values.price ? state.values.price.substring(0, state.values.price.indexOf('.')) : state.values.price,
                    //     },
                    // };
                }
                return state;

            case '@@redux-form/BLUR':
                if (action.meta && state.values && state.values.price && action.meta.field === 'price') {

                    if (action.payload.indexOf('.') === -1) {
                        const price = parseInt(state.values.price, 10);
                        return {
                            ...state,
                            values: {
                                ...state.values,
                                price: price > 0 ? `${price}.00` : '00.00',
                            },
                        };
                    }

                    const match = state.values.price.match(/^\D*(\d*)\D*\.\D*(\d*)\D*\.*$/);
                    if (match) {
                        const [_, integral, fractional] = match;
                        let integer, fraction;

                        if (integral.length === 0) {
                            integer = '00';
                        } else {
                            integer = integral;
                        }

                        if (fractional.length === 0) {
                            fraction = `${fractional}00`;
                        } else if (fractional.length === 1) {
                            fraction = `${fractional}0`;
                        } else {
                            fraction = fractional.substring(0, 2);
                        }
                        return {
                            ...state,
                            values: {
                                ...state.values,
                                price: `${integer}.${fraction}`,
                            },
                        };
                    }
                }
                return state;

            default:
                return state;
        }
    }
});
