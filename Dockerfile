# FROM node:alpine AS node_builder
# WORKDIR /app
# ADD . .
# COPY --from=builder /app/frontend ./
# RUN npm install
# CMD ["npm", "start"]

FROM node:12-alpine as build
WORKDIR /app
COPY package.json /app/package.json
RUN npm install
COPY . /app
CMD ["npm", "start"]