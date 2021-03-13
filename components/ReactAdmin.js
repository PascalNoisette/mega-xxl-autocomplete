
import { Admin, Resource } from 'react-admin';
import restProvider from 'ra-data-simple-rest';
import { ServiceList, ServiceEdit, ServiceCreate } from '../components/Services';


const dataProvider = restProvider(window.location.protocol);

const ReactAdmin = () => {
  return <Admin dataProvider={dataProvider}>
      <Resource
          name="api/swagger/services"
          list={ServiceList}
          edit={ServiceEdit}
          create={ServiceCreate}
          />
  </Admin>;
}

export default ReactAdmin