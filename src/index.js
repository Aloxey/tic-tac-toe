import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import axios from 'axios';

//  This file includes all the functionallity for the tic-tac-to game


//  Returns a signle <button> which used to put together 9 of them
//  and create the tic-tac-toe board
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}


//  Returns a "board" - a <div> object that includes 9 "square"s
//  in a shape of tic-tac-toe board
class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div className= "board-itself">
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}


//  Generates and returns inside a <div> name and image of random people 
//  with https://randomuser.me/ API, 
class Person extends React.Component {

  constructor(props) {
    super(props);
  this.state = {
    firstName: "",
    lastName: "",
    picUrl: ""
  }
  }

  componentDidMount() {
  axios.get(
    'https://randomuser.me/api/',  
      { responseType: 'json',
       dataType: 'json' } ) 
      .then(response => {
      var first = response.data.results[0].name.first;
      var last = response.data.results[0].name.last;
      var pic = response.data.results[0].picture.medium;

      this.setState({
        firstName: first,
        lastName: last,
        picUrl: pic
      });

      });
    }

  render() {
    return (
      <div className="person">
        <ol><img src = {this.state.picUrl} alt=" "/></ol>
        <ol>{this.state.firstName} {this.state.lastName}</ol>
      </div>
    );
  }
}


//  Renders and returns all the pieces of the game together
//  and returns them for display in the browser 
class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true
    };
  }

  //  Handles the clicks in the game, creates functionallity
  //  for adding X and O to "square"s, checks when there's a winner or a tie,
  //  and saves the history of the game for possible usage
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    //  Restart Button
    const restart = 
            <button className= "restart" onClick={() => 
              {
                this.setState ({
                   history: [
                     {
                        squares: Array(9).fill(null)
                     }
                    ],
                   stepNumber: 0,
                  xIsNext: true
               });
              }
            }>
              Restart
            </button>;

    //  Changes thew statues line if there's a winner or tie
    let status;

    if (history.length === 10){
      status = "Tie";
    }

    if (winner) {
      status = "Winner: " + winner;
    } else if (history.length != 10){
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }  


    return (
      <div className="top-container">
         
         <div className="top-container-row">
         <div className="person-container">
         <Person />
         <p className="person-state">X</p>
         </div>
          <div className="game">

           <div className="game-board">
              <div>{status}</div>
              <Board
               squares={current.squares}
               onClick={i => this.handleClick(i)}
                />
              <ol className="restart-btn">{restart}</ol>
           </div>

           <div className="game-info">
           </div>
        </div>
  <div className="person-container">
   <Person />
   <p className="person-state">O</p>
   </div>
       </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

