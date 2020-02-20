import React from 'react';

const ListItem = (props) => {
  if (props.item.next_fight.length === 0) {
    props.item.next_fight = 'TBA';
  }
  if (props.item.next_opponent.length === 0) {
    props.item.next_opponent = 'TBA';
  }
  return (
    <div>
      <div>{props.item.name} <button id={props.item.name} onClick={function() {
        props.removeHandler(event.target.id)
      }}>remove</button></div>
      <img src={props.item.image}></img>
      <span>{"Fighting vs " + props.item.next_opponent + ' on ' + props.item.next_fight}</span>
    </div>
  )
}

export default ListItem;