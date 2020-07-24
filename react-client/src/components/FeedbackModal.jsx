import React from 'react';
import ReactModal from 'react-modal';


const FeedbackModal = (props) => (
  <ReactModal className='mx-auto my-5' isOpen={props.isOpen} style={{
    overlay: {zIndex: '20'},
    content: {  backgroundColor: 'rgba(29, 22, 22, 0.8)', color: 'rgb(230, 230, 230)', width: '100%', maxWidth: '1000px'}
  }}>
    <button className='btn btn-danger test' onClick={() => {
      props.closeModal()
    }}>X</button>

    <form className='p-4'>
      <div className="form-group" >
        <label for="exampleFormControlTextarea1">Any feeback or suggestions. If the website is malfunctioning the most useful thing you could give me is the name of the fighter you searched for.</label>
        <textarea class="form-control" id="exampleFormControlTextarea1" rows="10" onChange={(event) => {
          props.changeHandler(event.target.value)
        }}></textarea>
      </div>
      <p>{(1000 - props.message.length) + ' characters remaining'}</p> <button className='btn btn-danger test' onClick={(event)=> {
        event.preventDefault()
        props.submitHandler()
      }}>Send</button>
    </form>
  </ReactModal>
)


export default FeedbackModal