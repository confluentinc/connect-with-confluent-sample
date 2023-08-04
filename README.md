# Connect with Confluent Sample

## Project Overview

This project shows a simple example of a Connect with Confluent native integration with Confluent Cloud. For more information about Connect with Confluent, see [this blog post](https://www.confluent.io/blog/connect-with-confluent-partner-program/).

As with any UI based integration, there are two primary components to this project: 

- **Front-end application / UI:** For this sample, we have built a simple React web application. The source files for this web app are located in the `cwcsample-react` directory. 

- **Back-end application / Controller:** We use a Spring Boot application to handle requests from the front-end and to perform our various actions with Confluent Cloud, such as listing topics, producing & consuming. The source files for the controller are located in the `cwcsample-springcontroller` directory. 

### Additional Documentation

For additional technical documentation about Connect with Confluent integrations, see [Confluent Docs](https://docs.confluent.io/cloud/current/client-apps/connect-w-confluent.html|) or [become an official Confluent partner](https://partners.confluent.io). 

## Deploying this sample

### OPTION 1: Deploy with Docker

#### Run docker-compose.yml

From the project directory, run the following:

`docker compose up`

### OPTION 2: Build & Deploy services directly

#### Build the controller

First, start by building the controller. From the `cwcsample-springcontroller` directory, build an artifact using the following command:

`mvn package`

A jar, named `cwcsample-0.1.jar` will be created in the `target` directory. 

#### Start the controller application

Start the controller application by running the following command from the `cwcsample-springcontroller` directory:

`java -jar target/cwcsample-0.1.jar`

#### Install the web application dependencies

In another terminal window, navigate to the 'cwcsample-react' directory and run the following command: 

`npm install`

#### Start the web application

Now, start the web application by running the following command from the 'cwcsample-react' directory: 

`npm run start`

## Open the web browser and try the application

In a web browser, navigate to `http://localhost:3000` to open the sample application UI and use the application. 
