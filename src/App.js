import './App.css';
import * as React from "react";
import { Admin, Resource } from 'react-admin';
import restProvider from 'ra-data-simple-rest';
import { PostList, PostEdit, PostCreate } from './Posts';

export default function App() {
    return (
        <Admin dataProvider={restProvider(window.location.protocol)}>
            <Resource name="posts" list={PostList} edit={PostEdit} create={PostCreate} />
        </Admin>
    );
}