export default (deliveryStep, deliveryStepPrice, deliveryUnitPrice, weight) => {
    const parseIntUnitPrice = parseInt(deliveryUnitPrice);
    if (!parseIntUnitPrice || Number.isNaN(parseIntUnitPrice)) {
        return 0;
    }
    const deliveryUnitPriceAsNumber = Number(deliveryUnitPrice);
    const step = deliveryStep * 100;
    if (step >= weight) {
        return deliveryUnitPriceAsNumber;
    }
    const stepsAmount = Math.ceil(weight / step);
    if (stepsAmount === 1) {
        return deliveryUnitPriceAsNumber;
    }
    const additionalCost = Number(deliveryStepPrice * (stepsAmount - 1));

    return Math.round(deliveryUnitPriceAsNumber + additionalCost);
};
