import React, {Fragment} from 'react';
import thunk from 'redux-thunk';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import {cleanup, waitForElement, fireEvent} from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Navigation from '../Navigation';
import Cart from '../Cart';
import Products from '../Products';
import appBar from '../../reducers/appBar';
import auth from '../../reducers/auth';
import cart from '../../reducers/cart';
import deliveryMethods from '../../reducers/deliveryMethods';
import dialog from '../../reducers/dialog';
import products from '../../reducers/reducerProducts';
import {renderWithStore} from '../../helpers/testHelpers';

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

const mock = new MockAdapter(axios);
const store = createStore(
    combineReducers({appBar, auth, cart, deliveryMethods, dialog, products}),
    applyMiddleware(thunk),
);

describe('Cart', () => {

    beforeEach(() => {
        mock.reset();
        mock.onGet(/delivery-methods/).replyOnce(200, deliveryMethodsPayload);
        mock.onGet(/products/).reply(200, productsPayload);
    });

    afterEach(cleanup);

    it('should render empty cart page', async () => {
        const {getByTestId} = await renderWithStore(<Cart/>, store);
        const emptyCart = getByTestId('empty-cart');
        expect(emptyCart).toBeDefined();
    });

    it('should increment/decrement/remove items in cart', async () => {
        const firstProduct = productsPayload[0];
        const firstProductId = firstProduct.id;
        const {getByTestId} = await renderWithStore(<Products/>, store);
        const addToCartButton = await waitForElement(() => getByTestId(`add-to-cart-button-${firstProductId}`));
        expect(addToCartButton).toBeDefined();
        fireEvent.click(addToCartButton);
        const {queryByTestId} = await renderWithStore(<Fragment><Navigation/><Cart/></Fragment>, store);
        expect(queryByTestId('empty-cart')).toBeNull();
        const productLink = getByTestId(`link-${firstProductId}`);
        expect(productLink).toBeDefined();
        const productIncrementBtn = getByTestId(`increment-${firstProductId}`);
        expect(getByTestId('cart-badge').textContent).toBe('1');
        fireEvent.click(productIncrementBtn);
        expect(getByTestId('cart-badge').textContent).toBe('2');
        const productDecrementBtn = getByTestId(`decrement-${firstProductId}`);
        fireEvent.click(productDecrementBtn);
        expect(getByTestId('cart-badge').textContent).toBe('1');
        fireEvent.click(productDecrementBtn);
        expect(getByTestId('cart-badge').textContent).toBe('1');
        const firstItemStock = firstProduct.stock;
        let i = firstItemStock - 1;
        while(i--) {
            fireEvent.click(productIncrementBtn);
        }
        expect(getByTestId('cart-badge').textContent).toBe(firstItemStock);
        fireEvent.click(productIncrementBtn);
        expect(getByTestId('cart-badge').textContent).toBe(firstItemStock);
        const productRemoveBtn = getByTestId(`remove-${firstProductId}`);
        fireEvent.click(productRemoveBtn);
        expect(getByTestId('cart-badge').textContent).toBe('0');
    });

});
