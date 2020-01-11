import React, {Fragment} from 'react';
import thunk from 'redux-thunk';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import {waitForElement, fireEvent} from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Navigation from '../../../components/Navigation';
import Cart from '../components/ShoppingCart';
import Products from '../../../modules/Products/components/Products';
import NotificationBar from '../../../components/NotificationBar';
import appBar from '../../../reducers/appBar';
import auth from '../../../reducers/auth';
import {cart} from '../reducer';
import dialog from '../../../reducers/dialog';
import notification from '../../../reducers/notification';
import {products} from '../../../modules/Products/reducer';
import {deliveryMethods} from '../../../modules/Delivery/reducer';
import io from '../../../io';
import MockedSocket from 'socket.io-mock';
let socket = new MockedSocket();
jest.mock('../../../io');
io.mockResolvedValue(socket);

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

const firstProduct = productsPayload[0];
const firstProductId = firstProduct.id;
const deliveryMethodsPayloadLength = deliveryMethodsPayload.length;;

const mock = new MockAdapter(axios);
let store;

describe('ShoppingCart', () => {

    beforeEach(() => {
        fakeLocalStorage();
        mock.reset();
        store = createStore(
            combineReducers({appBar, auth, cart, deliveryMethods, dialog, notification, products}),
            applyMiddleware(thunk),
        );
        mock.onGet(/delivery-methods/).replyOnce(200, deliveryMethodsPayload);
        mock.onGet(/products/).reply(200, productsPayload);
    });

    afterEach(async () => {
        await renderWithStore(null, store);
    });

    it('should render empty cart page', async () => {
        const {getByTestId} = await renderWithStore(<Cart/>, store);
        const emptyCart = getByTestId('empty-cart');
        expect(emptyCart).toBeDefined();
    });

    it('should increment/decrement/remove items in cart', async () => {
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

    it('should render delivery methods and require to choose one before checkout', async () => {
        const {getByTestId, getByText} = await renderWithStore(<Products/>, store);
        const addToCartButton = await waitForElement(() => getByTestId(`add-to-cart-button-${firstProductId}`));
        expect(addToCartButton).toBeDefined();
        fireEvent.click(addToCartButton);
        await renderWithStore(<Cart/>, store);
        let i = deliveryMethodsPayloadLength;
        let deliveryMethodRadio;
        const checkoutButton = await waitForElement(() => getByTestId('checkout-btn'));
        expect(checkoutButton.disabled).toBe(true);
        while(i--) {
            const currentDeliveryMethod = deliveryMethodsPayload[i];
            expect(await waitForElement(() => getByText(currentDeliveryMethod.name))).toBeDefined();
            expect(await waitForElement(() => getByText((currentDeliveryMethod.unitPrice * (store.getState().cart.weight / 100) / 100).toFixed(2)))).toBeDefined();
            deliveryMethodRadio = await waitForElement(() => getByTestId(`radio-btn-${currentDeliveryMethod.id}`));
            expect(deliveryMethodRadio).toBeDefined();
            expect(checkoutButton.disabled).toBe(true);
        }
        fireEvent.click(deliveryMethodRadio);
        expect(checkoutButton.disabled).toBe(false);
    });

    it('should adjust total price on delivery method change and on item amount increment/decrement', async () => {
        const {getByTestId} = await renderWithStore(<Products/>, store);
        const addToCartButton = await waitForElement(() => getByTestId(`add-to-cart-button-${firstProductId}`));
        expect(addToCartButton).toBeDefined();
        fireEvent.click(addToCartButton);
        await renderWithStore(<Cart/>, store);
        const totalPriceWithDelivery = await waitForElement(() => getByTestId('total-price-with-delivery'));
        expect(totalPriceWithDelivery.innerHTML).toBe((firstProduct.unitPrice / 100).toFixed(2));
        const productIncrementBtn = getByTestId(`increment-${firstProductId}`);
        const productDecrementBtn = getByTestId(`decrement-${firstProductId}`);
        let i = deliveryMethodsPayloadLength;
        while(i--) {
            const currentDeliveryMethod = deliveryMethodsPayload[i];
            const deliveryMethodRadio = await waitForElement(() => getByTestId(`radio-btn-${currentDeliveryMethod.id}`));
            fireEvent.click(deliveryMethodRadio);
            const totalForOneItem = (currentDeliveryMethod.unitPrice * (firstProduct.weight / 100) / 100 + firstProduct.unitPrice / 100).toFixed(2);
            const totalForTwoItems = (currentDeliveryMethod.unitPrice * (firstProduct.weight * 2 / 100) / 100 + firstProduct.unitPrice * 2 / 100).toFixed(2);
            const totalForThreeItems = (currentDeliveryMethod.unitPrice * (firstProduct.weight * 3 / 100) / 100 + firstProduct.unitPrice * 3 / 100).toFixed(2);
            expect(totalPriceWithDelivery.innerHTML).toBe(totalForOneItem);
            fireEvent.click(productIncrementBtn);
            expect(totalPriceWithDelivery.innerHTML).toBe(totalForTwoItems);
            fireEvent.click(productIncrementBtn);
            expect(totalPriceWithDelivery.innerHTML).toBe(totalForThreeItems);
            fireEvent.click(productDecrementBtn);
            expect(totalPriceWithDelivery.innerHTML).toBe(totalForTwoItems);
            fireEvent.click(productDecrementBtn);
            expect(totalPriceWithDelivery.innerHTML).toBe(totalForOneItem);
        }
    });

    describe('event listeners', () => {

        const productPayload = productsPayload[0];
        const deletedProductMessage = `Produkt ${productPayload.name} został usunięty.`;
        const updatedProductMessage = `Produkt ${productPayload.name} został zmieniony.`;

        describe('updateProduct', () => {

            test.each([
                [true, true, true, true, productPayload, updatedProductMessage],
                [false, true, true, false, {...productPayload, id: 'foo'}, updatedProductMessage],
                [false, true, true, false, {...productPayload, id: 'foo'}, deletedProductMessage],
                [true, true, true, true, {...productPayload, active: false}, deletedProductMessage],
                [true, true, true, true, {...productPayload, stock: 0}, deletedProductMessage],
            ])('should notify of product updated: %s if wasActive: %s, isActive: %s, item being viewed: %s', async (shouldShow, wasActive, isActive, isViewed, product, message) => {
                const {getByTestId, getByText, queryByText} = await renderWithStore(<Products/>, store);
                const addToCartButton = await waitForElement(() => getByTestId(`add-to-cart-button-${firstProductId}`));
                fireEvent.click(addToCartButton);
                await renderWithStore(<Fragment><Cart socket={socket}/><NotificationBar/></Fragment>, store);
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
                const addToCartButton = await waitForElement(() => getByTestId(`add-to-cart-button-${firstProductId}`));
                fireEvent.click(addToCartButton);
                await renderWithStore(<Fragment><Cart socket={socket}/><NotificationBar/></Fragment>, store);
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
