FROM node:22-bullseye
RUN apt-get update && apt-get install -y python3 make g++ sqlite3
RUN npm install -g pnpm
WORKDIR /app

COPY ./package.json ./pnpm-lock.yaml /app/

RUN pnpm install

COPY . .

EXPOSE 3000

CMD ["pnpm", "run", "dev"]