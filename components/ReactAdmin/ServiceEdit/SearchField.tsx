import {
    TextInput,
    SelectInput,
    PasswordInput,
    BooleanInput,
    FormDataConsumer,
    required
} from 'react-admin';
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

export const SearchFields: FunctionComponent<any> = () => (
    <>
        <BooleanInput source="has_search" defaultValue={false} />
        <FormDataConsumer>
            {({ formData }) =>
                formData.has_search && (
                    <span>
                        <TextInput source="app" />
                        <TextInput source="dataField" />
                        <PasswordInput source="credentials" />
                        <TextInput source="location" />
                        <TextInput source="source" />
                        <SelectInput
                            validate={required()}
                            source="engine"
                            choices={engines}
                        />
                    </span>
                )
            }
        </FormDataConsumer>
    </>
);
