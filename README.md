# Proyecto de juego

### Elige tu propia aventura

El proyecto consiste en jugar una aventura narrativa con la incorporación de dados en la realización de acciones.

+ Podes hacerte una cuenta.
+ ver que aventuras hay disponibles.
+ Hay aventuras en solitario o multijugador. 
+ El usuario elige y empieza a jugar.

Las historias son simples, pero hay dos posibles caminos a cada paso que quiera dar el personaje. Con su probabilidad de éxito o fallo al querer realizar cada acción. 

Por lo tanto el jugador tendrá que decidir que camino tomar y dependerá del resultado de los dados para seguir con la historia.

---

### Pre-requisitos:
```sh
node.js
```

### Instalación
```sh
ejecutar: npm update
ejecutar: npm run start
```
### Tecnologias usadas
```sh
nodeJs
express
express-handlebars
mongodb
```
---

### Estructura de datos:
Usuario:
```javascript
{
  "gameState":"0A",   // ID: guarda el camino elegido por el jugador
  "username":"Paula",
  "password":"******"
}
```

Juego: opciones, caminos y resultados:
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
