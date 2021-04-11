import { Create, SimpleForm, TextInput } from 'react-admin';
import { SearchFields } from './ServiceEdit/SearchField';
import { FunctionComponent } from 'react';

export const ServiceCreate: FunctionComponent<any> = (props) => (
    <Create title="Create a Service" {...props}>
        <SimpleForm>
            <TextInput source="logo" />
            <TextInput source="logo_alt" />
            <TextInput source="url" />
            <SearchFields />
        </SimpleForm>
    </Create>
);
