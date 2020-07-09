import React from 'react';
import ListItemBoxer from './ListItemBoxer.jsx';

const ListBoxer = (props) => (
  <div className='col'>
    <h4 className="mx-auto" style={{ textAlign: 'center', width: '14rem', backgroundColor: 'rgb(242, 242, 242)', marginBottom: '10px', borderRadius: '3px' }}> BOXERS </h4>
    <p className='mx-auto' style={{textAlign: 'center'}}>Boxing function currently limited, may not work properly</p>
    <div className="row row-cols-1 row-cols-sm-3 row-cols-lg-5">

      {props.items.map((item, i) => <ListItemBoxer item={item} key={i} removeHandler={props.removeHandler} />)}
    </div>

  </div>
)

export default ListBoxer;