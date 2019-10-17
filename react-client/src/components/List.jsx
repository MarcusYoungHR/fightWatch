import React from 'react';
import ListItem from './ListItem.jsx';

const List = (props) => (
  <div>
    <h4> Ur fav fighters </h4>

    { props.items.map((item, i) => <ListItem item={item} key={i} removeHandler={props.removeHandler}/>)}
  </div>
)

export default List;