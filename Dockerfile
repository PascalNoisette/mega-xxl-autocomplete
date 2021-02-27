FROM node:10-slim
WORKDIR /app
COPY package.json package.json 
RUN npm install
COPY .eslintrc.json README.md server.js ./
COPY src ./src/
COPY public ./public/
RUN yarn build
CMD node server.js
