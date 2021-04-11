import { Component, ReactNode } from 'react';
import { EditButton } from 'react-admin';
import { Service } from './Interface/Service';

class Dash extends Component<{ record?: Service }, { value: string }> {
    render(): ReactNode {
        const service = this.props.record;
        return (
            <span>
                <a
                    href={service.url}
                    target="_blank"
                    rel="noreferrer"
                    className="dash"
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
    }
}

export default Dash;
