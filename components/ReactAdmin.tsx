import { Admin, Resource } from 'react-admin';
import restProvider from 'ra-data-simple-rest';
import { ServiceCreate } from './ReactAdmin/ServiceCreate';
import { ServiceEdit } from './ReactAdmin/ServiceEdit';
import { ServiceList } from './ReactAdmin/ServiceList';
import { ReactNode } from 'react';

const dataProvider = restProvider(window.location.protocol);

const ReactAdmin = (): ReactNode => {
    return (
        <Admin dataProvider={dataProvider}>
            <Resource
                name="api/swagger/services"
                list={ServiceList}
                edit={ServiceEdit}
                create={ServiceCreate}
            />
        </Admin>
    );
};

export default ReactAdmin;
