import {
    List,
    Edit,
    Create,
    SimpleForm,
    TextInput,
    SelectInput,
    PasswordInput,
    required
} from 'react-admin';
import ControlForm from './ControlForm';
import restProvider from 'ra-data-simple-rest';

export const ServiceList = (props) => {
    return (
        <List {...props}>
            <ControlForm />
        </List>
    );
};

const ServiceTitle = (record) => {
    return <span>Service {record ? `"${record.title}"` : ''}</span>;
};

const engines = [];
restProvider(window.location.protocol + '/api')
    .getList('engines', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'name', order: 'desc' },
        filter: null
    })
    .then((names) => names.data.map((name) => engines.push({ id: name, name: name })));

export const ServiceEdit = (props) => (
    <Edit title={<ServiceTitle />} {...props}>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="logo" />
            <TextInput source="logo_alt" />
            <TextInput source="url" />
            <TextInput source="app" />
            <TextInput source="dataField" />
            <PasswordInput source="credentials" />
            <TextInput source="location" />
            <TextInput source="source" />
            <SelectInput validate={required()} source="engine" choices={engines} />
        </SimpleForm>
    </Edit>
);

export const ServiceCreate = (props) => (
    <Create title="Create a Service" {...props}>
        <SimpleForm>
            <TextInput source="logo" />
            <TextInput source="logo_alt" />
            <TextInput source="url" />
            <TextInput source="app" />
            <TextInput source="dataField" />
            <TextInput source="credentials" />
            <TextInput source="location" />
            <TextInput source="source" />
            <SelectInput validate={required()} source="engine" choices={engines} />
        </SimpleForm>
    </Create>
);
