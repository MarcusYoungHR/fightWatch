import React from 'react';

const ListItem = (props) => {
  if (props.item.next_fight.length === 0) {
    props.item.next_fight = 'TBD';
  }
  if (props.item.next_opponent.length === 0) {
    props.item.next_opponent = 'TBD';
  }
  return (
    <div>
      <div>{props.item.name} <button id={props.item.name} onClick={function() {
        props.removeHandler(event.target.id)
      }}>remove</button></div>
      <img src={'https://www.sherdog.com' + props.item.image}></img>
      <span>{"Fighting vs " + props.item.next_opponent + ' on ' + props.item.next_fight}</span>
    </div>
  )
}

export default ListItem;