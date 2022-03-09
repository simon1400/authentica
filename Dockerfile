FROM node:12-alpine

RUN mkdir -p /var/www/authentica/client/node_modules && chown -R node:node /var/www/authentica/client

WORKDIR /var/www/authentica/client

COPY package*.json ./
RUN yarn install
COPY --chown=node:node . .

RUN yarn sitemap
RUN yarn build

EXPOSE 3002

CMD [ "npm", "start" ]
