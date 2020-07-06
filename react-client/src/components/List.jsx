import React from 'react';
import ListItem from './ListItem.jsx';

const List = (props) => (
  <div className='col'>
    <h4 className="mx-auto" style={{ textAlign: 'center', width: '14rem', backgroundColor: 'rgb(242, 242, 242)', marginBottom: '10px', borderRadius: '3px' }}> MMA FIGHTERS </h4>
    <div className="row row-cols-1 row-cols-md-5">
      {props.items.map((item, i) => <ListItem item={item} key={i} removeHandler={props.removeHandler} />)}
    </div>
  </div>
)

export default List;