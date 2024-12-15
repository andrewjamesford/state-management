FROM node:22-alpine
WORKDIR /app
ENV CHOKIDAR_USEPOLLING=true
COPY package*.json /app/
RUN ["npm", "install"]
COPY . /app
EXPOSE 4002
ENTRYPOINT ["npm", "run", "dev"]