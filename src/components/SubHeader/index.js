import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';

const styles = theme => ({
    root: {
        margin: theme.spacing.unit * 2,
    },
});

const SubHeader = (props) => {
    const {classes, content} = props;
    return (
        <Typography className={classes.root} variant="h6" align="left">
            {content}
        </Typography>
    );
};

SubHeader.propTypes = {
    classes: PropTypes.object.isRequired,
    content: PropTypes.string.isRequired,
};

export default withStyles(styles)(SubHeader);
