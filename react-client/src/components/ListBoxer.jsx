import React from 'react';
import ListItemBoxer from './ListItemBoxer.jsx';

const ListBoxer = (props) => (
  <div className='col'>
    <h4 className="mx-auto cardHeader"> BOXERS </h4>
    <p className='mx-auto' style={{textAlign: 'center', color: 'rgb(230, 230, 230)'}}>Boxing function coming soon</p>
    <div className="row row-cols-1 row-cols-sm-3 row-cols-lg-5 row-cols-lg-6 row-cols-xl-7">
      {props.items.map((item, i) => <ListItemBoxer item={item} key={i} removeHandler={props.removeHandler} />)}
    </div>
  </div>
)

export default ListBoxer;