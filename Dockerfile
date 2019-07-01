FROM debian:9

RUN apt-get update -yq \
&& apt-get install curl gnupg -yq \
&& curl -sL https://deb.nodesource.com/setup_10.x | bash \
&& apt-get install nodejs -yq \
&& apt-get clean -y

ADD . /app-service/
WORKDIR /app-service
RUN npm install

#RUN npm run override:populate

#ENTRYPOINT npm run override:populate
EXPOSE 3000