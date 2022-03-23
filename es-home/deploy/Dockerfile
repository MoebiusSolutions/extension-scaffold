FROM node:14 as build
WORKDIR /opt/project
COPY . .
RUN --mount=type=secret,id=npmrc,dst=/root/.npmrc npm ci
ENV NODE_ENV=production
RUN npm run build

FROM httpd:2 as deploy
COPY --from=build /opt/project/build /usr/local/apache2/htdocs