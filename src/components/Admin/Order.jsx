import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {getAdminOrderIfNeeded} from '../../actions/admin/order';

const Order = props => {
    useEffect(() => {
        if (props.match.params.id) {
            props.getAdminOrderIfNeeded(props.match.params.id);
        }
    }, [props.match.params.id]);
    return <h1>hello</h1>
};

const mapStateToProps = state => ({
    data: state.adminOrder.data[state.adminOrder.id],
});
const mapDispatchToProps = {
    getAdminOrderIfNeeded,
};

Order.propTypes = {
    getAdminOrderIfNeeded: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Order);
