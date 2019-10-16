import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
//import List from './components/List.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      fighter: '',
      test: ''
    }
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
    // $.ajax({
    //   url: '/items',
    //   success: (data) => {
    //     this.setState({
    //       items: data
    //     })
    //   },
    //   error: (err) => {
    //     console.log('err', err);
    //   }
    // });
  }

  onChange(val) {
    this.setState({
      fighter: val
    })
  }

  onSubmit() {
    $.ajax({
      url: '/search',
      data: {fighter: this.state.fighter},
      success: (data) => {
        console.log(data)
        this.setState({
          test: data
        })
      },
      error: (err) => {
        console.log('error in search get request: \n', err)
      }
    })
  }

  onClick() {
    console.log(this.state);
  }

  render() {
    return (
    <div>
      <form  onSubmit={(event) => {
          event.preventDefault();
          this.onSubmit();
        }}>
        <input type='text' placeholder='fighter name...' onChange={(event) => {
          //</form>console.log(event.target)
          this.onChange(event.target.value);
        }}></input>
        <input type='submit' value='search'></input>
      </form>
      <button onClick={
        this.onClick()
      }>show state</button>
    </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));