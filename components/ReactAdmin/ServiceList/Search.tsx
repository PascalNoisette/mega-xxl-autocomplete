import { Component, ReactNode } from 'react';
import { ReactiveBase, DataSearch } from '@appbaseio/reactivesearch';
import Suggestion from './Search/Suggestion';
import { Service } from './Interface/Service';
class Search extends Component<{ record?: Service; inputsToControl: ReactNode[] }, {}> {
    render(): ReactNode {
        const service = this.props.record;
        const index = service.id;
        return (
            <div className="cell" id={'cell-' + index}>
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
                    <DataSearch
                        componentId={'searchbox' + index}
                        debounce={500}
                        ref={(input) => {
                            this.props.inputsToControl.push(input);
                        }}
                        dataField={service.dataField}
                        render={(res) => {
                            const cell = document.getElementById('cell-' + index);
                            if (cell) {
                                if (res.data.length < 1) {
                                    cell.classList.remove('active');
                                } else {
                                    cell.classList.add('active');
                                }
                            }
                            return Suggestion(res);
                        }}
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
