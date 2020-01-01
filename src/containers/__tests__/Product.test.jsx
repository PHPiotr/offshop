import React, {Fragment} from 'react';
import thunk from 'redux-thunk';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import {waitForElement, fireEvent} from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Navigation from '../Navigation';
import Product from '../Product';
import appBar from '../../reducers/appBar';
import auth from '../../reducers/auth';
import cart from '../../reducers/cart';
import dialog from '../../reducers/dialog';
import product from '../../reducers/reducerProduct';
import {fakeLocalStorage, renderWithStore} from '../../helpers/testHelpers';

const productPayload = {
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
};

const mock = new MockAdapter(axios);
let store;

describe('Product', () => {

    beforeEach(() => {
        fakeLocalStorage();
        mock.reset();
        store = createStore(
            combineReducers({appBar, auth, cart, dialog, product}),
            applyMiddleware(thunk),
        );
        mock.onGet(/products/).replyOnce(200, productPayload);
    });

    it("should add item to cart", async () => {
        const {getByTestId, queryByTestId, queryByRole, getByRole} = await renderWithStore(<Fragment><Navigation/><Product/></Fragment>, store);
        const cartButton = getByTestId('cart-button');
        expect(cartButton).toBeDefined();
        const addToCartButton = await waitForElement(() => getByTestId(`add-to-cart-button-${productPayload.id}`));
        expect(queryByRole('dialog')).toBeNull();
        expect(queryByTestId('btn-continue')).toBeNull();
        expect(queryByTestId('btn-cart')).toBeNull();
        expect(addToCartButton).toBeDefined();
        expect(getByTestId('cart-badge').textContent).toBe('0');
        fireEvent.click(addToCartButton);
        const addedToCartDialog = await waitForElement(() => getByRole('dialog'));
        expect(addedToCartDialog).toBeDefined();
        expect(getByTestId('cart-badge').textContent).toBe('1');
        const continueShoppingButton = getByTestId('btn-continue');
        expect(continueShoppingButton).toBeDefined();
        fireEvent.click(continueShoppingButton);
        expect(queryByTestId('btn-continue')).toBeNull();
        expect(queryByRole('dialog')).toBeNull();
        fireEvent.click(addToCartButton);
        expect(getByRole('dialog')).toBeDefined();
        expect(getByTestId('cart-badge').textContent).toBe('2');
        const goToCartButton = getByTestId('btn-cart');
        expect(goToCartButton).toBeDefined();
        fireEvent.click(goToCartButton);
        expect(window.location.pathname).toBe('/cart');
    });

    it('should prevent from adding item to cart if the whole item stock already added', async () => {
        const {getByTestId, queryByTestId} = await renderWithStore(<Fragment><Navigation/><Product/></Fragment>, store);
        const addToCartButton = await waitForElement(() => getByTestId(`add-to-cart-button-${productPayload.id}`));
        let i = productPayload.stock;
        while (i--) {
            expect(getByTestId(`add-to-cart-button-${productPayload.id}`)).toBeDefined();
            fireEvent.click(addToCartButton);
            const continueShoppingButton = await waitForElement(() => getByTestId('btn-continue'));
            fireEvent.click(continueShoppingButton);
        }
        expect(queryByTestId(`add-to-cart-button-${productPayload.id}`)).toBeNull();
    });

});
