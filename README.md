##Proyecto de juego.
Elige tu propia aventura

***
Requerimientos: node.js,


____Base de datos: Mongo Atlas____



+ **Estructura de datos del usuario:**
```javascript
{
  "gameState":"0A",   // ID: guarda el camino elegido por el jugador
  "username":"Paula",
  "password":"******"
}
```


+ **Estrucrura de datos del Juego, caminos y resultados:**
```javascript
  {
  "id":"0A",  // ID del camino tomado.
  "narrative":"Comienzo de la etapa 1 ,<br/>puedes buscar algo útil, a ver que encunetras.O usar el encendedor que tienes en la mano",  // Texto que se muestra dando el contexto y los posibles caminos.
  "optionA":"Buscar",   // Botón A
  "optionB":"Usar",     // Botón B
  "gameFinal": false,   // Verifica si es un ending
  "finalText": "Logras llegar al final de esta historia, gracias por jugar"
  // Una vez tirados los dados
  "dialogASuccess":"Encuentras una nota que dice incoherencias e insultos hacia una persona... ", // Success
  "dialogAFail":"No encuentras nada ladoA"  // Fail
  }
```