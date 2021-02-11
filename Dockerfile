FROM debian:10

#If not working, see https://hub.docker.com/_/buildpack-deps
#and remove the line sources.list

RUN printf "deb http://deb.debian.org/debian/ buster main non-free \ndeb-src http://deb.debian.org/debian/ buster main non-free \ndeb http://security.debian.org/debian-security buster/updates main contrib non-free \ndeb-src http://security.debian.org/debian-security buster/updates main contrib non-free" > /etc/apt/sources.list 

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