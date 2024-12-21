FROM node:18

WORKDIR /app

COPY package*.json ./

# Install both production and development dependencies
RUN npm install

# Install ts-node globally to ensure it's available
RUN npm install -g ts-node

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
