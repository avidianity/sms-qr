FROM node:16

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin
ENV TZ=Asia/Manila

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime
RUN echo $TZ > /etc/timezone

USER node

WORKDIR /home/node

COPY package.json .

COPY yarn.lock .

COPY .env.example .env

RUN yarn

COPY . .

CMD [ "yarn", "start:dev" ]
