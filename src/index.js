import * as React from "react";
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { Admin, Resource } from 'react-admin';
import restProvider from 'ra-data-simple-rest';
import { ServiceList, ServiceEdit, ServiceCreate } from './Services';

ReactDOM.render(
  <Admin dataProvider={restProvider(window.location.protocol)}>
    <Resource name="services" list={ServiceList} edit={ServiceEdit} create={ServiceCreate} />
  </Admin>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
