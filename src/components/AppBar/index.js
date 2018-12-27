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
import Chip from "@material-ui/core/Chip";

const styles = theme => ({
    root: {
        width: '100%',
    },
    grow: {
        flexGrow: 1,
    },
    chip: {
        margin: theme.spacing.unit,
    },
});

class PrimaryAppBar extends Component {

    state = {
        offline: !navigator.onLine,
    };

    setOfflineStatus = () => {
        this.setState({offline: !navigator.onLine});
    };

    componentDidMount() {
        window.addEventListener('online', this.setOfflineStatus);
        window.addEventListener('offline', this.setOfflineStatus);
    }

    componentWillUnmount() {
        window.removeEventListener('online', this.setOfflineStatus);
        window.removeEventListener('offline', this.setOfflineStatus);
    }


    render() {
        const {classes, cart} = this.props;

        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h5" color="inherit" noWrap>
                            <Link
                                style={{
                                    color: '#fff',
                                    textDecoration: 'none',
                                }}
                                to="/"
                            >
                                Kwiaty
                            </Link>
                        </Typography>
                        <div className={classes.grow}/>
                        <div>
                            <IconButton
                                component={Link}
                                to="/cart"
                                color="inherit"
                            >
                                <Badge
                                    badgeContent={cart.quantity}
                                    invisible={cart.quantity < 1}
                                    color="secondary"
                                >
                                    <ShoppingCartIcon/>
                                </Badge>
                            </IconButton>
                            {this.state.offline && <Chip label="Offline" className={classes.chip} color="secondary"/>}
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
