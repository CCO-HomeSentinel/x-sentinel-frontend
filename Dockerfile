# Usa uma imagem base do Node.js
FROM node:20 AS build

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de pacotes e instala as dependências
COPY package*.json ./
RUN npm install

# Copia o restante do código do aplicativo
COPY . .

# Compila a aplicação Angular
RUN npm run build --configuration=local

# Usa uma imagem base para servir o conteúdo estático
FROM nginx:alpine

# Copia os arquivos compilados para o Nginx
COPY --from=build /app/dist/x-sentinel-frontend /usr/share/nginx/html

# Expondo a porta que o Nginx vai usar
EXPOSE 80

# Comando para rodar o Nginx
CMD ["nginx", "-g", "daemon off;"]
