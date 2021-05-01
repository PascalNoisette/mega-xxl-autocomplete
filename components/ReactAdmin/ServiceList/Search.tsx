import { FunctionComponent, Component, useState } from 'react';
import { ReactiveBase, DataSearch } from '@appbaseio/reactivesearch';
import Suggestion from './Search/Suggestion';
import { Service } from './Interface/Service';
import { DataSearchProps } from '@appbaseio/reactivesearch/lib/components/search/DataSearch';
import PropTypes from 'prop-types';

const Search: FunctionComponent<{
    record?: Service;
    inputsToControl: Component<DataSearchProps>[];
}> = (props) => {
    const service = props.record;
    const index = service.id;
    const [visible, toggleVisibility] = useState(false);
    return (
        <div className={visible ? 'cell active' : 'cell'} id={'cell-' + index}>
            <a
                href={service.location || service.nice_url}
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
            <ReactiveBase url={window.location + ''} app={'api/search/' + service.id}>
                <DataSearch
                    componentId={'searchbox' + index}
                    debounce={500}
                    ref={(input) => {
                        props.inputsToControl.push(input);
                    }}
                    dataField={service.dataField}
                    render={(res) => {
                        toggleVisibility(res.data.length > 0);
                        return Suggestion({ ...res, ...service });
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
                                (service.location || '') + value.source[service.source]
                            );
                        }
                    }}
                />
            </ReactiveBase>
        </div>
    );
};
Search.propTypes = {
    inputsToControl: PropTypes.any,
    record: PropTypes.any
};
export default Search;
