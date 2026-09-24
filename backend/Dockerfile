# syntax=docker/dockerfile:1.7

# ---- Stage 1: build ----
FROM maven:3-eclipse-temurin-26-noble AS build
WORKDIR /build

COPY pom.xml .
COPY src src

RUN mvn -q package -DskipTests

# ---- Stage 2: runtime ----
FROM eclipse-temurin:21-jre-noble AS runtime
WORKDIR /app

RUN apt-get update \
    && apt-get install --no-install-recommends -y curl \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd --system --gid 10001 app \
    && useradd --system --uid 10001 --gid app --home /app --shell /usr/sbin/nologin app

COPY --from=build --chown=app:app /build/target/backend.jar app.jar

USER 10001:10001

EXPOSE 8080

HEALTHCHECK --interval=15s --timeout=3s --start-period=20s --retries=3 \
  CMD curl -fsS http://127.0.0.1:8080/actuator/health | grep -q '"status":"UP"' || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
