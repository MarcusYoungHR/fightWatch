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
  }

  changeHandler(entry, val) {
    this.setState({
      [entry]: val
    })
  }

  render() {

    return (
      <div>

        <div className='eyeShape'></div>

        <div className='mx-auto loginForm'>

          <h1 className='signUpHeader'>Login</h1>

          <form action='/login' method='post'>

            <input className='loginInput' type='text' placeholder='user name' id='username' name='username' onChange={(event) => {
              this.changeHandler('username', event.target.value)
            }}>
            </input>

            <input className='loginInput' type='text' placeholder='password' id='password' name='password' onChange={(event) => {
              this.changeHandler('password', event.target.value)
            }}>
            </input>

            <button className="loginBtn btn btn-outline-secondary"> Login </button>

            <button className="btn btn-outline-secondary registerBtn" formAction='/register' formMethod='post'> Register </button>

          </form>
          <p className='loginText'>Don't have an account? Registering is easy! Simply choose a name and password and hit register. No email verification or password complexity required.</p>
        </div>

      </div>
    )
  }
}

ReactDOM.render(<Signup />, document.getElementById('app'));

export default Signup