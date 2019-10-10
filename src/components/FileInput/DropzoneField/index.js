import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import DropZone from 'react-dropzone';
import ImagePreview from '../ImagePreview';
import Placeholder from '../Placeholder';
import ShowError from '../ShowError';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = () => ({
    upload: {
        cursor: 'pointer',
        height: '300px',
    },
});

const DropZoneField = ({handleOnDrop, input: {onChange}, imagefile, meta: {error, touched}, classes}) => (
    <div className={classes.root}>
        <DropZone
            accept="image/jpeg, image/png"
            className={classes.upload}
            onDrop={file => handleOnDrop(file, onChange)}
            multiple={false}
        >
            {({getRootProps, getInputProps}) =>
                imagefile && imagefile.length > 0 ? (
                    <Fragment>
                        <Placeholder
                            error={error}
                            touched={touched}
                            getInputProps={getInputProps}
                            getRootProps={getRootProps}
                        />
                        <ImagePreview imagefile={imagefile}/>
                    </Fragment>
                ) : (
                    <Placeholder
                        error={error}
                        touched={touched}
                        getInputProps={getInputProps}
                        getRootProps={getRootProps}
                    />
                )
            }
        </DropZone>
        <ShowError error={error} touched={touched}/>
    </div>
);

DropZoneField.propTypes = {
    error: PropTypes.string,
    handleOnDrop: PropTypes.func.isRequired,
    imagefile: PropTypes.arrayOf(
        PropTypes.shape({
            file: PropTypes.file,
            name: PropTypes.string,
            preview: PropTypes.string,
            size: PropTypes.number
        })
    ),
    onChange: PropTypes.func,
    touched: PropTypes.bool
};

export default withStyles(styles)(DropZoneField);
