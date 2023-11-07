FROM maven:3.8-openjdk-17-slim as builder

WORKDIR /app
COPY pom.xml .
COPY src ./src

# Build a jar for the controller/backend
RUN mvn package

FROM openjdk:17-alpine

# Copy the jar to the image from the builder stage.
COPY --from=builder /app/target/*.jar /cwc-sample-backend.jar
COPY --from=builder /app/src/main/resources/* /src/main/resources/

EXPOSE 8080

# Run the jar on container startup
CMD ["/bin/sh","-c","java -jar /cwc-sample-backend.jar"]