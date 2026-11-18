# syntax=docker/dockerfile:1

# ---------- 1. Aşama: Derleme (JDK + Maven Wrapper) ----------
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

# Önce yalnızca Maven dosyalarını kopyala: pom değişmedikçe bağımlılık katmanı cache'ten gelir
COPY mvnw pom.xml ./
COPY .mvn .mvn
RUN chmod +x mvnw && ./mvnw -q -B dependency:go-offline

# Sonra kaynak kodu kopyalayıp jar'ı üret
# (Testler veritabanı istediği için imaj derlenirken atlanır)
COPY src src
RUN ./mvnw -q -B package -DskipTests && cp target/*.jar app.jar

# ---------- 2. Aşama: Çalıştırma (yalnızca JRE, küçük imaj) ----------
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Uygulamayı root olmayan bir kullanıcıyla çalıştır
RUN addgroup -S spring && adduser -S spring -G spring
USER spring

COPY --from=build /app/app.jar app.jar

EXPOSE 8080

# Container'a verilen belleğin %75'ini heap olarak kullan
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75", "-jar", "app.jar"]
