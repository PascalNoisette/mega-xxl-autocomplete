FROM node:10-slim
WORKDIR /app
COPY . .
RUN npm install
RUN yarn build
CMD node index.js