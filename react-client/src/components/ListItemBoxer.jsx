import React from 'react';

const ListItemBoxer = (props) => {
  return (
    <div className="col mb-4">
      <div className="card h-100" style={{ width: '14rem' }}>
        <div style={{ height: '280px', overflow: 'hidden' }}>
          <img src={props.item.image} className="card-img-top"></img>
        </div>
        <div className="card-body">
          <h5 className="card-title">{props.item.name}</h5>
          <p className="card-text">Fighting vs {props.item.next_opponent} on {props.item.next_fight}</p>
        </div>
        <button id={props.item.name} className="btn btn-dark" onClick={(event) => {
          props.removeHandler(event.target.id)
        }}>Remove</button>
      </div>
    </div>

  )
}

export default ListItemBoxer;