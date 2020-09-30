# Proyecto de juego
En desarrollo...

### Elige tu propia aventura 
:female_detective: :mage_man: :prince: :princess: :supervillain: :superhero_woman: :fairy: :elf_woman: :elf:

El proyecto consiste en jugar una aventura narrativa con la incorporación de dados en la realización de acciones.

+ Podes hacerte una cuenta.
+ ver que aventuras hay disponibles.
+ Hay aventuras en solitario o multijugador. 
+ El usuario elige y empieza a jugar.

Las historias son simples, pero hay dos posibles caminos a cada paso que quiera dar el personaje. Con su probabilidad de éxito o fallo al querer realizar cada acción. 

Por lo tanto el jugador tendrá que decidir que camino tomar y dependerá del resultado de los dados para seguir con la historia.
Live demo: [DEMO](https://limitless-hamlet-37147.herokuapp.com/main-page "ROLGAME")

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
  "username":"",
  "password":""
}
```

Juego: opciones, caminos y resultados:
```javascript
  {
  "id":"0A",  // ID del camino tomado.
  "narrative":"string",   // Texto que se muestra dando el contexto y los posibles caminos.
  "optionA":"string",    // Botón A
  "optionB":"string",      // Botón B
  "gameFinal": false,   // Verifica si es un ending
  "finalText": "string"
  "dialogASuccess":"string",  // Texto Success
  "dialogAFail":"string"     // Texto Fail
  }
```
