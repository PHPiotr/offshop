import React, {useState} from 'react';
import {connect} from 'react-redux';
import {Link as RouterLink} from 'react-router-dom';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import {withStyles} from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from "@material-ui/core/Divider";
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import ListItem from "@material-ui/core/ListItem";
import ListItemText from '@material-ui/core/ListItemText';
import List from "@material-ui/core/List";
import ListSubheader from '@material-ui/core/ListSubheader';

const logoFont = process.env.REACT_APP_LOGO_FONT;
const pageTitle = process.env.REACT_APP_PAGE_TITLE;

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
    listItem: {
        cursor: 'pointer',
    },
    link: {
        textDecoration: 'none',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    iconLink: {
        color: theme.palette.primary.dark
    },
});

const NavigationBar = props => {

    const {classes, cart, isAuthenticated} = props;
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const handleDrawerOpen = () => {
        props.isAuthenticated && setIsMobileOpen(true);
    };

    const handleDrawerClose = () => {
        setIsMobileOpen(false);
    };

    const drawer = (
        <div>
            {isAuthenticated && isMobileOpen && (
                <List subheader={<ListSubheader>Admin</ListSubheader>}>
                    <Divider />
                    <ListItem dense button className={props.classes.listItem}>
                        <RouterLink className={props.classes.link} to="/admin/orders/list">
                            <ListItemText primary="Zamówienia" />
                        </RouterLink>
                    </ListItem>
                    <ListItem dense button className={props.classes.listItem}>
                        <RouterLink className={props.classes.link} to="/admin/products/list">
                            <ListItemText primary={`Produkty`} />
                        </RouterLink>
                    </ListItem>
                    <ListItem dense button className={props.classes.listItem}>
                        <RouterLink className={props.classes.link} to="/admin/delivery-methods/list">
                            <ListItemText primary={`Opcje dostawy`} />
                        </RouterLink>
                    </ListItem>
                    <Divider />
                    <ListItem dense button className={props.classes.listItem}>
                        <RouterLink className={props.classes.link} to="/logout">
                            <ListItemText primary={`Wyloguj`} />
                        </RouterLink>
                    </ListItem>
                </List>
            )}
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
                            onClick={handleDrawerOpen}
                            className={classes.menuButton}
                        >
                            <MenuIcon/>
                        </IconButton>
                    )}
                    <Typography variant="h5" color="inherit" noWrap>
                        <Link className={classes.logo} color="inherit" underline="none" component={RouterLink}
                              to="/">{pageTitle}</Link>
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
                </Toolbar>
            </AppBar>
            <nav className={classes.drawer}>
                <Drawer
                    aria-label="Close drawer"
                    container={props.container}
                    variant="temporary"
                    anchor="left"
                    open={isMobileOpen}
                    onClose={handleDrawerClose}
                    onClick={handleDrawerClose}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    {drawer}
                </Drawer>
            </nav>
        </div>
    );
};

NavigationBar.propTypes = {
    classes: PropTypes.object.isRequired,
    cart: PropTypes.object.isRequired,
    container: PropTypes.object,
    theme: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    cart: state.cart,
    isAuthenticated: new Date().getTime() < state.auth.expiresAt,
});

export default withStyles(styles, {withTheme: true})(connect(mapStateToProps)(NavigationBar));
