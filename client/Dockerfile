FROM node:14.0.0-alpine
WORKDIR /app
EXPOSE 3000

COPY ./package.json ./yarn.lock ./
RUN yarn install --frozen-lockfile --production && yarn cache clean

COPY ./ ./

CMD [ "yarn", "start" ]