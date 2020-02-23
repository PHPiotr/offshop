import React, {Fragment} from 'react';
import thunk from 'redux-thunk';
import {createStore, applyMiddleware} from 'redux';
import {waitForElement, fireEvent} from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Cart from '../../../modules/ShoppingCart/components/ShoppingCart';
import Checkout from '../components/Checkout';
import Order from '../../../modules/Orders/components/Order';
import Products from '../../../modules/Products/components/Products';
import NotificationBar from '../../../components/NotificationBar';
import reducers from '../../../reducers';
import App from '../../../App';
import PaymentContext from '../../../contexts/PaymentContext';

const paymentContextData = {
    src: 'http://example.com/front/widget/js/payu-bootstrap.js',
    currencyCode: 'PLN',
    customerLanguage: 'pl',
    merchantPosId: '13456',
    shopName: 'Offshop',
    secondKeyMd5: '134567890qwertyuiopasdfhjklzxcbn',
    payuBrand: 'true',
    payButton: '#pay-button',
    recurringPayment: 'false',
    storeCard: 'false',
    widgetMode: 'pay',
    googlePayScriptId: 'google-pay-script',
    googlePayButtonParentId: 'google-pay-btn-wrapper',
    googlePayScriptSrc: 'http://example.com/gp/p/js/pay.js',
    environment: 'TEST',
    apiVersion: 2,
    apiVersionMinor: 0,
    baseCardPaymentMethodType: 'CARD',
    baseCardPaymentMethodAllowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
    baseCardPaymentMethodAllowedCardNetworks: ['MASTERCARD', 'VISA'],
    tokenizationSpecificationType: 'PAYMENT_GATEWAY',
    tokenizationSpecificationGateway: 'payu',
    tokenizationSpecificationGatewayMerchantId: '123456',
    merchantName: 'Offshop',
    totalPriceStatus: 'FINAL',
    googlePayMethodValue: 'ap',
    googlePayMethodType: 'PBL',
};

const deliveryMethodsPayload = [
    {
        id: "5c7dca6a0c37236da9232f9d",
        name: "Foo",
        slug: "foo",
        unitPrice: "1999",
        createdAt: "2019-03-05T01:01:30.486Z",
        updatedAt: "2019-10-10T21:23:01.106Z",
        active: true,
    },
    {
        id: "5cd6be587732b1ba409678b2",
        name: "Bar",
        slug: "bar",
        unitPrice: "0",
        createdAt: "2019-05-11T12:21:44.173Z",
        updatedAt: "2019-10-10T21:28:58.547Z",
        active: true,
    },
];

const productsPayload = [
    {
        active: true,
        stock: "29",
        images: [
            {
                avatar: "5da476864f651730df445456.avatar.jpg?abb63a0b73a1cc303570caed5ab39036",
                card: "5da476864f651730df445456.card.jpg?fc373385a066033dc2de08d152ffabd0",
                tile: "5da476864f651730df445456.tile.jpg?297aca95d06c26c3cf47fe98ce37c3c0",
            }
        ],
        description: "Rerum officia irure",
        longDescription: "Et sed cillum eiusmo",
        name: "Aaron Reese",
        unitPrice: "45100",
        weight: "2700",
        slug: "aaron-reese",
        createdAt: "2019-10-14T13:22:14.129Z",
        updatedAt: "2019-10-14T13:22:14.636Z",
        id: "5da476864f651730df445456"
    },
    {
        active: true,
        stock: "91",
        images: [{
            avatar: "5da5c9d24f651730df44545e.avatar.jpg?82c368ccdfc68ca2855b3cd78acfcbb2",
            card: "5da5c9d24f651730df44545e.card.jpg?c6afbd96a8053a416dac3049f26f33ce",
            tile: "5da5c9d24f651730df44545e.tile.jpg?ff23fd6a259cc3d463413ce026d5d514",
        }],
        description: "Adipisicing mollit u",
        longDescription: "Est dolore error sin",
        name: "Valentine Michael",
        unitPrice: "92900",
        weight: "4000",
        slug: "valentine-michael",
        createdAt: "2019-10-15T13:29:54.991Z",
        updatedAt: "2019-10-15T13:29:55.546Z",
        id: "5da5c9d24f651730df44545e"
    }
];

const payMethodsPayload = {
    cardTokens: [],
    pexTokens: [],
    payByLinks: [
        {
            value: 'ap',
            brandImageUrl: 'https://static.payu.com/images/mobile/logos/pbl_ap.png',
            name: 'Google Pay',
            status: 'ENABLED',
            minAmount: 50,
            maxAmount: 9999999,
        },
        {
            value: 'c',
            brandImageUrl: 'https://static.payu.com/images/mobile/logos/pbl_c.png',
            name: 'Płatność online kartą płatniczą',
            status: 'ENABLED',
            minAmount: 1,
            maxAmount: 99999999,
        },
    ],
};

const authorizePayload = {
    access_token: 'foo',
    token_type: 'bearer',
    expires_in: 3600,
    grant_type: 'client_credentials',
};

const ordersPayload = {
    extOrderId: 'foo',
    redirectUri: '',
};

const mock = new MockAdapter(axios);
let store;

describe('Checkout', () => {

    beforeEach(() => {
        mock.reset();
        store = createStore(
            reducers,
            applyMiddleware(thunk),
        );
        mock.onGet(/delivery-methods/).reply(200, deliveryMethodsPayload);
        mock.onGet(/products/).reply(200, productsPayload);
        mock.onPost(/authorize/).reply(200, authorizePayload);
    });

    describe('pay methods failure', () => {

        it('should show error notification if fetching pay methods fail', async () => {
            mock.onGet(/pay-methods/).networkErrorOnce();
            const {getByTestId, getByText} = await renderWithRouter(<PaymentContext.Provider value={paymentContextData}><App/></PaymentContext.Provider>, store);
            fireEvent.click(await waitForElement(() => getByTestId(`add-to-cart-button-${productsPayload[0].id}`)));
            fireEvent.click(getByText('Przejdź do koszyka'));
            fireEvent.click(await waitForElement(() => getByTestId(`radio-btn-${deliveryMethodsPayload[1].id}`)));
            fireEvent.click(getByText('Dalej'));
            fireEvent.change(getByTestId('email').getElementsByTagName('input')[0], {target: {value: 'john.doe@example.com'}});
            fireEvent.click(getByTestId('next-step-btn'));
            expect(await waitForElement(() => getByText('Network Error'))).toBeDefined();
        });

    });

    describe('createOrderRequest ok with redirectUri', () => {

        it('should redirect', async () => {
            mock.onGet(/pay-methods/).reply(200, payMethodsPayload);
            mock.onPost(/orders/).reply(200, {...ordersPayload, redirectUri: window.location.origin + '/products'});
            const {getByTestId, getByText} = await renderWithStore(<Products/>, store);
            const addToCartButton = await waitForElement(() => getByTestId(`add-to-cart-button-${productsPayload[0].id}`));
            fireEvent.click(addToCartButton);
            await renderWithStore(<Cart/>, store);
            const deliveryMethodRadio = await waitForElement(() => getByTestId(`radio-btn-${deliveryMethodsPayload[1].id}`));
            fireEvent.click(deliveryMethodRadio);
            await renderWithRouter(<PaymentContext.Provider value={paymentContextData}><Checkout/></PaymentContext.Provider>, store, {
                route: '/checkout',
            });
            const emailInput = getByTestId('email').getElementsByTagName('input')[0];
            fireEvent.change(emailInput, {target: {value: 'john.doe@example.com'}});
            fireEvent.click(getByTestId('next-step-btn'));
            const cardPayBtn = await waitForElement(() => getByTestId(`pay-button-${payMethodsPayload.payByLinks[1].value}`));
            fireEvent.click(cardPayBtn);
            expect(await waitForElement(() => getByText(productsPayload[0].name))).toBeDefined();
        });

    });

    describe('createOrderRequest ok', () => {

        it('should render checkout page', async () => {
            mock.onGet(/pay-methods/).reply(200, payMethodsPayload);
            mock.onPost(/orders/).reply(200, ordersPayload);
            const {getByTestId, getByText} = await renderWithStore(<Products/>, store);
            const addToCartButton = await waitForElement(() => getByTestId(`add-to-cart-button-${productsPayload[0].id}`));
            fireEvent.click(addToCartButton);
            await renderWithStore(<Cart/>, store);
            const deliveryMethodRadio = await waitForElement(() => getByTestId(`radio-btn-${deliveryMethodsPayload[0].id}`));
            fireEvent.click(deliveryMethodRadio);
            await renderWithStore(<Checkout/>, store);
            const inputKeys = store.getState().buyer.ids;
            const inputs = store.getState().buyer.data;
            let i = inputKeys.length;
            while (i--) {
                expect(getByText(inputs[inputKeys[i]].label)).toBeDefined();
            }
        });

        it('should prevent from proceeding to next step before filling required fields', async () => {
            mock.onGet(/pay-methods/).reply(200, payMethodsPayload);
            mock.onPost(/orders/).reply(200, ordersPayload);
            const {getByText, getByTestId, queryByText, queryByTestId} = await renderWithStore(<Products/>, store);
            const addToCartButton = await waitForElement(() => getByTestId(`add-to-cart-button-${productsPayload[0].id}`));
            fireEvent.click(addToCartButton);
            await renderWithStore(<Cart/>, store);
            const deliveryMethodRadio = await waitForElement(() => getByTestId(`radio-btn-${deliveryMethodsPayload[0].id}`));
            fireEvent.click(deliveryMethodRadio);
            await renderWithStore(<><PaymentContext.Provider value={paymentContextData}><Checkout/></PaymentContext.Provider><NotificationBar/></>, store);
            let nextStepButton = queryByTestId('next-step-btn');
            expect(nextStepButton).toBeNull();
            const emailInput = getByTestId('email').getElementsByTagName('input')[0];
            fireEvent.change(emailInput, {target: {value: 'invalid_email'}});
            fireEvent.blur(emailInput);
            expect(getByText('Niepoprawny email')).toBeDefined();
            fireEvent.change(emailInput, {target: {value: 'john.doe@example.com'}});
            expect(queryByText('Niepoprawny email')).toBeNull();
            expect(getByTestId('next-step-btn')).toBeDefined();
            fireEvent.change(emailInput, {target: {value: 'invalid email'}});
            expect(queryByTestId('next-step-btn')).toBeNull();
            fireEvent.change(emailInput, {target: {value: 'john.doe@example.com'}});
            fireEvent.click(getByText('Wróć'));
            fireEvent.click(getByTestId('next-step-btn'));
            expect(queryByTestId('email')).toBeNull();
            fireEvent.click(getByText('Wróć'));
            expect(getByTestId('email')).toBeDefined();
            fireEvent.click(getByTestId('next-step-btn'));
            const prevStepBtn = getByTestId('step-btn');
            fireEvent.click(prevStepBtn);
            expect(getByTestId('email')).toBeDefined();
            fireEvent.click(getByTestId('next-step-btn'));
            expect(queryByTestId('email')).toBeNull();
            const inputKeys = store.getState().buyerDelivery.ids;
            const inputs = store.getState().buyerDelivery.data;
            const requiredFields = [];
            inputKeys.forEach(key => {
                const currentInput = inputs[key];
                if (currentInput.validate.includes('required')) {
                    requiredFields.push(key);
                }
                expect(getByText(currentInput.label)).toBeDefined();
            });
            requiredFields.forEach((key, idx) => {
                expect(queryByTestId('next-step-btn')).toBeNull();
                const requiredInput = getByTestId(key).getElementsByTagName('input')[0];
                fireEvent.change(requiredInput, {target: {value: ''}});
                fireEvent.blur(requiredInput);
                expect(getByText('To pole jest wymagane')).toBeDefined();
                fireEvent.change(requiredInput, {target: {value: 'foo'}});
                expect(queryByText('To pole jest wymagane')).toBeNull();
            });
            nextStepButton = getByTestId('next-step-btn');
            fireEvent.click(nextStepButton);
            const googlePayBtn = await waitForElement(() => getByTestId(`pay-button-${payMethodsPayload.payByLinks[0].value}`));
            const cardPayBtn = await waitForElement(() => getByTestId(`pay-button-${payMethodsPayload.payByLinks[1].value}`));
            const buttons = [cardPayBtn, googlePayBtn];
            socket.socketClient.emit('updateProduct', {product: {...productsPayload[0], unitPrice: '45200'}});
            expect(await waitForElement(() => getByText(`Produkt ${productsPayload[0].name} został zmieniony.`))).toBeDefined();
            expect(getByText('452.00')).toBeDefined();
            for (let i = 0; i < 2; i++) {
                fireEvent.click(buttons[i]);
                await renderWithStore(<Order/>, store);
            }
        });

        describe('event listeners', () => {

            const productPayload = productsPayload[0];

            const deletedProductMessage = `Produkt ${productPayload.name} został usunięty.`;
            const updatedProductMessage = `Produkt ${productPayload.name} został zmieniony.`;

            beforeEach(() => {
                mock.onGet(/pay-methods/).reply(200, payMethodsPayload);
                mock.onPost(/orders/).reply(200, ordersPayload);
            });

            describe('updateProduct', () => {

                test.each([
                    [true, true, true, true, productPayload, updatedProductMessage],
                    [false, true, true, false, {...productPayload, id: 'foo'}, updatedProductMessage],
                    [false, true, true, false, {...productPayload, id: 'foo'}, deletedProductMessage],
                    [true, true, true, true, {...productPayload, active: false}, deletedProductMessage],
                    [true, true, true, true, {...productPayload, stock: 0}, deletedProductMessage],
                ])('should notify of product updated: %s if wasActive: %s, isActive: %s, item being viewed: %s', async (shouldShow, wasActive, isActive, isViewed, product, message) => {
                    const {getByTestId, getByText, queryByText} = await renderWithStore(<Products/>, store);
                    const addToCartButton = await waitForElement(() => getByTestId(`add-to-cart-button-${productsPayload[0].id}`));
                    fireEvent.click(addToCartButton);
                    await renderWithStore(<Cart/>, store);
                    const deliveryMethodRadio = await waitForElement(() => getByTestId(`radio-btn-${deliveryMethodsPayload[0].id}`));
                    fireEvent.click(deliveryMethodRadio);
                    socket.removeAllListeners('updateProduct');
                    await renderWithStore(<Fragment><Checkout/><NotificationBar/></Fragment>, store);
                    expect(queryByText(message)).toBeNull();
                    socket.socketClient.emit('updateProduct', {product, wasActive, isActive});
                    if (shouldShow) {
                        expect(getByText(message)).toBeDefined();
                    } else {
                        expect(queryByText(message)).toBeNull();
                    }
                });

            });

            describe('deleteProduct', () => {

                test.each([
                    [true, true, true, productPayload],
                    [false, true, false, {...productPayload, id: 'foo'}],
                ])('should notify of product deleted: %s if wasActive: %s, item being viewed: %s', async (shouldShow, wasActive, isViewed, product) => {
                    const {getByTestId, getByText, queryByText} = await renderWithStore(<Products/>, store);
                    const addToCartButton = await waitForElement(() => getByTestId(`add-to-cart-button-${productsPayload[0].id}`));
                    fireEvent.click(addToCartButton);
                    await renderWithStore(<Cart/>, store);
                    const deliveryMethodRadio = await waitForElement(() => getByTestId(`radio-btn-${deliveryMethodsPayload[0].id}`));
                    fireEvent.click(deliveryMethodRadio);
                    socket.removeAllListeners('deleteProduct');
                    await renderWithStore(<Fragment><Checkout/><NotificationBar/></Fragment>, store);
                    expect(queryByText(deletedProductMessage)).toBeNull();
                    socket.socketClient.emit('deleteProduct', {product, wasActive});
                    if (shouldShow) {
                        expect(getByText(deletedProductMessage)).toBeDefined();
                    } else {
                        expect(queryByText(deletedProductMessage)).toBeNull();
                    }
                });

            });

        });

    });

    describe('createOrderRequest error', () => {

        it('should display error notification when create order fails', async () => {
            mock.onGet(/pay-methods/).reply(200, payMethodsPayload);
            mock.onPost(/orders/).networkErrorOnce();
            const {getByTestId, getByText} = await renderWithRouter(<PaymentContext.Provider value={paymentContextData}><App/></PaymentContext.Provider>, store);
            const addToCartButton = await waitForElement(() => getByTestId(`add-to-cart-button-${productsPayload[0].id}`));
            fireEvent.click(addToCartButton);
            fireEvent.click(getByText('Przejdź do koszyka'));
            const deliveryMethodRadio = await waitForElement(() => getByTestId(`radio-btn-${deliveryMethodsPayload[1].id}`));
            fireEvent.click(deliveryMethodRadio);
            fireEvent.click(getByText('Dalej'));
            const emailInput = getByTestId('email').getElementsByTagName('input')[0];
            fireEvent.change(emailInput, {target: {value: 'john.doe@example.com'}});
            fireEvent.click(await waitForElement(() => getByTestId('next-step-btn')));
            fireEvent.click(await waitForElement(() => getByTestId(`pay-button-${payMethodsPayload.payByLinks[1].value}`)));
            expect(await waitForElement(() => getByText('Network Error'))).toBeDefined();
        });
    });

});
