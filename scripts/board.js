jewel.board = (function(){
  // game functions go here
  var settings, jewels, cols, rows, baseScore, numJewelTypes


  //jewels is a 2d array that represents the current status of the board, each jewel is represented
  // by an integer value that indicates the type of the jewel
  function initialize(callback){
    settings = jewel.settings
    numJewelTypes = settings.numJewelTypes
    baseScore = settings.baseScore
    cols = settings.cols
    rows = settings.rows
    fillBoard()
    callback()
  }

  //this print function simply outputs the board to the console, and is here to help debug
  // if you want to see the board data just type jewel.board.print() into the console
  function print(){
    var str = ''
    for (var y = 0; y < rows; y++){
      for (var x = 0; x < cols; x++){
        str += getJewel(x,y) + ' '
      }
      str += '\r\n'
    }
    console.log(str)
  }


  //initializes the board with random jewels
  //this function starts at the top left, and goes to the bottom right, which means that there 
  //as youre filling the board, you just have to check the jewels above and to the left of it
  // to ensure you dont get automatic matches
  function fillBoard(){
    var x, y, type
    jewels = []

    for(x = 0; x < cols; x++){
      jewels[x] = []
      for(y = 0; y < rows; y++){
        type = randomJewel()
        while ((type === getJewel(x-1,y) && type === getJewel(x-2,y)) ||
               (type === getJewel(x,y-1) && type === getJewel(x,y-2))) {
          type = randomJewel()
        }
        jewels[x][y] = type
      }
    }
    //recursive fill if new board has no moves
    if ( !hasMoves() ){
      fillBoard()
    }
  }

  //simply returns an integer between 0 and jeweltypes - 1
  function randomJewel(){
    return Math.floor(Math.random() * numJewelTypes)
  }

  // without some form of bounds, you will start checking spaces outside of the jewel array's positions
  // using this getJewel helper will help you to avoid these errors
  function getJewel(x,y){
    if (x < 0 || x > cols - 1 || y < 0 || y > rows - 1){
      return -1
    } else {
      return jewels[x][y]
    }
  }

  function swap(x1, y1, x2, y2, callback){
    var tmp, events

    if (canSwap(x1,y1,x2,y2)) {
      // swap the jewels
      tmp = getJewel(x1, y1)
      jewels[x1][y1] = getJewel(x2,y2)
      jewels[x2][y2] = tmp

      //check the board and get list of events
      events = check()
      callback(events)
    } else {
      callback(false)
    }
  }

  //returns the number jewels in the longest chain that includes x,y
  function checkChain(x,y){  
    var type = getJewel(x,y),
    left = 0, right = 0,
    down = 0, up = 0

    //look right
    while (type === getJewel(x + right + 1, y)){
      right++
    }

    // left
    while (type === getJewel(x - left - 1, y)){
      left++
    }

    //up
    while (type === getJewel(x, y + up + 1)){
      up++
    }

    //down
    while (type === getJewel(x,y - down - 1)){
      down++
    }

    return Math.max(left + 1 + right, up + 1 + down)
  }

  //check whether or not a swap is valid, onyl neighbors can be swapped
  //returns true if x1y1 can be swapped with x2y2
  function canSwap(x1, y1, x2, y2){
    var type1 = getJewel(x1, y1),
    type2 = getJewel(x2,y2), chain

    if (!isAdjacent(x1,y1,x2,y2)) {
      return false
    }

    // temporarily swap the jewels
    jewels[x1][y1] = type2
    jewels[x2][y2] = type1

    chain = (checkChain(x2,y2) > 2 || checkChain(x1,y1) > 2)

    //swap back
    jewels[x1][y1] = type1
    jewels[x2][y2] = type2

    return chain
  }

  //this function looks at the distance between the positions along both axes, also called the
  // manhattan distance
  function isAdjacent(x1,y1,x2,y2){
    // returns true if 2 cells are adjacent
    var dx = Math.abs(x1 - x2),
    dy = Math.abs(y1 - y2)
    return (dx + dy === 1)
  }

  // returns a 2 dimensional map of chain lengths
  // the variable returned is a 2d map of the board, insteal of jewel types,
  // it holds information about the chains in which the jewels take part,
  // each position on the board is checked by calling checkChain, and the corresponding position
  // in the chains map is assigned the return value
  function getChains(){
    var x,y,chains = []

    for(x = 0; x < cols; x++){
      chains[x] = []
      for(y = 0; y < rows; y++){
        chains[x][y] = checkChain(x,y)
      }
    }
    return chains
  }


  // this removes jewels from the board and populates new ones
  // the function also collects info about the jewels in 2 arrays, moved and removed
  // you need it later for animating changes on the screen
  // the check function visits every position on the board, if the position is marked in a chains
  // map with a value greater than 2, information about the position and jewel type using an object literal
  // the inner loop examines the rows from the bottom up instead of the top down approach
  // this lets you immediately start moving the other jewels down

  // this also has a gaps array that contains a counter for reach colm
  // before it processes a column, it sets the counter for that column to 0
  // every time a jewel is removed the counter is incremented
  // whenever a jewel is allowed to stay, the gap counter determines whether the jewel should be moved down
  // if the counter is positive, the jewel must be moved down an equal number of rows
  // this is all stored in the moved object literal


  // the check function must call itself recursively until there are no chains left 
  function check(events){
    var chains = getChains(), hadChains = false, score = 0,
    removed = [], moved = [], gaps = []

    for (var x = 0; x < cols; x++){
      gaps[x] = 0
      for (var y = rows - 1; y >= 0; y--){
        if(chains[x][y] > 2){
          hadChains = true
          gaps[x]++
          removed.push({
            x : x,
            y : y, 
            type : getJewel(x,y)
          })
          //add points to score
          score += baseScore * Math.pow(2, (chains[x][y] - 3))
        }
        else if (gaps[x] > 0){
          moved.push({
            toX : x, toY : y + gaps[x],
            fromX : x, fromY: y,
            type : getJewel(x,y)
          })
          jewels[x][y + gaps[x]] = getJewel(x,y)
        }
      }
      //fill from the top
      //the number of new jewels you need to create in a colm is equal to the number
      // of gaps found in that colm
      // information about the new jewels is also added to the moved array alonside any existing jewels
      // 
      for(y = 0; y < gaps[x]; y++){
        jewels[x][y] = randomJewel()
        moved.push({
          toX: x, toY: y, fromX: x, fromY: y - gaps[x],
          type: jewels[x][y]
        })
      }
    }

    //you need to call check until there are no chains left
    // you need to join the data collected in removed, moved, and score
    // with whatever data the recursive calls collect
    events = events || []
    //this events array is 3 objects that consist of everything that happened between the
    // last swap and the final board
    if (hadChains) {
      events.push({
        type: 'remove',
        data: removed
      }, {
        type: 'score',
        data: score
      }, {
        type: 'move',
        data: moved
      })
      if (!hasMoves() ){
        fillBoard()
        events.push({
          type: 'refill',
          data: getBoard()
        })
      }
      return check(events)
    } else {
      return events
    }
  }

  //this returns true if at least one jewel can be moved to form a chain
  function hasMoves(){
    for (var x = 0; x < cols; x++){
      for (var y = 0; y < rows; y++){
        if (canJewelMove(x,y)) {
          return true
        }
      }
    }
    return false
  }

  //to check whether a given jewel can be moved to form a new chain, the function uses canSwap to 
  // test whether the jewel can be swapped with one if its four neighbors
  // each canswap call is only performed if the neighbor is within bounds of the board, that is
  // canswap tries to swap the jewel with its left neighbor only if the jewels x coordinte is at least 
  // 1 and less than cols - 1
  function canJewelMove(x,y){
    return ((x > 0 && canSwap(x, y, x-1, y)) ||
            (x < cols - 1 && canSwap(x, y, x+1, y)) ||
            (y > 0 && canSwap(x, y, x, y-1)) ||
            (y < rows - 1 && canSwap(x, y, x, y+1)))
  }


  function getBoard(){
    var copy = [], x

    for (x = 0; x < cols; x++) {
      copy[x] = jewels[x].slice(0)
    }
    return copy
  }

  //with these functions exposed the only way to altar the board is to set up a fresh board or call swap
  //since all the rules of the game are enforced by swap, game integrity is ensured

  return {
    // exposed functions go here
    initialize : initialize,
    swap : swap,
    canSwap : canSwap,
    getBoard : getBoard,
    print : print
  }
})()



























