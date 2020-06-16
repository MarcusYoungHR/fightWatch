import React from 'react';

const ListItem = (props) => {
  if (props.item.next_fight.length === 0) {
    props.item.next_fight = 'TBA';
  }
  if (props.item.next_opponent.length === 0) {
    props.item.next_opponent = 'TBA';
  }
  return (
    <div className="col mb-4">
      <div className="card" style={{ width: '14rem' }}>
        <div style={{ height: '280px', overflow: 'hidden' }}>
          <img src={props.item.image} className="card-img-top"></img>
        </div>
        <div className="card-body">
          <h5 className="card-title">{props.item.name}</h5>
          <p className="card-text">Fighting vs {props.item.next_opponent} on {props.item.next_fight}</p>
          <button id={props.item.name} className="btn btn-dark" onClick={(event) => {
            props.removeHandler(event.target.id)
          }}>Remove</button>
        </div>
      </div>
    </div>

  )
}

export default ListItem;

    // <div>
    //   <div>{props.item.name} <button id={props.item.name} onClick={function() {
    //     props.removeHandler(event.target.id)
    //   }}>remove</button></div>
    //   <img src={props.item.image}></img>
    //   <span>{"Fighting vs " + props.item.next_opponent + ' on ' + props.item.next_fight}</span>
    // </div>