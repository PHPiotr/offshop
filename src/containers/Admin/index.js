import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

class Admin extends Component {

    componentDidMount() {

    }

    render() {
        return (
            <div>
                <Link to="/logout">Logout</Link>
            </div>
        );
    }
}

export default connect()(Admin);