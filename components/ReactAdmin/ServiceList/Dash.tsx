import { FunctionComponent } from 'react';
import { EditButton } from 'react-admin';
import { Service } from './Interface/Service';
import PropTypes from 'prop-types';

const Dash: FunctionComponent<{ record?: Service }> = (props) => {
    const service = props.record;
    return (
        <span className="dash">
            <a
                href={service.url}
                target="_blank"
                rel="noreferrer"
                title={service.logo_alt}
            >
                <img
                    style={{ margin: '5px' }}
                    height="30px"
                    src={service.logo}
                    alt={service.logo_alt}
                />
            </a>
            <EditButton
                basePath="/api/swagger/services"
                record={service}
                label="Edit"
                icon={<span />}
                className="toggleEdit"
            />
        </span>
    );
};
Dash.propTypes = {
    record: PropTypes.any
};
export default Dash;
