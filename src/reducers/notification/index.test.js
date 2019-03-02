import * as actions from '../../actions/notification';
import * as types from '../../actions/notification/types';

describe('actions', () => {
    it('should create an action to show notification', () => {
        const payload = {
            message: 'Hello world',
        };
        const expectedAction = {
            type: types.SHOW_NOTIFICATION,
            payload,
        };
        expect(actions.showNotification(payload)).toEqual(expectedAction);
    });

    it('should create an action to hide notification', () => {
        const expectedAction = {
            type: types.HIDE_NOTIFICATION,
        };
        expect(actions.hideNotification()).toEqual(expectedAction);
    });
});
