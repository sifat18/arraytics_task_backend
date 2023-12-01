FROM node:16.16.0

WORKDIR /app

COPY . .

RUN npm install
RUN npm install bcrypt

COPY .env .env

EXPOSE 7000

RUN  ["chmod","+x","./entrypoint.sh"]
ENTRYPOINT [ "sh","./entrypoint.sh" ]





