FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm ci
RUN npm run tsc

ENV NODE_ENV=production
CMD ["node", "./compiled/source/api.js"]