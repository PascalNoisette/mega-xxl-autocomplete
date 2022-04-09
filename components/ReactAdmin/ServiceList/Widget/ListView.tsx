import { FunctionComponent, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ListView } from 'react-admin';
import inflection from 'inflection';
import {
    getElementsFromRecords,
    InferredElement,
    ListContextProvider,
    useResourceContext
} from 'ra-core';
import listFieldTypes from '../../../../node_modules/ra-ui-materialui/lib/list/listFieldTypes';

const Listing: FunctionComponent<any> = (props) => {
    const [data, setData] = useState([]);
    const [ids, setIds] = useState([]);
    const currentSort = { field: 'id', order: 'desc' };

    useEffect(() => {
        let result = JSON.parse(props.content || '[]');
        if (!result || result.constructor.name !== 'Array') {
            for (const j in result) {
                if (result[j].constructor.name === 'Array') {
                    result = result[j];
                    break;
                }
                for (const i in result[j]) {
                    if (result[j][i].constructor.name === 'Array') {
                        result = result[j][i];
                        break;
                    }
                }
            }
        }
        setData(result.slice(0, 5));
        setIds(result.map((item, id) => id).slice(0, 5));
    }, [props.content]);

    const resource = useResourceContext(props);
    const [inferredChild, setInferredChild] = useState(null);
    useEffect(() => {
        if (ids.length > 0 && data && !inferredChild) {
            const inferredElements = getElementsFromRecords(
                ids.map((id) => data[id]),
                listFieldTypes
            ).filter(
                (item) =>
                    typeof props.service.columns == 'undefined' ||
                    props.service.columns.split(',').indexOf(item.props.source) != -1
            );
            const inferredChild = new InferredElement(
                listFieldTypes.table,
                null,
                inferredElements
            );

            process.env.NODE_ENV !== 'production' &&
                // eslint-disable-next-line no-console
                console.log(
                    `Guessed List:

export const ${inflection.capitalize(inflection.singularize(resource))}List = props => (
    <List {...props}>
${inferredChild.getRepresentation()}
    </List>
);`
                );
            setInferredChild(inferredChild.getElement());
        }
    }, [data, ids, inferredChild, resource]);

    const selectedIds = [];

    return (
        <ListContextProvider value={{ data, ids, selectedIds, currentSort, ...props }}>
            <ListView {...props}>{inferredChild}</ListView>
        </ListContextProvider>
    );
};

Listing.propTypes = {
    resource: PropTypes.any,
    service: PropTypes.any,
    content: PropTypes.any
};

export default Listing;
