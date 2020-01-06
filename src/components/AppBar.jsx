import React, {Component} from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import {withStyles} from '@material-ui/core/styles';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import Chip from "@material-ui/core/Chip";
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from "@material-ui/core/Divider";
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import AdminNav from './Admin/Nav';

const logoFont = process.env.REACT_APP_LOGO_FONT || 'Roboto';

const styles = theme => ({
    root: {
        display: 'flex',
    },
    logo: {
        lineHeight: 1.8,
        fontFamily: logoFont,
    },
    menuButton: {
        marginRight: 20,
    },
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    grow: {
        flexGrow: 1,
    },
    chip: {
        margin: theme.spacing(1),
    },
});

class PrimaryAppBar extends Component {

    constructor(props) {
        super(props);
        this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
    }

    state = {
        offline: !navigator.onLine,
        mobileOpen: false,
    };

    handleDrawerOpen = () => {
        this.props.isAuthenticated && this.setState({mobileOpen: true});
    };

    handleDrawerClose = () => {
        this.setState({mobileOpen: false});
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
        const {classes, cart, isAuthenticated} = this.props;

        const drawer = (
            <div>
                {isAuthenticated && <AdminNav />}
                <Divider/>
            </div>
        );

        return (
            <div className={classes.root}>
                <CssBaseline/>
                <AppBar position="static" color="primary" className={classes.appBar}>
                    <Toolbar>
                        {isAuthenticated && (
                            <IconButton
                                color="inherit"
                                aria-label="Open drawer"
                                onClick={this.handleDrawerOpen}
                                className={classes.menuButton}
                            >
                                <MenuIcon/>
                            </IconButton>
                        )}
                        <Typography variant="h5" color="inherit" noWrap>
                            <Link className={classes.logo} color="inherit" underline="none" component={RouterLink} to="/">{this.props.appBar.title}</Link>
                        </Typography>
                        <div className={classes.grow}/>
                        <div>
                            <IconButton
                                data-testid="cart-button"
                                component={RouterLink}
                                to="/cart"
                                color="inherit"
                            >
                                <Badge
                                    data-testid="cart-badge"
                                    badgeContent={cart.quantity}
                                    invisible={cart.quantity < 1}
                                    color="secondary"
                                >
                                    <ShoppingCartIcon/>
                                </Badge>
                            </IconButton>
                        </div>
                        {this.state.offline && <div>
                            <Chip label="Offline" className={classes.chip} color="secondary"/>
                        </div>}
                    </Toolbar>
                </AppBar>
                <nav className={classes.drawer}>
                    <Drawer
                        container={this.props.container}
                        variant="temporary"
                        anchor="left"
                        open={this.state.mobileOpen}
                        onClose={this.handleDrawerClose}
                        onClick={this.handleDrawerClose}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                    >
                        {drawer}
                    </Drawer>
                </nav>
            </div>
        );
    }
}

PrimaryAppBar.propTypes = {
    classes: PropTypes.object.isRequired,
    cart: PropTypes.object.isRequired,
    container: PropTypes.object,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, {withTheme: true})(PrimaryAppBar);
