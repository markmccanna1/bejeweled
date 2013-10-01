bejeweled
=========
This is my progress through Jacob Seidelin's book "HTML5 Games: Creating Fun with HTML5, CSS3, and WebGL"

it's a pretty neat book.

so far theres a board with sprites that you can click to swap jewels around, the matched jewels are deleted,
existing jewels are shifted down, and new jewels are populated at the top.

it is meant to adjust to mobile devices, it utilizes a web worker for desktops, and some pretty neat OOJS
concepts. 

Since the game uses a web worker, running the game locally poses some minor inconveniences. 

Feel free to clone and run it locally

I had to rename my chrome to one word, and then open it from the command line with a special tag allowing
the worker access to your computer (supposedly this isn't a problem if you run it on the internet, rather
locally)

the command I ended up using was: 
/Applications/GoogleChrome.app/Contents/MacOS/Google\ Chrome --allow-file-access-from-files


up next: 

keeping track of a players score, adding node.js, and moar that I dont know about yet!
