# TODO: Reemplazar JSON/localStorage con API

## userService.js
- [x] Corregir updateUser() para no usar id en URL
- [x] Verificar que todas las funciones usen API correctamente

## useMatches.js
- [x] Actualizar useMatches para usar API en lugar de localStorage
- [x] Implementar fetchMatches desde /matches
- [x] Implementar createMatch con POST /matches
- [x] Implementar deleteMatch con DELETE /matches/:id
- [x] Implementar joinMatch con PUT /matches/join/:id
- [x] Implementar leaveMatch con PUT /matches/leave/:id
- [x] Probar que las funciones funcionen correctamente

## Game.jsx
- [x] Reemplazar localStorage de allUsers con API call
- [x] Actualizar handleJoinMatch para no pasar user.id
