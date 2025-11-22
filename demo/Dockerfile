FROM eclipse-temurin:21-jdk
WORKDIR /app

# Copy wrapper + config first
COPY pom.xml mvnw ./
COPY .mvn .mvn

# Make mvnw executable
RUN chmod +x mvnw

# Download dependencies
RUN ./mvnw dependency:go-offline

# Copy the rest of the source
COPY . .

# (Optional) Set permission again after copy
RUN chmod +x mvnw

# Build
RUN ./mvnw clean package -DskipTests

EXPOSE 8080
ENTRYPOINT ["java","-jar","target/demo-0.0.1-SNAPSHOT.jar"]
