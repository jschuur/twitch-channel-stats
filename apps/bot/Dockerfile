FROM node:lts-slim

WORKDIR /usr/src/app

RUN npm --global install pnpm@latest

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json ./

RUN pnpm install
# If you are building your code for production
# RUN npm ci --only=production

COPY . .
RUN pnpm build
RUN pnpm prisma generate

EXPOSE 8080
CMD [ "pnpm", "start" ]