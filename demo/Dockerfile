FROM eclipse-temurin:21-jdk
WORKDIR /app

COPY pom.xml mvnw ./
COPY .mvn .mvn
RUN ./mvnw dependency:go-offline

COPY . .

# FIX: Make mvnw executable after final copy
RUN chmod +x mvnw

RUN ./mvnw clean package -DskipTests

EXPOSE 8080
ENTRYPOINT ["java","-jar","target/demo-0.0.1-SNAPSHOT.jar"]
