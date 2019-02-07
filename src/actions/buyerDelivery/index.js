export const SET_BUYER_DELIVERY_INPUT_VALUE = 'SET_BUYER_DELIVERY_INPUT_VALUE';
export const BUYER_DELIVERY_SKIPPED = 'BUYER_DELIVERY_SKIPPED';
export const BUYER_DELIVERY_REQUIRED = 'BUYER_DELIVERY_REQUIRED';

export const skipBuyerDeliveryStep = () => ({
    type: BUYER_DELIVERY_SKIPPED,
});

export const requireBuyerDeliveryStep = () => ({
    type: BUYER_DELIVERY_REQUIRED,
});
