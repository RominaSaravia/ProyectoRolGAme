#Proyecto de juego.
Elige tu propia aventura

***

____Base de datos: Mongo Atlas____



+ **Estrucrura de datos del usuario:**
```javascript
{
  "gameState":"0A",
  "username":"Paula",
  "gameState":"0A"
}
```

"gameState" identificador del camino del usuario en el juego

+ **Estrucrura de datos del Juego, caminos y resultados:**
```javascript
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
```
```javascript
"id":"0A"
```

es el identificador del camino especifico, camino que se le dará al jugador en caso que gameState coincida.
```javascript
"optionA":"Buscar",
"optionB":"Usar",
```

Los botones se renderizan dinamicamente, dependiendo el camino.
```javascript
"gameFinal": false, 
```
Indica si este camino es un ending
```javascript
"dialogASuccess":"Encuentras una nota que dice incoherencias e insultos hacia una persona... ",
"dialogAFail":"No encuentras nada ladoA",
"dialogBSuccess":"Usas el encendedor, descubres que estas en una sala,",
"dialogBFail":"Intentas usar un encendedor pero no funciona"
```
Las distintas respuestas, segun si se apretó el boton A o B.
Tiene una verificacion de success y fail: Cuando se toma una decision, se tiran los dados, las dos salidas son:
```javascript
numRand < 3 == fail || numRand > 3 == success
```
