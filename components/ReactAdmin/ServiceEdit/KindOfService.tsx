import { RadioButtonGroupInput } from 'react-admin';
import { FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import { UrlAndLogo } from './UrlAndLogo';
import { Widget } from './Widget';
import { UploadOpenSearch } from './UploadOpenSearch';
import { useForm } from 'react-final-form';
import { Discover } from './Discover';
import { SearchField } from './SearchField';
/**
 * Select if service is a bookmark or is capable of search.
 */
export const KindOfService: FunctionComponent<any> = ({ setValidTransition }) => {
    const form = useForm();
    return (
        <>
            <RadioButtonGroupInput
                source="kindOfService"
                label="Chooose"
                onClick={(e) => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    const value = e.target.value;
                    if (value == 'bookmark') {
                        setValidTransition([KindOfService, Discover, UrlAndLogo]);
                    } else if (value == 'opensearch') {
                        form.change('engine', 'opensearch');
                        form.change('dataField', 'completion');
                        form.change('source', 'url');
                        form.change('location', '');

                        setValidTransition([
                            KindOfService,
                            Discover,
                            UploadOpenSearch,
                            UrlAndLogo,
                            SearchField
                        ]);
                    } else if (value == 'search') {
                        form.change('engine', '');
                        setValidTransition([
                            KindOfService,
                            Discover,
                            UrlAndLogo,
                            SearchField
                        ]);
                    } else if (value == 'widget') {
                        form.change('engine', '');
                        setValidTransition([KindOfService, Discover, UrlAndLogo, Widget]);
                    }
                }}
                choices={[
                    {
                        id: 'bookmark',
                        name: 'Create a Simple bookmark'
                    },
                    {
                        id: 'opensearch',
                        name: 'Add a website that offers an OpenSearch'
                    },
                    {
                        id: 'search',
                        name: 'Supply url of a search engine'
                    },
                    {
                        id: 'widget',
                        name: 'Add a widget from webpage.'
                    }
                ]}
            />
        </>
    );
};

KindOfService.propTypes = {
    setValidTransition: PropTypes.any
};

KindOfService.displayName = 'Kind Of Service';
