import React from 'react';
import ReactModal from 'react-modal';

const SignupModal = (props) => (

  <ReactModal className='mx-auto my-5 align-middle' isOpen={props.isOpen} style={{
    overlay: { zIndex: '20' },
    content: { backgroundColor: 'rgba(29, 22, 22, 0.8)', color: 'rgb(230, 230, 230)', width: '100%', maxWidth: '500px' }
  }}>

    <button className='btn btn-danger test' onClick={() => {
      props.closeModal()
    }}>X</button>
    <div className='p-4'>
      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <span className="input-group-text" style={{backgroundColor: 'rgb(138, 3, 3)', color: 'rgb(230, 230, 230)', borderColor: 'rgb(138, 3, 3)'}}>username</span>
        </div>
        <input type="text" className="form-control" aria-label="Text input with checkbox" onChange={(event)=> {
          props.changeHandler('username', event.target.value)
        }}></input>
      </div>

      <div className="input-group">
        <div className="input-group-prepend">
          <span className="input-group-text" style={{backgroundColor: 'rgb(138, 3, 3)', color: 'rgb(230, 230, 230)', borderColor: 'rgb(138, 3, 3)'}}>password</span>
        </div>
        <input type="password" className="form-control" aria-label="Text input with radio button" onChange={(event)=> {
          props.changeHandler('password', event.target.value)
        }}></input>
      </div>

      <div className='input-group pt-3'>
        <button className="btn btn-danger test" type="button" id="button-addon1" onClick={(event)=> {
          event.preventDefault()
          props.submitHandler('/register')
        }}>Sign up</button>
      </div>
    </div>

  </ReactModal>


)

export default SignupModal