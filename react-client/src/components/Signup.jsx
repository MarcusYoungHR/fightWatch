import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';



class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      method: '/signup'
    }
    this.changeHandler = this.changeHandler.bind(this)
    this.submitHandler = this.submitHandler.bind(this)
  }

  changeHandler(entry, val) {
    this.setState({
      [entry]: val
    })
  }

  submitHandler(method) {
    this.setState({
      method: method
    }, () => {
      console.log(this.state.method)
      // $.ajax({
      //   url: this.state.method,
      //   type: 'POST',
      //   data: {user: this.state},
      //   success: () => {
      //     console.log('yay')
      //   },
      //   error: (err) => {
      //     console.log('error in signup \n', err)
      //   }
      // })
    })
  }

  render() {

    return (
      <div class = 'mx-auto' style={{width: '200px', backgroundColor: 'white'}}>
        <form>
          <input type='text' placeholder='user name' onChange={(event) => {
            this.changeHandler('username', event.target.value)
          }}>
          </input>
          <input type='text' placeholder='password' onChange={(event) => {
            this.changeHandler('password', event.target.value)
          }}>
          </input>
          <button className="btn btn-outline-secondary" onClick={(event) => {
            event.preventDefault()
            this.submitHandler('/signup');
          }}> Login </button>
          <button className="btn btn-outline-secondary" style = {{marginLeft: '30px'}} onClick={(event) => {
            event.preventDefault()
            this.submitHandler('/register');
          }}> Register </button>
        </form>
      </div>
    )
  }
}

export default Signup