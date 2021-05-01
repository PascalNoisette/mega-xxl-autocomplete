import { Admin, Resource, Layout } from 'react-admin';
import { ServiceCreate } from './ReactAdmin/ServiceCreate';
import { ServiceEdit } from './ReactAdmin/ServiceEdit';
import { ServiceList } from './ReactAdmin/ServiceList';
import { ReactNode } from 'react';
import myDataProvider from './ReactAdmin/MyDataProvider';

const LayoutWithoutMenu = (props) => (
    <Layout {...props} sidebar={() => <></>} appBar={() => <></>} menu={() => <></>} />
);
/**
 * Basic react-admin layout
 */
const ReactAdmin = (): ReactNode => {
    return (
        <Admin dataProvider={myDataProvider} layout={LayoutWithoutMenu}>
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
