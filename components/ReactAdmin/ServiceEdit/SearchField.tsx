import { TextInput, SelectInput, PasswordInput } from 'react-admin';
import restProvider from 'ra-data-simple-rest';
import { FunctionComponent } from 'react';

const engines = [];
restProvider(window.location.protocol + '/api')
    .getList('engines', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'name', order: 'desc' },
        filter: null
    })
    .then((names) => names.data.map((name) => engines.push({ id: name, name: name })));

export const SearchField: FunctionComponent<any> = () => (
    <>
        <TextInput label="Endpoint url" source="url" />
        <TextInput source="dataField" label="Field name to use as title" />
        <PasswordInput source="credentials" />
        <TextInput label="Url to concat with results" source="location" />
        <TextInput label="Result to concat with url" source="source" />
        <SelectInput source="engine" choices={engines} />
    </>
);

SearchField.displayName = 'Search Fields';
