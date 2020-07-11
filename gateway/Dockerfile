FROM node:12.18.2

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install
RUN npm i -g http-server

# Bundle app source
COPY . /usr/src/app

EXPOSE  9000 8080
CMD DEBUG=* node gateway.js & http-server