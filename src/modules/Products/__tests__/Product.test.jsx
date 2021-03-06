import React, {Fragment} from 'react';
import thunk from 'redux-thunk';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import {waitForElement, fireEvent, act} from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Navigation from '../../../components/NavigationBar';
import Product from '../../../modules/Products/components/Product';
import NotificationBar from '../../../components/NotificationBar';
import auth from '../../../modules/Auth/reducer';
import {cart} from '../../../modules/ShoppingCart/reducer';
import dialog from '../../../reducers/dialog';
import notification from '../../../reducers/notification';
import {product} from '../../../modules/Products/reducer';

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
        mock.reset();
        store = createStore(
            combineReducers({auth, cart, dialog, notification, product}),
            applyMiddleware(thunk),
        );
    });

    describe('response not found', () => {

        it('should display page not found', async () => {
            mock.onGet(/products/).replyOnce(404);
            const {getByText} = await renderWithStore(<Product/>, store);
            expect(await waitForElement(() => getByText('Request failed with status code 404'))).toBeDefined();
        });

    });

    describe('response error', () => {

        it('should display error page', async () => {
            mock.onGet(/products/).replyOnce(500);
            const {getByText} = await renderWithStore(<Product/>, store);
            expect(await waitForElement(() => getByText('Request failed with status code 500'))).toBeDefined();
        });

        it('should display error page', async () => {
            mock.onGet(/products/).networkErrorOnce();
            const {getByText} = await renderWithStore(<Product/>, store);
            expect(await waitForElement(() => getByText('Network Error'))).toBeDefined();
        });

    });

    describe('response ok', () => {

        beforeEach(() => {
            mock.onGet(/products.*/).reply(200, productPayload);
        });

        it("should render prodduct page and be able to add item to cart", async () => {
            const {getByTestId, queryByTestId, queryByRole, queryByText, getByRole, getByText, getByLabelText} = await renderWithStore(<Fragment><Navigation/><Product/></Fragment>, store);
            const cartButton = getByTestId('cart-button');
            expect(cartButton).toBeDefined();
            const addToCartButton = await waitForElement(() => getByTestId(`add-to-cart-button-${productPayload.id}`));
            const showMore = await waitForElement(() => getByLabelText('Pokaż więcej'));
            const showMenu = await waitForElement(() => getByLabelText('Pokaż menu'));
            fireEvent.click(showMore);
            expect(getByText(productPayload.longDescription)).toBeDefined();
            fireEvent.click(showMenu);
            const menuItem = getByText(`Waga: ${(productPayload.weight / 100).toFixed(2)} kg`);
            expect(menuItem).toBeDefined();
            fireEvent.click(menuItem);
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
                const continueShoppingButton = getByTestId('btn-continue');
                fireEvent.click(continueShoppingButton);
            }
            expect(queryByTestId(`add-to-cart-button-${productPayload.id}`)).toBeNull();
        });

        describe('event listeners', () => {

            const deletedProductMessage = `Produkt ${productPayload.name} został usunięty.`;

            describe('updateProduct', () => {

                const updatedProductMessage = `Produkt ${productPayload.name} został zmieniony.`;
                const createdProductMessage = `Produkt ${productPayload.name} został dodany.`;

                test.each([
                    [true, true, true, true, productPayload, updatedProductMessage],
                    [true, true, true, true, {...productPayload, slug: 'foo'}, updatedProductMessage],
                    [true, true, false, true, {...productPayload, active: false}, deletedProductMessage],
                    [true, false, true, true, productPayload, createdProductMessage],
                    [true, false, true, true, {...productPayload, slug: 'foo'}, createdProductMessage],
                    [false, false, false, true, {...productPayload, active: false}, updatedProductMessage],
                    [false, false, false, true, {...productPayload, active: false}, deletedProductMessage],
                    [false, false, false, true, {...productPayload, active: false}, createdProductMessage],
                    [false, true, true, false, {...productPayload, id: 'foo'}, updatedProductMessage],
                    [false, true, true, false, {...productPayload, id: 'foo'}, deletedProductMessage],
                    [false, true, true, false, {...productPayload, id: 'foo'}, createdProductMessage],
                    [false, true, false, false, {...productPayload, id: 'foo', active: false}, updatedProductMessage],
                    [false, true, false, false, {...productPayload, id: 'foo', active: false}, deletedProductMessage],
                    [false, true, false, false, {...productPayload, id: 'foo', active: false}, createdProductMessage],
                    [false, false, true, false, {...productPayload, id: 'foo'}, updatedProductMessage],
                    [false, false, true, false, {...productPayload, id: 'foo'}, deletedProductMessage],
                    [false, false, true, false, {...productPayload, id: 'foo'}, createdProductMessage],
                ])('should notify of product updated: %s if wasActive: %s, isActive: %s, item being viewed: %s', async (shouldShow, wasActive, isActive, isViewed, product, message) => {
                    const {getByText, queryByText} = await renderWithStore(<Fragment><Product product={productPayload}/><NotificationBar /></Fragment>, store);
                    expect(await waitForElement(() => getByText(productPayload.name))).toBeDefined();
                    expect(queryByText(message)).toBeNull();
                    act(() => socket.socketClient.emit('updateProduct', {product, wasActive, isActive}));
                    if (shouldShow) {
                        expect(await waitForElement(() => getByText(message))).toBeDefined();
                    } else {
                        expect(queryByText(message)).toBeNull();
                    }
                });

            });

            describe('deleteProduct', () => {

                test.each([
                    [true, true, true, productPayload],
                    [false, false, true, productPayload],
                    [false, true, false, {...productPayload, id: 'foo'}],
                    [false, false, false, {...productPayload, id: 'foo'}],
                ])('should notify of product deleted: %s if wasActive: %s, item being viewed: %s', async (shouldShow, wasActive, isViewed, product) => {
                    const {getByText, queryByText} = await renderWithStore(<Fragment><Product product={productPayload}/><NotificationBar /></Fragment>, store);
                    expect(await waitForElement(() => getByText(productPayload.name))).toBeDefined();
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

});
