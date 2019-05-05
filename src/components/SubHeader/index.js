import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
    subHeader: {
        padding: theme.spacing.unit * 2,
    },
});

const SubHeader = props => {
    const { classes, content } = props;
    return (
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <div className={classes.subHeader}>
                <Typography variant="h5" align="center" component="h2">
                    {content}
                </Typography>
            </div>
        </Grid>
    );
};

SubHeader.propTypes = {
    classes: PropTypes.object.isRequired,
    content: PropTypes.string.isRequired,
};

export default withStyles(styles)(SubHeader);
