# Usa a imagem oficial do Node.js
FROM node:18

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos para o container
COPY package.json package-lock.json ./
RUN npm install

# Copia o restante do código
COPY . .

# Expõe a porta que o backend usa
EXPOSE 3000

# Comando para iniciar o backend
CMD ["npm", "start"]

