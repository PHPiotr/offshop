import React, {Component} from 'react';
import {Typography} from '@material-ui/core';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {hasError: false};
    }

    static getDerivedStateFromError(error) {
        return {hasError: true};
    }

    componentDidCatch(error, errorInfo) {
        console.log('componentDidCatch', error, errorInfo);
        // You can also log the error to an error reporting service
        //logErrorToMyService(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <Typography component="h1">Coś poszło nie tak.</Typography>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
