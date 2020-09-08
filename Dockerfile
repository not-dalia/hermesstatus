FROM node:10-alpine
WORKDIR /app
EXPOSE 3000
COPY ["package*.json", "/app/"]
ENV NODE_ENV production
RUN npm ci > /dev/null
COPY . /app/
ENTRYPOINT ["sh", "/app/entrypoint.sh"]
