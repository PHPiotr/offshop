import React, {Fragment} from 'react';
import thunk from 'redux-thunk';
import {createStore, applyMiddleware} from 'redux';
import {waitForElement, fireEvent} from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import reducers from '../../../reducers';
import App from '../../../App';

const dispatchMessageEvent = () => {
    window.PayU = {
        Merchant: {
            sig: '3c1370c962f171c328b87364a4e31a32031ccbd9b1a817f96a528968f5be64c1',
        },
    };
    window.dispatchEvent(new MessageEvent('message', {
        data: {
            service: 'MerchantService',
            message: {
                data: {
                    value: 'foo',
                    type: 'bar',
                },
            },
        },
    }));
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

describe('PayU Express', () => {

    beforeEach(() => {
        fakeLocalStorage();
        mock.reset();
        store = createStore(
            reducers,
            applyMiddleware(thunk),
        );
        mock.onGet(/delivery-methods/).reply(200, deliveryMethodsPayload);
        mock.onPost(/authorize/).reply(200, authorizePayload);
    });

    it('should create order via payu express widget', async () => {
        mock.onGet(/pay-methods/).replyOnce(200, payMethodsPayload);
        mock.onPost(/orders/).replyOnce(200, ordersPayload);
        mock.onGet(/\//).replyOnce(200, productsPayload);
        const {getByText, getByTestId, queryByTestId} = await renderWithRouter(<App/>, store);
        fireEvent.click(await waitForElement(() => getByTestId(`add-to-cart-button-${productsPayload[0].id}`)));
        fireEvent.click(getByText('Przejdź do koszyka'));
        fireEvent.click(await waitForElement(() => getByTestId(`radio-btn-${deliveryMethodsPayload[1].id}`)));
        fireEvent.click(getByText('Dalej'));
        let nextStepButton = queryByTestId('next-step-btn');
        expect(nextStepButton).toBeNull();
        fireEvent.change(getByTestId('email').getElementsByTagName('input')[0], {target: {value: 'john.doe@example.com'}});
        fireEvent.click(getByTestId('next-step-btn'));
        const payuExpressBtn = await waitForElement(() => getByTestId('payu-express-btn'));
        fireEvent.click(payuExpressBtn);
        dispatchMessageEvent();
        //expect(await waitForElement(() => getByText(/Dziękujemy/))).toBeDefined();
        mock.onPost(/orders/).networkErrorOnce();
        dispatchMessageEvent();
        expect(await waitForElement(() => getByText('Network Error'))).toBeDefined();
    });

});
