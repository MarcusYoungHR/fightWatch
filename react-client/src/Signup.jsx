import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import '../dist/styles.css'
import 'bootstrap/dist/css/bootstrap.min.css';


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
      $.ajax({
        url: this.state.method,
        type: 'get',
        //data: {user: this.state},
        success: () => {
          console.log('yay')
        },
        error: (err) => {
          console.log('error in signup \n', err)
        }
      })
    })
  }



  render() {

    return (
      <div>
        <div className = 'eyeShape'></div>
        <h1 className = 'signUpHeader'>Login</h1>
        <div className='mx-auto loginForm'>
          <form action = '/multiple'>
            <input className = 'loginInput' type='text' placeholder='user name' onChange={(event) => {
              this.changeHandler('username', event.target.value)
            }}>
            </input>
            <input className = 'loginInput' type='text' placeholder='password' onChange={(event) => {
              this.changeHandler('password', event.target.value)
            }}>
            </input>
            <button className="loginBtn btn btn-outline-secondary" onClick={(event) => {
              //event.preventDefault()
              //this.submitHandler('/multiple');
            }}> Login </button>
            <button className="btn btn-outline-secondary registerBtn" onClick={(event) => {
              event.preventDefault()
              this.submitHandler('/register');
            }}> Register </button>
          </form>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<Signup />, document.getElementById('app'));

export default Signup