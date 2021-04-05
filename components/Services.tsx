import {
    CreateButton,
    Button,
    Toolbar,
    Edit,
    Create,
    SimpleForm,
    TextInput,
    SelectInput,
    PasswordInput,
    BooleanInput,
    FormDataConsumer,
    required
} from 'react-admin';
import CreateButtonIcon from '@material-ui/icons/Create';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import ControlForm from './ControlForm';
import Dash from './Dash';
import restProvider from 'ra-data-simple-rest';
import { FunctionComponent } from 'react';

export const ServiceList: FunctionComponent<any> = () => {
    let toggle: boolean = true;
    return (
        <>
            <Toolbar>
                <CreateButton basePath="services" />
                <Button
                    label="Edit"
                    aria-label="list"
                    onClick={() => {
                        Array.from(
                            document.getElementsByClassName('toggleEdit')
                        ).forEach((element) => element.classList.toggle('active'));
                        toggle = !toggle;
                    }}
                >
                    {toggle ? <CreateButtonIcon /> : <BorderColorIcon />}
                </Button>
                <Dash />
            </Toolbar>
            <ControlForm />
        </>
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
