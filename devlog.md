# Doodling DEVLOG

Doodling is a new project for a real-time drawing game inspired by Skribbl.io. It will be based on a node/express/socket.io server (Heroku hosted) and a React SPA (hosted on Netlify/Gh pages ?). A cloud-hosted MongoDB DB should also be added mainly for practice with Mongo/Mongoose and to keep players statistics and info. Drawing shall be based on P5.js lib

The following features should be implemented :

* Possibility to signup/sign-in or use app as a guest 
* Choose an avatar for session / account
* Create a game room with shareable link (room id => uuid ?)
* Join a room 
* Game creator can set parameters (number of turn /draw time ?) (Lobby)
* Game creator can start the game (Lobby)
* On player turn can draw and other players can guess
* Turns end if everybody guess right or after time run out
* Games end and increment stats after number of rooms
* On game end - return to lobby
* Light/Dark Theme

## Front-end

No router , three views with a fix header and a footer with my info and repo. Chat for lobby and in game for medium + screen (need to think for mobile) 

* Home Screen
* Lobby
* In-Game
  * Drawing Area (P5.js canvas)
    * Color selection , size selection / (fill method if time)
  * Input Area (text input field and submit button)
  * Players Area (scores and see if they found the answer (badge))
  

## Back-end

### Game Logic 

* Game Engine States
  * Starting
  * In Round
  * Next Player
  * End Game

### Socket Events



## 2022-01-07

Initialize project. 

Wrote requirements.

Watched online course about socket.io and tailwind.

## 2022-01-10

Let's try to implement the basic lobby.

Create Private Room use his own Socketid

Adding a socket to a room, each socket is its own room so the room creator just share his socket id and anybody can join this room , if the room exists in the rooms map
``` io.sockets.adapter.rooms.get("room name") ```


