import React from 'react';
import ListItemBoxer from './ListItemBoxer.jsx';

const ListBoxer = (props) => (
  <div className = 'col'>
    <h4 className = "mx-auto" style = {{textAlign: 'center', width: '14rem', backgroundColor: 'rgb(242, 242, 242)', marginBottom: '0px', borderRadius: '3px'}}> BOXERS </h4>

    { props.items.map((item, i) => <ListItemBoxer item={item} key={i} removeHandler={props.removeHandler}/>)}
  </div>
)

export default ListBoxer;