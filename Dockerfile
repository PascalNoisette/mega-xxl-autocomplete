FROM node:14-slim
WORKDIR /app
COPY . .
RUN npm install --only=prod && npm run build
CMD npm run start