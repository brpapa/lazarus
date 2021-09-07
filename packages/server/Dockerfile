FROM node:16

LABEL maintainer="Bruno Papa <bruno.papa@hotmail.com>"

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app
RUN npm i

COPY . /app

RUN npm run build

CMD ["npm", "start"]
