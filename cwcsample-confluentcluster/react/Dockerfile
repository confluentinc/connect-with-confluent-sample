FROM node:alpine
RUN apk update && apk add openjdk17-jre-headless

# Copy the react frontend

WORKDIR /cwcsample
COPY package.json /cwcsample/package.json
COPY package-lock.json /cwcsample/package-lock.json

RUN npm install
COPY . /cwcsample

# Expose the UI port
EXPOSE 3000

CMD ["npm", "run", "start"]
