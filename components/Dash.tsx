import { Component, ReactNode } from 'react';
import { EditButton } from 'react-admin';

class Dash extends Component<{}, { value: string }> {
    services: any = [];

    componentDidMount(): void {
        const apiUrl = window.location.protocol + '/api/swagger/services';
        fetch(apiUrl)
            .then((response) => {
                if (response.status != 200) {
                    return [];
                }
                return response.json();
            })
            .then((data) => (this.services = data))
            .then(() => this.forceUpdate());
    }

    constructor(props: {}) {
        super(props);
        this.services = [];
    }

    render(): ReactNode {
        if (this.services.length == 0) {
            return <div />;
        }
        const rows = this.services;
        let index = 0;
        return rows.map((service) => {
            index++;
            return (
                <span key={index}>
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
        });
    }
}

export default Dash;