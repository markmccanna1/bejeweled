jewel.screens['game-screen'] = (function() {
  var board = jewel.board,
  display = jewel.display,
  input = jewel.input,
  cursor,
  settings = jewel.settings,
  firstRun = true

  //this input module can trigger these actions:
  // selectJewel, moveLeft, moveRight, moveUp, moveDown

  // if another jewel was already selected, you can use the distance ebtween the two jewels
  // to determine the approrpiate action
  // based on the board module, if the distance between two jewels is 1, they are adjacent
  // a distance of 0 means that the same jewel was selected again, and any other distance means that 
  // a jewel too far away was selected

  // if a player selects the same jewel twice, the jewel is deselected by calling the setCursor function 
  // with false as the value of the selected paramter
  // if the selected jewel is a neighbor of the already selected position, you try to swap the two jewels by calling the board.swap function
  // the first argument to the swap method is the callback function
  // here a function called playBoardEvents is passed, its called whener the board module finsihes moving around jewels and
  // updating the board data
  // the swap function calls its callback function with a single argument, which is an array of all the events that took place between the old and new state of the board

  function selectJewel(x,y){
    if (arguments.length == 0){
      selectJewel(cursor.x, cursor.y)
      return
    }
    if (cursor.selected) {
      var dx = Math.abs(x - cursor.x),
      dy = Math.abs(y - cursor.y),
      dist = dx + dy

      if (dist == 0){
        // deselected the selected jewel
        setCursor(x, y, false)
      } else if (dist == 1) {
        // selected an adjacent jewel
        board.swap(cursor.x, cursor.y, x, y, playBoardEvents)
        setCursor(x,y,false)
      } else {
        // selected a different jewel
        setCursor(x,y,true)
      }
    } else {
      setCursor(x,y,true)
    }
  }

  // if the events array contains any elements, the first event is removed from the array and stored in the boardEvent variable
  // the next function is a small helper method that calls playBoardEvents() recursively on the rest of the events
  // the event objcets in the events array all have a type property that indicates the type of the event and a data property
  // that holds any data relevant to that specific event
  // each type of event triggers a different function on the display module
  // theyre all asynchronous functions that you use to animate the display
  // the next function is passed as a callback function to make sure the rest of the ecents are processed 
  // after the animation finishes


  function playBoardEvents(events){
    if (events.length > 0){
      var boardEvent = events.shift(),
      next = function(){
        playBoardEvents(events)
      }

      switch (boardEvent.type) {
        case 'move':
          display.moveJewels(boardEvent.data, next)
        break
        case 'remove':
          display.removeJewels(boardEvent.data, next)
        break
        case 'refill':
          display.refill(boardEvent.data, next)
        break
        default:
          next()
        break
      }
    } else {
      // console.log(board.getBoard())
      display.redraw(board.getBoard(), function() {
        // good to go again
      })
    }
  }

// _________________________________________
  //this fucking thing, right here baby
  // this uses the asynchronous initialize function on the board module 
  // this board initialize method is the crazy one with the callback method
  function run() {
    if (firstRun) {
      setup()
      firstRun = false
    }
    board.initialize(function() {
      display.initialize(function(){
        cursor = {
          x: 0,
          y: 0,
          selected: false
        }
        display.redraw(board.getBoard(), function() {})
      })
        // display.redraw(board.getBoard(), function() {})
    })
  }

  function setup(){
    input.initialize()
    input.bind('selectJewel', selectJewel)
    input.bind('moveUp', moveUp)
    input.bind('moveDown', moveDown)
    input.bind('moveLeft', moveLeft)
    input.bind('moveRight', moveRight)

  }

  function moveCursor(x,y){
    if (cursor.selected) {
      x += cursor.x
      y += cursor.y
      if (x >= 0 && x < settings.cols && y >= 0 && y < settings.rows) {
        selectJewel(x,y)
      }
    } else {
      x = (cursor.x + x + settings.cols) % settings.cols
      y = (cursor.y + y +settings.rows) % settings.rows
      setCursor(x,y,false)
    }
  }

  //this function sets the current cursor values, and also tells the game display to update the rendering of the cursor
  function setCursor(x, y, select){
    cursor.x = x
    cursor.y = y
    cursor.selected = select
    display.setCursor(x,y,select)
  }

  function moveUp(){
    moveCursor(0, -1)
  }

  function moveDown(){
    moveCursor(0, 1)
  }

  function moveLeft(){
    moveCursor(-1, 0)
  }

  function moveRight(){
    moveCursor(1, 0)
  }

  return {
    run : run
  }
})()