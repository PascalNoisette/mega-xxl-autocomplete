import { Component, ChangeEvent, ReactNode } from 'react';
import { ReactiveBase, DataSearch } from '@appbaseio/reactivesearch';
import { EditButton } from 'react-admin';
import Suggestion from './Suggestion';

class ControlForm extends Component<{}, { value: string }> {
    services: any = [];
    Progress: any[];

    componentDidMount(): void {
        const apiUrl = window.location.protocol + '/api/swagger/services?has_search=true';
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
        this.state = { value: '' };
        this.services = [];
        this.Progress = [];
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event: ChangeEvent<{ value: string }>): void {
        this.setState({ value: event.target.value });
        this.Progress.forEach((e) => {
            if (e) {
                e.setState({
                    isOpen: true
                });
                e.setValue(event.target.value);
            }
        });
    }

    render(): ReactNode {
        if (this.services.length == 0) {
            return <div />;
        }
        const rows = [this.services];
        let index = 0;
        return (
            <div className="ControlForm">
                <form className="ControlFormInput">
                    <svg
                        height="12"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 15 15"
                    >
                        <title>Search</title>
                        <path d=" M6.02945,10.20327a4.17382,4.17382,0,1,1,4.17382-4.17382A4.15609,4.15609, 0,0,1,6.02945,10.20327Zm9.69195,4.2199L10.8989,9.59979A5.88021,5.88021, 0,0,0,12.058,6.02856,6.00467,6.00467,0,1,0,9.59979,10.8989l4.82338, 4.82338a.89729.89729,0,0,0,1.29912,0,.89749.89749,0,0,0-.00087-1.29909Z "></path>
                    </svg>
                    <input
                        type="text"
                        value={this.state.value}
                        onChange={this.handleChange}
                    />
                </form>
                {rows.map((row, j) => {
                    const that = this;
                    return (
                        <div className="ControlFormAdvanced" key={j}>
                            {row.map((service) => {
                                index++;
                                return (
                                    <div key={index} className="cell">
                                        <a
                                            href={service.location || service.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            key={index}
                                            title={service.logo_alt}
                                        >
                                            <img
                                                style={{ margin: '5px' }}
                                                height="30px"
                                                src={service.logo}
                                                alt={service.logo_alt}
                                            />
                                        </a>
                                        <ReactiveBase
                                            url={window.location + ''}
                                            app={'api/search/' + service.app}
                                        >
                                            <EditButton
                                                basePath="/api/swagger/services"
                                                record={service}
                                                className="toggleEdit"
                                            />
                                            <DataSearch
                                                componentId={'searchbox' + index}
                                                debounce={500}
                                                ref={(input) => {
                                                    that.Progress.push(input);
                                                }}
                                                dataField={service.dataField}
                                                render={Suggestion}
                                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                // @ts-ignore
                                                Suggestion="suggestion => ({
                                                    label: `${suggestion._source[service.dataField].replace(/<[^>]*>?/gm, '')} - ${suggestion._source[service.categoryField]}`,
                                                    value: suggestion._source[service.dataField].replace(/<[^>]*>?/gm, ''),
                                                    source: suggestion._source  // for onValueSelected to work with renderSuggestion
                                                  })"
                                                downShiftProps={{
                                                    onSelect: (value) => {
                                                        window.open(
                                                            (service.location || '') +
                                                                value.source[
                                                                    service.source
                                                                ]
                                                        );
                                                    }
                                                }}
                                            />
                                        </ReactiveBase>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        );
    }
}

export default ControlForm;
