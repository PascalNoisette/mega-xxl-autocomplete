import { Admin, Resource, Layout } from 'react-admin';
import restProvider from 'ra-data-simple-rest';
import { ServiceCreate } from './ReactAdmin/ServiceCreate';
import { ServiceEdit } from './ReactAdmin/ServiceEdit';
import { ServiceList } from './ReactAdmin/ServiceList';
import { ReactNode } from 'react';

const dataProvider = restProvider(window.location.protocol);
const LayoutWithoutMenu = (props) => (
    <Layout {...props} sidebar={() => <></>} appBar={() => <></>} menu={() => <></>} />
);

const ReactAdmin = (): ReactNode => {
    return (
        <Admin dataProvider={dataProvider} layout={LayoutWithoutMenu}>
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
