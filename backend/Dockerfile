FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

# Copy Gradle wrapper and config first (caches dependencies layer)
COPY gradlew settings.gradle build.gradle ./
COPY gradle/ gradle/
RUN chmod +x gradlew && ./gradlew dependencies --no-daemon

# Copy source and build
COPY src/ src/
RUN ./gradlew bootJar --no-daemon

# Runtime stage — slim JRE image
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
