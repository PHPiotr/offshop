import React, { Component, Fragment } from 'react';
import SubHeader from '../../components/SubHeader';
import LoginForm from '../../components/LoginForm';
import Paper from '@material-ui/core/Paper/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
const styles = theme => ({
    paper: {
        marginTop: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 3,
        padding: theme.spacing.unit * 2,
        [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
            marginTop: 0,
            marginBottom: 0,
            padding: theme.spacing.unit * 3,
        },
        width: '100%',
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginTop: theme.spacing.unit * 3,
        marginLeft: theme.spacing.unit,
    },
});
class Login extends Component {
    render() {
        return (
            <Fragment>
                <SubHeader content="Logowanie"/>
                <Paper className={this.props.classes.paper}>
                    <LoginForm />
                </Paper>
            </Fragment>
        );
    }
}

export default withStyles(styles)(Login);
