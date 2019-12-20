import React, {Fragment} from 'react';
import thunk from 'redux-thunk';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import {waitForElement, fireEvent} from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Cart from '../Cart';
import Checkout from '../Checkout';
import Products from '../Products';
import appBar from '../../reducers/appBar';
import auth from '../../reducers/auth';
import buyer from '../../reducers/buyer';
import buyerDelivery from '../../reducers/buyerDelivery';
import cart from '../../reducers/cart';
import checkout from '../../reducers/checkout';
import deliveryMethods from '../../reducers/deliveryMethods';
import dialog from '../../reducers/dialog';
import form from '../../reducers/form';
import order from '../../reducers/order';
import products from '../../reducers/reducerProducts';
import {fakeLocalStorage, renderWithStore} from '../../helpers/testHelpers';

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
        unitPrice: "2999",
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

describe('Cart', () => {

    beforeEach(() => {
        fakeLocalStorage();
        mock.reset();
        store = createStore(
            combineReducers({
                appBar,
                auth,
                buyer,
                buyerDelivery,
                cart,
                checkout,
                deliveryMethods,
                dialog,
                form,
                order,
                products,
            }),
            applyMiddleware(thunk),
        );
        mock.onGet(/delivery-methods/).reply(200, deliveryMethodsPayload);
        mock.onGet(/products/).reply(200, productsPayload);
        mock.onPost(/authorize/).reply(200, authorizePayload);
        mock.onGet(/pay-methods/).reply(200, payMethodsPayload);
        mock.onPost(/orders/).reply(200, ordersPayload);
    });

    it('should render checkout page', async () => {
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
        const {getByText, getByTestId, queryByTestId} = await renderWithStore(<Products/>, store);
        const addToCartButton = await waitForElement(() => getByTestId(`add-to-cart-button-${productsPayload[0].id}`));
        fireEvent.click(addToCartButton);
        await renderWithStore(<Cart/>, store);
        const deliveryMethodRadio = await waitForElement(() => getByTestId(`radio-btn-${deliveryMethodsPayload[0].id}`));
        fireEvent.click(deliveryMethodRadio);
        await renderWithStore(<Checkout/>, store);
        let nextStepButton = queryByTestId('next-step-btn');
        expect(nextStepButton).toBeNull();
        const emailInput = getByTestId('email').getElementsByTagName('input')[0];
        fireEvent.change(emailInput, {target: {value: 'john.doe@example.com'}});
        expect(getByTestId('next-step-btn')).toBeDefined();
        fireEvent.change(emailInput, {target: {value: 'invalid email'}});
        expect(queryByTestId('next-step-btn')).toBeNull();
        fireEvent.change(emailInput, {target: {value: 'john.doe@example.com'}});
        nextStepButton = getByTestId('next-step-btn');
        fireEvent.click(nextStepButton);
        expect(queryByTestId('email')).toBeNull();
        const inputKeys = store.getState().buyerDelivery.ids;
        const inputs = store.getState().buyerDelivery.data;
        const requiredFields = [];
        inputKeys.forEach((key, idx) => {
            const currentInput = inputs[key];
            if (currentInput.validate.includes('required')) {
                requiredFields.push(key);
            }
            expect(getByText(currentInput.label)).toBeDefined();
        });
        requiredFields.forEach((key, idx) => {
            expect(queryByTestId('next-step-btn')).toBeNull();
            const requiredInput = getByTestId(key).getElementsByTagName('input')[0];
            fireEvent.change(requiredInput, {target: {value: 'foo'}});
        });
        nextStepButton = getByTestId('next-step-btn');
        fireEvent.click(nextStepButton);
        const googlePayBtn = await waitForElement(() => getByTestId(`pay-button-${payMethodsPayload.payByLinks[0].value}`));
        const cardPayBtn = await waitForElement(() => getByTestId(`pay-button-${payMethodsPayload.payByLinks[1].value}`));
        fireEvent.click(googlePayBtn);
    });

});