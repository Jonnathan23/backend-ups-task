# Backend
Backend para el proyecto Uptask con el ``modelo vista controlador``

``Nota:`` Hay que tener en cuenta el tipo de datos cuando se trabaja con mongo y typescript a la vez ya que algunos esquemas de mong

## Express Validator

```bash
npm i express-validator
```

## JWT
Para el manejo de sesiones del usuario JWT.

```bash
npm i jsonwebtoken
```

Para ``typescript``

```bash
npm i --save-dev @types/jsonwebtoken
```

Para hacer uso del JWT es necesario crear una ``llave privada`` en las varialbes de entorno para generar un JWT


# Docker

```ts
# 🏗️ Etapa 1: Construcción con Node.js
FROM node:20 AS build

# Definir el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar archivos de dependencias primero (para aprovechar la caché de Docker)
COPY package.json package-lock.json ./
RUN npm install

# Copiar el código fuente y compilar TypeScript
COPY . .
RUN npm run build

# 🚀 Etapa 2: Ejecución en una imagen más ligera
FROM node:20-alpine

# Definir el directorio de trabajo
WORKDIR /app

# Copiar solo los archivos necesarios desde la etapa de construcción
COPY --from=build /app/dist /app
COPY package.json package-lock.json ./

# Instalar solo las dependencias necesarias para producción
RUN npm install --omit=dev

# Exponer el puerto de la API
EXPOSE 3000

# Comando para ejecutar el servidor
CMD ["node", "server.js"]
```
