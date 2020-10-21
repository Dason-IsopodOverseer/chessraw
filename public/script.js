var config = {
  position: 'start',
  draggable: true
}

window.data = "Empty";
window.user = "None"

var url = "https://lichess.org/api/";
const userParam = {
  headers: {
    Authorization: "Bearer pENCnq9y3f3t8Drd"
    
  },
  method: "GET"
};


function go() {
  var input = document.getElementById("input").value;
  if (input == "") {
    console.log("No input");
  } else {
    console.log("New fen input = "+ input);
    
    // Fetch from different API to get user info
    fetch(url + "account/email", userParam) // Call the fetch function passing the url of the API as a parameter
      .then(response => {
        if (response.ok) {
          response.json().then(json => {
            window.user = json;
          })
          .then(function (){
            document.getElementById("user").innerHTML = "Current User: " + window.user.email;
          })
        }
      }) // Transform the data into json
      .catch(function(error) {
        console.log(error);
      });
    
    var url3 = url + "cloud-eval?fen=" + input;
    fetch(url3, userParam) // Call the fetch function passing the url of the API as a parameter
      .then(response => {
        if (response.ok) {
          response.json().then(json => {
            window.data = json;
          })
          .then(function (){
            document.getElementById("next").innerHTML = "Analysis of next best move: " + window.data.pvs[0].moves.split(" ")[0];
          })
        }
      }) // Transform the data into json
      .catch(function(error) {
        console.log(error);
      });
  }
}

function test() {
  console.log(window.data);
}

window.onload = function () {
var board = null
var game = new Chess()
var $status = $('#status')
var $fen = $('#fen')

function onDragStart (source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false

  // only pick up pieces for the side to move
  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false
  }
}

function onDrop (source, target) {
  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  })

  // illegal move
  if (move === null) return 'snapback'

  updateStatus()
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd () {
  board.position(game.fen())
}

function updateStatus () {
  var status = ''

  var moveColor = 'White'
  if (game.turn() === 'b') {
    moveColor = 'Black'
  }

  // checkmate?
  if (game.in_checkmate()) {
    status = 'Game over, ' + moveColor + ' is in checkmate.'
  }

  // draw?
  else if (game.in_draw()) {
    status = 'Game over, drawn position'
  }

  // game still on
  else {
    status = moveColor + ' to move'

    // check?
    if (game.in_check()) {
      status += ', ' + moveColor + ' is in check'
    }
  }

  $status.html(status)
  $fen.html(game.fen())
  if (game.pgn() != "") {
	console.log(game.pgn())
  } 
}

var config = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd
}
board = Chessboard('board1', config)

updateStatus()
  
}
