import { FunctionComponent, useState, useEffect } from 'react';
import { Service } from './Interface/Service';
import Listing from './Widget/ListView';
import PropTypes from 'prop-types';
import { EditButton } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    inline: { display: 'inline-flex', marginRight: '1rem', marginBottom: '1rem' },
    float: { float: 'left', marginRight: '1rem' }
});

/**
 *
 */
const Widget: FunctionComponent<{
    record?: Service;
    editorMode: boolean;
}> = (props) => {
    const service = props.record;
    const index = service.id;
    const [content, setContent] = useState('');
    const [time, setTime] = useState(Date.now());

    useEffect(() => {
        if (typeof service.refresh != 'undefined') {
            const interval = setInterval(
                () => setTime(Date.now()),
                +service.refresh * 60 * 1000
            );
            return () => {
                clearInterval(interval);
            };
        }
    }, [service]);

    useEffect(() => {
        fetch(window.location.protocol + '/api/fetch/' + service.id)
            .then((response) => response.text())
            .then((text) => {
                setContent(text);
            });
    }, [time]);

    const classes = useStyles();

    return (
        <div id={'widget-' + index} className={classes.float}>
            <h3>
                {service.logo_alt}{' '}
                {props.editorMode && (
                    <EditButton
                        basePath="/api/swagger/services"
                        record={service}
                        label="Edit"
                        icon={<span />}
                    />
                )}
            </h3>
            {service.content == 'html' && (
                <>
                    <style dangerouslySetInnerHTML={{ __html: service.css }} />
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                </>
            )}
            {service.content == 'json' && (
                <Listing
                    className={classes.inline}
                    service={service}
                    resource={'api/fetch/' + service.id}
                    bulkActionButtons={false}
                    pagination={false}
                    actions={false}
                    content={content}
                />
            )}
        </div>
    );
};
Widget.propTypes = {
    editorMode: PropTypes.any,
    record: PropTypes.any
};
export default Widget;
