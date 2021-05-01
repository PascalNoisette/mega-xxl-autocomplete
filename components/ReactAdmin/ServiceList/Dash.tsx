import { FunctionComponent } from 'react';
import { EditButton } from 'react-admin';
import { Service } from './Interface/Service';
import PropTypes from 'prop-types';
/**
 * Trivial inline list of all bookmarks
 */
const Dash: FunctionComponent<{ record?: Service; editorMode: boolean }> = (props) => {
    const service = props.record;
    return (
        <span className="dash">
            <a
                href={service.nice_url}
                target="_blank"
                rel="noreferrer"
                title={service.logo_alt}
            >
                <img
                    style={{ margin: '5px' }}
                    height="30px"
                    src={'api/static/' + service.logo}
                    alt={service.logo_alt}
                />
            </a>
            {props.editorMode && (
                <EditButton
                    basePath="/api/swagger/services"
                    record={service}
                    label="Edit"
                    icon={<span />}
                />
            )}
        </span>
    );
};
Dash.propTypes = {
    record: PropTypes.any,
    editorMode: PropTypes.bool
};
export default Dash;
