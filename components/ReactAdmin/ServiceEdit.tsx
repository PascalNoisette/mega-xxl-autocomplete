import { Edit, SimpleForm, TextInput } from 'react-admin';
import { FunctionComponent } from 'react';
import { SearchFields } from './ServiceEdit/SearchField';

const ServiceTitle = (record) => {
    return <span>Service {record ? `"${record.title}"` : ''}</span>;
};

export const ServiceEdit: FunctionComponent<any> = (props) => (
    <Edit title={<ServiceTitle />} {...props}>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="logo" />
            <TextInput source="logo_alt" />
            <TextInput source="url" />
            <SearchFields />
        </SimpleForm>
    </Edit>
);
