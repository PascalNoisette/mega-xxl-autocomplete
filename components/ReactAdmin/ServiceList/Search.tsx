import { Component, ReactNode } from 'react';
import { ReactiveBase, DataSearch } from '@appbaseio/reactivesearch';
import { EditButton } from 'react-admin';
import Suggestion from './Search/Suggestion';
import { Service } from './Interface/Service';
class Search extends Component<{ record?: Service; inputsToControl: ReactNode[] }, {}> {
    render(): ReactNode {
        const service = this.props.record;
        const index = 1; //@TODO;
        return (
            <div className="cell">
                <a
                    href={service.location || service.url}
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
                            this.props.inputsToControl.push(input);
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
                                        value.source[service.source]
                                );
                            }
                        }}
                    />
                </ReactiveBase>
            </div>
        );
    }
}

export default Search;
