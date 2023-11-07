# Connect with Confluent Sample

## Project Overview

This project shows a few simple examples of Connect with Confluent native integrations with Confluent Cloud. For more information about Connect with Confluent, see [this blog post](https://www.confluent.io/blog/connect-with-confluent-partner-program/).

Currently, there are two sample applications to explore and learn more about native integrations with Confluent Cloud. Each one is found in it's own directory at the top level of the project. These include:

- **cwcsample-confluent:**  A sample application that connects to Confluent Cloud using a Cloud API Key & Secret, allowing you to explore available environments and clusters, then create Kafka & Schema Registry API Keys & Secrets to produce or consume from a topic on any of the available clusters. 
- **cwcsample-confluentcluster:** A sample application that connects to a specific Confluent Cloud _cluster_ directly using Kafka & Schema Registry API Keys & Secrets allowing you to produce or consume from a topic on that specific cluster. 

As with any UI based integration, there are two primary components to each sample application: 

- **Front-end application / UI:** For each sample, we build a simple React web application. The source files for this web app are located in the `react` directory of each sample. 

- **Back-end application / Controller:** We use a Spring Boot application to handle requests from the front-end and to perform our various actions with Confluent Cloud, such as listing topics, producing & consuming. The source files for the controller are located in the `springcontroller` directory of each sample. 

### Additional Documentation

For additional technical documentation about Connect with Confluent integrations, see [Confluent Docs](https://docs.confluent.io/cloud/current/client-apps/connect-w-confluent.html|) or [become an official Confluent partner](https://partners.confluent.io). 

## Deploying this sample

### OPTION 1: Deploy with Docker

#### Run docker-compose.yml

From the sample directory (`cwcsample-confluent/` or `cwcsample-confluentcluster/`), run the following:

`docker compose up`

### OPTION 2: Build & Deploy services directly

#### Build the controller

First, start by building the controller. From the `springcontroller` directory of the desired sample (for example: `cwcsample-confluent/springcontroller`), build an artifact using the following command:

`mvn package`

A jar, named `cwcsample-0.1.jar` will be created in the `target` directory. 

#### Start the controller application

Start the controller application by running the following command from the `springcontroller` directory of the desired sample:

`java -jar target/cwcsample-0.1.jar`

#### Install the web application dependencies

In another terminal window, navigate to the `react` directory of the desired sample (for example: `cwcsample-confluent/react`) and run the following command: 

`npm install`

#### Start the web application

Now, start the web application by running the following command from the `react` directory (for example: `cwcsample-confluent/springcontroller`): 

`npm run start`

## Open the web browser and try the application

In a web browser, navigate to `http://localhost:3000` to open the sample application UI and use the application. 
