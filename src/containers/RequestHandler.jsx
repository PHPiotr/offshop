import React, {Component} from 'react';
import ErrorHandler from './ErrorHandler';

class RequestHandler extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            response: {},
        };
    }

    componentDidMount() {
        const {action} = this.props;
        if (!action) {
            return;
        }
        const that = this;
        that.setState({
            loading: true,
            response: {},
        });
        return action()
            .then(response => {
                that.setState({
                    loading: false,
                    response,
                });
            }).catch(error => {
                that.setState({
                    loading: false,
                    response: error.response,
                });
            });
    }

    render() {
        const {children} = this.props;
        return <ErrorHandler {...this.state}>{children(this.state)}</ErrorHandler>;
    }

}

export default RequestHandler;
