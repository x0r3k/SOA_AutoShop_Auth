FROM node:12

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . /usr/src/app

ENV NODE_ENV=docker

CMD ["npm", "run", "start:manual"]