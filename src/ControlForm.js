import React, { Component }  from 'react';
import Engines from './Engine'
import { ReactiveBase, DataSearch } from '@appbaseio/reactivesearch';
import { Grid, Row, Col } from 'react-flexbox-grid';
import {  EditButton } from 'react-admin';

class ControlForm extends Component {

  componentDidMount() {
    const apiUrl = window.location.protocol + '/posts';
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => this.services = data.map(x=>Engines[x.engine](x)));
  }

  constructor(props) {
    super(props);
    this.state = {value: ''};
    this.services = [];
    this.Progress=[];
    this.handleChange = this.handleChange.bind(this);
  }
  
 

  handleChange(event) {
    this.setState({value: event.target.value});
    this.Progress.forEach((e) => {
      e.setState({
        isOpen: true,
      });
      e.setValue(event.target.value);
    });
  }

  render() {
    const array_chunk = (array, chunk_size) => Array(Math.ceil(array.length / chunk_size)).fill().map((_, index) => index * chunk_size).map(begin => array.slice(begin, begin + chunk_size));
    const rows = array_chunk(this.services, 3);
    let index = 0;
    return (
        <div className="ControlForm">
            <form className="ControlFormInput">
                <svg alt="Search" height="12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15"><title>Search</title><path d=" M6.02945,10.20327a4.17382,4.17382,0,1,1,4.17382-4.17382A4.15609,4.15609, 0,0,1,6.02945,10.20327Zm9.69195,4.2199L10.8989,9.59979A5.88021,5.88021, 0,0,0,12.058,6.02856,6.00467,6.00467,0,1,0,9.59979,10.8989l4.82338, 4.82338a.89729.89729,0,0,0,1.29912,0,.89749.89749,0,0,0-.00087-1.29909Z "></path></svg>
                <input type="text" value={this.state.value} onChange={this.handleChange} />
            </form>
            <Grid fluid>
            {rows.map((row, j) => {
              const that = this;
              return (
                <Row key={j}>
                    {row.map((service) => {
                      index++;
                  return (
                      <Col key={index} xs={6} md={3}>
                          <img 
                            style={{margin:"5px"}}
                            height="30px"
                            src={service.logo}
                            alt={service.logo_alt}/>
                          <ReactiveBase
          url={process.env.NODE_ENV === "production" ? "" + window.location : service.url}
          app={service.app}
      >
                              <DataSearch
                  componentId={"searchbox" + index} 
                  debounce={500}
                  ref={(input) => {that.Progress.push(input) }}
                  dataField={service.dataField}
                  categoryField="NotebookId.keyword"
                  placeholder= {"Search for "+ service.app} 
                  downShiftProps={{
                    onSelect: service.onselect
                  }}
                  style={{
                      padding: '5px',
                      marginTop: '10px',
                  }}
              />
                              <EditButton basePath="/posts" record={service}/>
                          </ReactiveBase>
                      </Col>
                  )
                })}

                </Row>)})}

            </Grid>
        </div>
    );
  }
}

export default ControlForm;