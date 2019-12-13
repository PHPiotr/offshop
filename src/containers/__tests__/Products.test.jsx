import React from 'react';
import thunk from 'redux-thunk';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import {cleanup, waitForElement, fireEvent} from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Products from '../Products';
import cart from '../../reducers/cart';
import dialog from '../../reducers/dialog';
import products from '../../reducers/reducerProducts';
import {renderWithStore} from '../../helpers/testHelpers';

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
const productsLength = productsPayload.length;
const lastProduct = productsPayload[productsLength - 1];

const mock = new MockAdapter(axios);
const store = createStore(
    combineReducers({cart, dialog, products}),
    applyMiddleware(thunk),
);

describe('Products container', () => {

    beforeEach(() => {
        mock.reset();
        mock.onGet(/products/).replyOnce(200, productsPayload);
        mock.onGet(`/products/${lastProduct.slug}`).replyOnce(200, lastProduct);
    });

    afterEach(cleanup);

    it('should render products list page and be able to enter product view page', async () => {
        const node = await renderWithStore(<Products/>, store);
        const {getByText} = node;
        let i;
        let productLink;
        for (i = 0; i < productsLength; i++) {
            productLink = await waitForElement(() => getByText(productsPayload[i].name));
            expect(productLink).toBeDefined();
        }
        expect(i).toBe(productsLength);
        expect(productLink.text).toBe(lastProduct.name);
        fireEvent.click(productLink);
        expect(window.location.pathname).toBe(`/products/${lastProduct.slug}`);
    });

    it("should add item to cart", async () => {
        const {getByTestId, queryByTestId, queryByRole, getByRole} = await renderWithStore(<Products/>, store);
        const addToCartButton = await waitForElement(() => getByTestId(`add-to-cart-button-${productsPayload[0].id}`));
        expect(queryByRole('dialog')).toBeNull();
        expect(queryByTestId('btn-continue')).toBeNull();
        expect(queryByTestId('btn-cart')).toBeNull();
        expect(addToCartButton).toBeDefined();
        expect(store.getState().cart.quantity).toBe(0);
        fireEvent.click(addToCartButton);
        const addedToCartDialog = await waitForElement(() => getByRole('dialog'));
        expect(addedToCartDialog).toBeDefined();
        expect(store.getState().cart.quantity).toBe(1);
        const continueShoppingButton = await waitForElement(() => getByTestId('btn-continue'));
        expect(continueShoppingButton).toBeDefined();
        fireEvent.click(continueShoppingButton);
        expect(queryByTestId('btn-continue')).toBeNull();
        expect(queryByRole('dialog')).toBeNull();
        fireEvent.click(addToCartButton);
        expect(getByRole('dialog')).toBeDefined();
        expect(store.getState().cart.quantity).toBe(2);
        const goToCartButton = getByTestId('btn-cart');
        expect(goToCartButton).toBeDefined();
        fireEvent.click(goToCartButton);
        expect(window.location.pathname).toBe('/cart');
    });

});
