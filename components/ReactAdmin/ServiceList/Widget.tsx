import { FunctionComponent, useState, useEffect } from 'react';
import { Service } from './Interface/Service';
import PropTypes from 'prop-types';
import entities from 'entities';
import { ListView, EditButton } from 'react-admin';
import myDataProvider from './Widget/DataProvider';
import inflection from 'inflection';
import { makeStyles } from '@material-ui/core/styles';
import {
    getElementsFromRecords,
    InferredElement,
    ListContextProvider,
    useResourceContext
} from 'ra-core';
import listFieldTypes from '../../../node_modules/ra-ui-materialui/lib/list/listFieldTypes';

const useStyles = makeStyles({
    inline: { display: 'inline-flex', marginRight: '1rem', marginBottom: '1rem' },
    float: { float: 'left', marginRight: '1rem' }
});

const MyListViewGuesser: FunctionComponent<any> = (props) => {
    const [data, setData] = useState([]);
    const [ids, setIds] = useState([]);
    const currentSort = { field: 'id', order: 'desc' };

    useEffect(() => {
        myDataProvider
            .getList(props.resource, {
                pagination: { page: 1, perPage: 4 },
                sort: currentSort,
                filter: []
            })
            .then((result) => {
                setData(result.data.slice(0, 5));
                setIds(result.data.map((item) => item.id).slice(0, 5));
            });
    }, []);

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
            console.log(inferredElements);
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

MyListViewGuesser.propTypes = {
    resource: PropTypes.any,
    service: PropTypes.any
};

/**
 *
 */
const Widget: FunctionComponent<{
    record?: Service;
    editorMode: boolean;
}> = (props) => {
    const service = props.record;
    const index = service.id;
    const [content, setContent] = useState('');
    const [time, setTime] = useState(Date.now());

    useEffect(() => {
        if (typeof service.refresh != 'undefined') {
            const interval = setInterval(
                () => setTime(Date.now()),
                +service.refresh * 60 * 1000
            );
            return () => {
                clearInterval(interval);
            };
        }
    }, [service]);

    useEffect(() => {
        fetch(window.location.protocol + '/api/fetch/' + service.id)
            .then((response) => response.text())
            .then((text) => {
                setContent(text);
            });
    }, [time]);

    const classes = useStyles();

    return (
        <div id={'widget-' + index} className={classes.float}>
            <h3>
                {service.logo_alt}{' '}
                {props.editorMode && (
                    <EditButton
                        basePath="/api/swagger/services"
                        record={service}
                        label="Edit"
                        icon={<span />}
                    />
                )}
            </h3>
            {service.content == 'html' && (
                <div dangerouslySetInnerHTML={{ __html: entities.encodeHTML(content) }} />
            )}
            {service.content == 'json' && (
                <MyListViewGuesser
                    className={classes.inline}
                    service={service}
                    resource={'api/fetch/' + service.id}
                    bulkActionButtons={false}
                    pagination={false}
                    filters={false}
                    actions={false}
                />
            )}
        </div>
    );
};
Widget.propTypes = {
    editorMode: PropTypes.any,
    record: PropTypes.any
};
export default Widget;
