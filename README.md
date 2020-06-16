#Proyecto de juego.
Elige tu propia aventura

***

Base de datos: Mongo Atlas

Estrucrura de datos del usuario:

{
  "gameState":"0A",
  "username":"Paula",
  "gameState":"0A"
}

Cada usuario tiene un gameState, para identificar su camino en el juego

Estrucrura de datos del Juego, caminos y resultados:

  {
  "id":"0A",
  "narrative":"Comienzo de la etapa 1 ,<br/>puedes buscar algo útil, a ver que encunetras.O usar el encendedor que tienes en la mano",
  "optionA":"Buscar",
  "optionB":"Usar",
  "gameFinal": false,
  "dialogASuccess":"Encuentras una nota que dice incoherencias e insultos hacia una persona... ",
  "dialogAFail":"No encuentras nada ladoA",
  "dialogBSuccess":"Usas el encendedor, descubres que estas en una sala,",
  "dialogBFail":"Intentas usar un encendedor pero no funciona"
  }

"id":"0A"

es el identificador del camino especifico, camino que se le dará al jugador en caso que gameState coincida.

"optionA":"Buscar",
"optionB":"Usar",

LOs botones se renderizan dinamicamente, dependiendo el camino.

"gameFinal": false,

Indica si este camino es un ending

"dialogASuccess":"Encuentras una nota que dice incoherencias e insultos hacia una persona... ",
"dialogAFail":"No encuentras nada ladoA",
"dialogBSuccess":"Usas el encendedor, descubres que estas en una sala,",
"dialogBFail":"Intentas usar un encendedor pero no funciona"

Las distintas respuestas, segun si se apretó el boton A o B.
Tiene una verificacion de success y fail: Cuando se toma una decision, se tiran los dados, las dos salidas son:
numRand < 3 == fail || numRand > 3 == success
