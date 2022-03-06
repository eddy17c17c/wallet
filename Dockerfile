FROM node:17-alpine as dev

WORKDIR /app
COPY package*.json ./

RUN npm install
RUN npm install -g @nestjs/cli

COPY . .

RUN npm run build

FROM node:17-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /app

COPY --from=dev app/package*.json ./
COPY --from=dev app/node_modules/ ./node_modules/
COPY --from=dev app/dist ./dist

RUN npm install
RUN npm install -g @nestjs/cli

CMD ["node", "dist/main"]
