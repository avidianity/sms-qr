FROM node:16

USER node

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

WORKDIR /home/node

COPY package.json .

COPY yarn.lock .

COPY .env.example .env

RUN yarn

COPY . .

CMD [ "yarn", "start:dev" ]
