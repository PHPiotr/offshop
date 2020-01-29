import React, {Fragment} from 'react';
import thunk from 'redux-thunk';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import {waitForElement, fireEvent} from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Navigation from '../../../components/NavigationBar';
import Products from '../components/Products';
import NotificationBar from '../../../components/NotificationBar';
import auth from '../../../modules/Auth/reducer';
import {cart} from '../../../modules/ShoppingCart/reducer';
import dialog from '../../../reducers/dialog';
import notification from '../../../reducers/notification';
import {product, products} from '../reducer';

const productPayload = {
    active: true,
    stock: "5",
    images: [
        {
            avatar: "5da476864f651730df445456.avatar.jpg?abb63a0b73a1cc303570caed5ab39036",
            card: "5da476864f651730df445456.card.jpg?fc373385a066033dc2de08d152ffabd0",
            tile: "5da476864f651730df445456.tile.jpg?297aca95d06c26c3cf47fe98ce37c3c0",
        }
    ],
    description: "Lorem ipsum",
    longDescription: "Lorem ipsum",
    name: "Hello world",
    unitPrice: "35200",
    weight: "1200",
    slug: "hello-world",
    createdAt: "2020-01-01T13:22:14.129Z",
    updatedAt: "2020-01-01T13:22:14.636Z",
    id: "5da476864f651730df445457"
};

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
let store;

describe('Products', () => {

    beforeEach(() => {
        fakeLocalStorage();
        mock.reset();
        store = createStore(
            combineReducers({auth, cart, dialog, notification, product, products}),
            applyMiddleware(thunk),
        );
        mock.onGet(/products/).replyOnce(200, productsPayload);
        mock.onGet(`/products/${lastProduct.slug}`).replyOnce(200, lastProduct);
    });

    it('should render products list page and be able to enter product view page', async () => {
        const {getByText, getByTestId} = await renderWithStore(<Products/>, store);
        let i;
        let productLink;
        for (i = 0; i < productsLength; i++) {
            const currentProduct = productsPayload[i];
            productLink = await waitForElement(() => getByText(currentProduct.name));
            const productPrice = await waitForElement(() => getByText((currentProduct.unitPrice/100).toFixed(2)));
            const addToCartButton = await waitForElement(() => getByTestId(`add-to-cart-button-${currentProduct.id}`));
            expect(productLink).toBeDefined();
            expect(productPrice).toBeDefined();
            expect(addToCartButton).toBeDefined();
        }
        expect(i).toBe(productsLength);
        expect(productLink.text).toBe(lastProduct.name);
        fireEvent.click(productLink);
        expect(window.location.pathname).toBe(`/products/${lastProduct.slug}`);
    });

    it("should add item to cart", async () => {
        const {getByTestId, queryByTestId, queryByRole, getByRole} = await renderWithStore(<Fragment><Navigation/><Products/></Fragment>, store);
        const cartButton = getByTestId('cart-button');
        expect(cartButton).toBeDefined();
        const addToCartButton = await waitForElement(() => getByTestId(`add-to-cart-button-${productsPayload[0].id}`));
        expect(queryByRole('dialog')).toBeNull();
        expect(queryByTestId('btn-continue')).toBeNull();
        expect(queryByTestId('btn-cart')).toBeNull();
        expect(addToCartButton).toBeDefined();
        expect(getByTestId('cart-badge').textContent).toBe('0');
        fireEvent.click(addToCartButton);
        const addedToCartDialog = await waitForElement(() => getByRole('dialog'));
        expect(addedToCartDialog).toBeDefined();
        expect(getByTestId('cart-badge').textContent).toBe('1');
        const continueShoppingButton = await waitForElement(() => getByTestId('btn-continue'));
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
        const {getByTestId, queryByTestId} = await renderWithStore(<Fragment><Navigation/><Products/></Fragment>, store);
        const addToCartButton = await waitForElement(() => getByTestId(`add-to-cart-button-${lastProduct.id}`));
        let i = lastProduct.stock;
        while (i--) {
            expect(getByTestId(`add-to-cart-button-${lastProduct.id}`)).toBeDefined();
            fireEvent.click(addToCartButton);
            const continueShoppingButton = getByTestId('btn-continue');
            fireEvent.click(continueShoppingButton);
        }
        expect(queryByTestId(`add-to-cart-button-${lastProduct.id}`)).toBeNull();
    });

    describe('event listeners', () => {

        describe('createProduct', () => {

            const message = `Produkt ${productPayload.name} został dodany.`;

            it('should show notification message when created product IS active', async () => {
                const {getByText, queryByText} = await renderWithStore(<Fragment><Products/><NotificationBar /></Fragment>, store);
                expect(queryByText(message)).toBeNull();
                socket.socketClient.emit('createProduct', {product: productPayload, isActive: productPayload.active});
                expect(getByText(message)).toBeDefined();
            });

            it('should not show notification message when created product IS NOT active', async () => {
                const {queryByText} = await renderWithStore(<Fragment><Products/><NotificationBar /></Fragment>, store);
                expect(queryByText(message)).toBeNull();
                socket.socketClient.emit('createProduct', {product: productPayload, isActive: false});
                expect(queryByText(message)).toBeNull();
            });

        });

        describe('updateProduct', () => {

            const updatedProductMessage = `Produkt ${productPayload.name} został zmieniony.`;
            const deletedProductMessage = `Produkt ${productPayload.name} został usunięty.`;
            const createdProductMessage = `Produkt ${productPayload.name} został dodany.`;

            it('should show updated product notification message when updated product WAS active and IS active', async () => {
                const {getByText, queryByText} = await renderWithStore(<Fragment><Products/><NotificationBar /></Fragment>, store);
                expect(queryByText(updatedProductMessage)).toBeNull();
                socket.socketClient.emit('updateProduct', {product: productPayload, wasActive: true, isActive: true});
                expect(getByText(updatedProductMessage)).toBeDefined();
            });

            it('should show deleted product notification message when updated product WAS active and IS NOT active', async () => {
                const {getByText, queryByText} = await renderWithStore(<Fragment><Products/><NotificationBar /></Fragment>, store);
                expect(queryByText(deletedProductMessage)).toBeNull();
                socket.socketClient.emit('updateProduct', {product: productPayload, wasActive: true, isActive: false});
                expect(getByText(deletedProductMessage)).toBeDefined();
            });

            it('should show created product notification message when updated product WAS NOT active and IS active', async () => {
                const {getByText, queryByText} = await renderWithStore(<Fragment><Products/><NotificationBar /></Fragment>, store);
                expect(queryByText(createdProductMessage)).toBeNull();
                socket.socketClient.emit('updateProduct', {product: productPayload, wasActive: false, isActive: true});
                expect(getByText(createdProductMessage)).toBeDefined();
            });

            it('should not show any notification message when updated product WAS NOT active and IS NOT active', async () => {
                const {queryByText} = await renderWithStore(<Fragment><Products/><NotificationBar /></Fragment>, store);
                expect(queryByText(updatedProductMessage)).toBeNull();
                expect(queryByText(deletedProductMessage)).toBeNull();
                expect(queryByText(createdProductMessage)).toBeNull();
                socket.socketClient.emit('updateProduct', {product: productPayload, wasActive: false, isActive: false});
                expect(queryByText(updatedProductMessage)).toBeNull();
                expect(queryByText(deletedProductMessage)).toBeNull();
                expect(queryByText(createdProductMessage)).toBeNull();
            });

        });

        describe('deleteProduct', () => {

            const message = `Produkt ${productPayload.name} został usunięty.`;

            it('should show notification message when deleted product WAS active', async () => {
                const {getByText, queryByText, getByLabelText} = await renderWithStore(<Fragment><Products/><NotificationBar /></Fragment>, store);
                expect(queryByText(message)).toBeNull();
                socket.socketClient.emit('deleteProduct', {product: productPayload, wasActive: true});
                expect(getByText(message)).toBeDefined();
                const closeMessage = getByLabelText('Close');
                fireEvent.click(closeMessage);
                expect(queryByText(message)).toBeNull();
            });

            it('should not show notification message when deleted product WAS NOT active', async () => {
                const {queryByText} = await renderWithStore(<Fragment><Products/><NotificationBar /></Fragment>, store);
                expect(queryByText(message)).toBeNull();
                socket.socketClient.emit('deleteProduct', {product: productPayload, wasActive: false});
                expect(queryByText(message)).toBeNull();
            });

        });

    });

});
