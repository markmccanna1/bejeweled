jewel.input = (function() {
  var dom = jewel.dom,
  $ = dom.$,
  settings = jewel.settings,
  inputHandlers

  function bind(action, handler){
    if (!inputHandlers[action]) {
      inputHandlers[action] = []
    }
    inputHandlers[action].push(handler)
  }

  function trigger(action){
    var handlers = inputHandlers[action],
    args = Array.prototype.slice.call(arguments, 1)
    if (handlers){
      for (var i = 0; i < handlers.length; i++){
        handlers[i].apply(null, args)
      }
    }
  }

  function initialize(){
    inputHandlers = {}

    var board = $('#game-screen .game-board')[0]

    dom.bind(board, 'mousedown', function(event) {
    //   // the event object is passed on to a second fucntion, along with the name of the game action
    //   // this behavior happens so that the same logic can be reused for touch events
      handleClick(event, 'CLICK', event)
    })

    dom.bind(board, 'touchstart', function(event){
      handleClick(event, 'TOUCH', event.targetTouches[0])
    })

    // dom.bind(document, 'keydown', function(event){
    //   var keyName = keys[event.keyCode]
    //   console.log(keyName)
    //   if (keyName && settings.controls[keyName]) {
    //     event.preventDefault()
    //     trigger(settings.controls[keyName])
    //   }
    // })
  }

//   //if any handlers are bound to the specified action, all the handler functions are called
//   // any arguments passed to trigger beyond the named action argument are extracted by borrowing the slice method from array
//   // the resulting array of argument values is then used when calling the handler functions via apply
//   function trigger(action) {
//     var handlers = inputHandlers[action],
//     args = Array.prototype.slice.call(arguments, 1)
//     if (handlers) {
//       for (var i = 0; i < handlers.length; i++) {
//         // console.log(handlers[i])
//         handlers[i].apply(null, args)
//       }
//     }
//   }

  function handleClick(event, control, click){
    // is any action bound to this control?
    var action = settings.controls[control]
    if (!action) {
      return
    }
    var board = $('#game-screen .game-board')[0],
    rect = board.getBoundingClientRect(), 
    relX, relY,
    jewelX, jewelY

    // click position relative to the board
    relX = click.clientX - rect.left
    relY = click.clientY - rect.top

  //   // jewel coordinates
    jewelX = Math.floor(relX / rect.width * settings.cols)
    jewelY = Math.floor(relY / rect.height * settings.rows)

  //   // trigger functions bound to action
    trigger(action, jewelX, jewelY)
  // // prevent click from browser
    event.preventDefault()
  }

  return {
    initialize : initialize,
    bind: bind
  }
})()