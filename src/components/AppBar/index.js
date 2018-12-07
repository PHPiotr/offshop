import React, {Component} from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
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
                        <Typography variant="h5" color="inherit" noWrap>
                            <Link style={{color: '#fff', textDecoration: 'none'}} to="/">Kwiaty</Link>
                        </Typography>
                        <div className={classes.grow}/>
                        <div>
                            <IconButton component={Link} to="/cart" color="inherit">
                                <Badge badgeContent={cart.amount} invisible={cart.amount < 1} color="secondary">
                                    <ShoppingCartIcon/>
                                </Badge>
                            </IconButton>
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
