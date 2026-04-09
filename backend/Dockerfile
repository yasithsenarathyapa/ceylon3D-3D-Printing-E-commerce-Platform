# Multi-stage Dockerfile: build with Maven, run with Temurin JRE
FROM maven:3.8.8-eclipse-temurin-17 AS build
WORKDIR /workspace
COPY pom.xml ./
# Download dependencies
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn -B -DskipTests package

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /workspace/target/itp-ecommerce-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080 10000
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
