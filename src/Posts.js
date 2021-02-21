import * as React from "react";
import { List, Edit, Create, SimpleForm, TextInput, SelectInput } from 'react-admin';
import ControlForm from './ControlForm';
import Engines from './Engine'

export const PostList = (props) => {
    return <List {...props}><ControlForm/></List>;
};

const PostTitle = (record) => {
    return <span>Post {record ? `"${record.title}"` : ''}</span>;
};

export const PostEdit = (props) => (
    <Edit title={<PostTitle />} {...props}>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="logo" />
            <TextInput source="logo_alt" />
            <TextInput source="url" />
            <TextInput source="app" />
            <TextInput source="dataField" />
            <TextInput source="credentials" />
            <TextInput source="location" />
            <TextInput source="source" />
            <SelectInput source="engine" choices={Engines.choices} />
        </SimpleForm>
    </Edit>
);

export const PostCreate = (props) => (
    <Create title="Create a Post" {...props}>
        <SimpleForm>
            <TextInput source="logo" />
            <TextInput source="logo_alt" />
            <TextInput source="url" />
            <TextInput source="app" />
            <TextInput source="dataField" />
            <TextInput source="credentials" />
            <TextInput source="location" />
            <TextInput source="source" />
            <SelectInput source="engine" choices={Engines.choices} />
        </SimpleForm>
    </Create>
);