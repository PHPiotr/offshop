import React, {Component} from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Button from '@material-ui/core/Button';
import {withStyles} from '@material-ui/core/styles';
import {Link} from 'react-router-dom';

const styles = () => ({
    root: {
        width: '100%',
    },
    grow: {
        flexGrow: 1,
    },
});

class PrimaryAppBar extends Component {

    render() {
        const {classes, cart} = this.props;

        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" color="inherit" noWrap>
                            <Link style={{color: '#fff', textDecoration: 'none'}} to="/">Kwiaty</Link>
                        </Typography>
                        <div className={classes.grow}/>
                        <div>
                            <IconButton color="inherit">
                                <Badge badgeContent={cart.amount} color="secondary">
                                    <ShoppingCartIcon/>
                                </Badge>
                            </IconButton>
                            <Button component={Link} to="/login" color="inherit">Login</Button>
                        </div>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

PrimaryAppBar.propTypes = {
    classes: PropTypes.object.isRequired,
    cart: PropTypes.object.isRequired,
};

export default withStyles(styles)(PrimaryAppBar);
