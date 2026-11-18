# EventifyPro

Etkinlik yönetimi için geliştirilmiş bir **Spring Boot REST API**'si. Kullanıcılar kayıt olup JWT ile giriş yapar; etkinlikler kategorilere göre listelenir, aranır ve sayfalanır. Sık okunan etkinlik detayları Redis'te önbelleğe alınır. Uygulama, veritabanı ve önbellek tek bir `docker compose up` komutuyla ayağa kalkar.

![Java](https://img.shields.io/badge/Java-21-orange?logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.1.2-6DB33F?logo=springboot)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql)
![Redis](https://img.shields.io/badge/Redis-7-DC382D?logo=redis)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)

---

## İçindekiler

- [Hızlı Başlangıç](#hızlı-başlangıç)
- [Önemli Linkler](#önemli-linkler)
- [Teknolojiler ve Neden Seçildiler](#teknolojiler-ve-neden-seçildiler)
- [Mimari](#mimari)
- [Veri Modeli](#veri-modeli)
- [API Uç Noktaları](#api-uç-noktaları)
- [Geliştirme Aşamaları](#geliştirme-aşamaları)
- [Proje Yapısı](#proje-yapısı)

---

## Hızlı Başlangıç

### Gereksinimler

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Docker Compose dahil)
- Lokal geliştirme için ayrıca: [JDK 21](https://adoptium.net/temurin/releases/?version=21) (Maven kurmanıza gerek yok, proje Maven Wrapper ile gelir)

### 1. Ortam değişkenlerini hazırlayın

Şifreler ve JWT anahtarı kodda değil, git'e girmeyen bir `.env` dosyasında tutulur. Şablonu kopyalayın:

```bash
cp .env.example .env
```

Ardından `.env` içindeki `change-me` değerlerini doldurun. Güçlü bir JWT anahtarı üretmek için:

```bash
openssl rand -base64 64
```

### 2a. Her şeyi Docker ile çalıştırın (önerilen)

```bash
docker compose up -d --build
```

Bu komut sırasıyla PostgreSQL ve Redis'i başlatır, ikisi de sağlıklı (*healthy*) olunca uygulamayı ayağa kaldırır. Durumu izlemek için:

```bash
docker compose ps
```

```bash
docker compose logs -f app
```

### 2b. Uygulamayı IDE'den / lokalden çalıştırın

Yalnızca veritabanı ve önbelleği Docker'da başlatıp uygulamayı IntelliJ veya terminalden çalıştırabilirsiniz:

```bash
docker compose up -d postgres redis
```

```bash
./mvnw spring-boot:run
```

> Uygulama `.env` dosyasını `spring.config.import` ile kendisi okur, IDE'de ek ayar gerekmez.
> Docker'daki `app` container'ı çalışıyorsa önce `docker compose stop app` ile durdurun, aksi halde 8080 portu çakışır.

### Durdurmak

```bash
docker compose down
```

Veritabanı verisini de silmek isterseniz `docker compose down -v` kullanın.

---

## Önemli Linkler

Uygulama çalışırken (tüm yollar `/api/v1` ön ekiyle başlar):

| Ne | Link |
|---|---|
| Swagger UI (interaktif API dokümantasyonu) | http://localhost:8080/api/v1/swagger-ui/index.html |
| OpenAPI JSON | http://localhost:8080/api/v1/v3/api-docs |
| API kök adresi | http://localhost:8080/api/v1 |

---

## Teknolojiler ve Neden Seçildiler

| Teknoloji | Ne için | Neden |
|---|---|---|
| **Java 21** | Dil | Güncel LTS sürümü; `record`, `var`, pattern matching gibi modern özellikler. |
| **Spring Boot 4.1** | Uygulama çatısı | Otomatik yapılandırma ile REST, güvenlik, veri erişimi ve önbelleği az kodla bir araya getirir. |
| **Spring Data JPA + Hibernate** | Veri erişimi | Repository arayüzlerinden sorgular türetilir; ilişkiler entity'ler üzerinden yönetilir. |
| **PostgreSQL 15** | Kalıcı veritabanı | Güçlü, açık kaynak ve ilişkisel veriler (kullanıcı–bilet–etkinlik) için doğal seçim. |
| **Spring Security + JWT (jjwt)** | Kimlik doğrulama | Sunucuda oturum tutmayan (*stateless*) token tabanlı yapı; API'yi yatay ölçeklemeye uygun hale getirir. |
| **BCrypt** | Şifre saklama | Şifreler veritabanında asla açık metin olarak tutulmaz, tuzlanarak hash'lenir. |
| **Redis 7 + Spring Cache** | Önbellek | Sık okunan etkinlik detaylarını bellekte tutarak veritabanı yükünü azaltır. |
| **MapStruct** | Entity → DTO dönüşümü | Dönüşüm kodunu derleme sırasında üretir; reflection kullanmadığı için hızlıdır ve hataları derlemede yakalar. |
| **Lombok** | Tekrarlayan kod | Getter/setter, builder ve constructor'ları anotasyonlarla üretir. |
| **Bean Validation** | Girdi doğrulama | `@NotBlank`, `@Email`, `@Size` gibi kurallar DTO üzerinde tanımlanır, controller'a geçersiz veri girmez. |
| **Spring AOP (AspectJ)** | Kesişen ilgiler | Servis metotlarının çalışma süresi, iş koduna dokunmadan tek bir yerden loglanır. |
| **SpringDoc OpenAPI** | Dokümantasyon | Kod üzerinden otomatik Swagger dokümantasyonu üretir; API'yi tarayıcıdan denemeyi sağlar. |
| **RestClient** | Dış servis çağrısı | Spring'in modern, akıcı (*fluent*) HTTP istemcisi. |
| **Docker + Docker Compose** | Paketleme ve çalıştırma | Uygulama, veritabanı ve önbellek her makinede aynı şekilde, tek komutla çalışır. |

---

## Mimari

Proje klasik **katmanlı mimari** ile kurgulandı. Her katmanın tek bir sorumluluğu vardır:

```mermaid
flowchart LR
    Client([İstemci]) -->|HTTP + Bearer token| Filter[JwtAuthenticationFilter]
    Filter --> Controller
    Controller -->|DTO| Service
    Service -->|Entity| Repository
    Repository --> DB[(PostgreSQL)]
    Service <-->|"@Cacheable"| Cache[(Redis)]
    Service -.->|MapStruct| DTO[Response DTO]
    Aspect[[LoggingAspect]] -.->|süre ölçümü| Service
    Advice[[GlobalExceptionHandler]] -.->|hata yanıtı| Controller
```

- **Controller**: HTTP isteklerini karşılar, doğrulama (`@Valid`) yapar, yalnızca DTO döner.
- **Service**: İş kuralları burada; önbellek ve AOP de bu katmanda devreye girer.
- **Repository**: Spring Data JPA arayüzleri; özel sorgular JPQL ile yazıldı.
- **Entity'ler hiçbir zaman dışarıya açılmaz.** API yanıtları MapStruct ile DTO'ya çevrilir. Bu sayede veritabanı yapısı değişse bile API sözleşmesi korunur ve şifre gibi alanlar yanlışlıkla sızmaz.

### İstek akışı (kimlik doğrulama)

1. Kullanıcı `POST /auth/register` veya `POST /auth/login` ile bir **JWT** alır.
2. Sonraki isteklerde `Authorization: Bearer <token>` başlığını gönderir.
3. `JwtAuthenticationFilter` token'ı doğrular ve kullanıcıyı `SecurityContext`'e yerleştirir.
4. Token yoksa veya geçersizse korunan uç noktalar `403 Forbidden` döner.

---

## Veri Modeli

Tüm entity'ler `BaseEntity`'den türer: `id`, `createdAt` ve `updatedAt` alanları **JPA Auditing** (`@EnableJpaAuditing`) ile otomatik doldurulur.

```mermaid
erDiagram
    CATEGORY ||--o{ EVENT : "içerir"
    EVENT ||--o{ TICKET : "satılır"
    USER ||--o{ TICKET : "satın alır"
    USER ||--o{ USER_ROLES : "sahiptir"

    CATEGORY {
        bigint id PK
        string name UK
        string description
    }
    EVENT {
        bigint id PK
        string title
        string description
        timestamp event_date
        string location
        double price
        int capacity
        bigint category_id FK
    }
    TICKET {
        bigint id PK
        string ticket_number UK
        double paid_amount
        bigint user_id FK
        bigint event_id FK
    }
    USER {
        bigint id PK
        string email UK
        string password
        string first_name
        string last_name
    }
    USER_ROLES {
        bigint user_id FK
        string roles
    }
```

**İlişki tasarımında alınan kararlar:**

- `Category → Event` ve `Event → Ticket` ilişkileri `cascade = ALL` ve `orphanRemoval = true` ile kuruldu: bir etkinlik silinince ona ait biletler de silinir, listeden çıkarılan bilet veritabanında sahipsiz kalmaz.
- `@ManyToOne` taraflarında `FetchType.LAZY` kullanıldı: bir bilet çekildiğinde etkinlik ve kullanıcı bilgisi ancak gerektiğinde yüklenir, gereksiz JOIN'ler önlenir.
- Roller (`ROLE_ADMIN`, `ROLE_ORGANIZER`, `ROLE_ATTENDEE`) bir `enum` olarak tutulur ve `@ElementCollection` ile ayrı `user_roles` tablosunda saklanır. Yeni kayıt olan kullanıcılar `ROLE_ATTENDEE` rolünü alır.

---

## API Uç Noktaları

Temel adres: `http://localhost:8080/api/v1`

### Kimlik doğrulama (herkese açık)

| Metot | Yol | Açıklama |
|---|---|---|
| `POST` | `/auth/register` | Yeni kullanıcı oluşturur, JWT döner |
| `POST` | `/auth/login` | E-posta ve şifre ile giriş yapar, JWT döner |

### Etkinlikler (token gerekir)

| Metot | Yol | Açıklama |
|---|---|---|
| `GET` | `/events?page=0&size=10&sort=eventDate,asc` | Tüm etkinlikleri sayfalı listeler |
| `GET` | `/events/{id}` | Etkinlik detayı (**Redis'te 10 dk önbelleklenir**) |
| `GET` | `/events/search?title=konser` | Başlığa göre büyük/küçük harf duyarsız arama |
| `GET` | `/events/category/{categoryId}` | Kategoriye göre listeleme (JPQL sorgusu) |

### Örnek kullanım

Kayıt olun ve token'ı alın:

```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"ayse@example.com","password":"gizli123","firstName":"Ayşe","lastName":"Yılmaz"}'
```

```json
{ "token": "eyJhbGciOiJIUzI1NiJ9..." }
```

Token ile etkinlikleri listeleyin:

```bash
curl http://localhost:8080/api/v1/events \
  -H "Authorization: Bearer <token>"
```

### Hata formatı

Tüm hatalar `GlobalExceptionHandler` tarafından aynı yapıda döndürülür, böylece istemci her hatayı tek bir şekilde işleyebilir:

```json
{
  "timestamp": "2026-11-18T22:15:04.123",
  "status": 400,
  "error": "Validation Error",
  "message": "{email=Lütfen geçerli bir e-posta adresi giriniz!}",
  "path": "/api/v1/auth/register"
}
```

---

## Geliştirme Aşamaları

Proje, her biri bir öncekinin üzerine kurulan 6 aşamada geliştirildi.

### Aşama 1: Proje Kurulumu ve Veritabanı Mimarisi

- Spring Initializr ile Maven projesi; Web, Data JPA, PostgreSQL, Lombok ve Validation bağımlılıkları.
- PostgreSQL ve Redis, Docker Compose ile ayağa kaldırıldı. Böylece kimsenin bilgisayarına veritabanı kurması gerekmiyor.
- `BaseEntity` ile tüm tablolara ortak `id`, `createdAt`, `updatedAt` alanları; JPA Auditing ile tarihlerin otomatik doldurulması.
- `controller`, `service`, `repository`, `entity`, `dto` paketleriyle katmanlı yapı.

### Aşama 2: Kullanıcı ve Yetkilendirme (Security & JWT)

- `User` entity'si doğrudan Spring Security'nin `UserDetails` arayüzünü uygular; e-posta, kullanıcı adı olarak kullanılır.
- `Role` enum'u ile rol tabanlı yetkilendirmeye hazır yapı.
- `JwtService` token üretir ve doğrular (HS256). `JwtAuthenticationFilter` her istekte token'ı okuyup `SecurityContext`'i doldurur.
- Oturum politikası `STATELESS`: sunucu hiçbir oturum bilgisi tutmaz.

### Aşama 3: Çekirdek İş Mantığı

- `Category`, `Event`, `Ticket` entity'leri ve aralarındaki One-to-Many / Many-to-One ilişkileri; cascade, orphan removal ve lazy fetch kullanımı.
- MapStruct ile entity → DTO dönüşümü (`EventMapper`, `CategoryMapper`). Örneğin `event.category.name` alanı, DTO'daki `categoryName` alanına otomatik eşlenir.
- `Pageable` ile sayfalama ve sıralama; JPQL ile kategoriye göre filtreleme, türetilmiş sorgu ile başlığa göre arama.

### Aşama 4: Gelişmiş Özellikler ve Hata Yönetimi

- `@RestControllerAdvice` ile merkezi hata yönetimi ve standart `ErrorResponse` yapısı.
- Validation hataları alan bazında yakalanıp anlaşılır mesajlarla döndürülür.
- Özel doğrulayıcı: `@ValidEventTitle` anotasyonu ve `EventTitleValidator`.
- `LoggingAspect`: `@Around` advice ile servis katmanındaki her metodun çalışma süresini ölçüp loglar. Performans ölçümü iş koduna tek satır eklenmeden yapılır.

### Aşama 5: Performans, Dış Servisler ve Dokümantasyon

- `@EnableCaching` ve `@Cacheable` ile etkinlik detayları Redis'te önbelleğe alınır (TTL: 10 dakika). İlk istekten sonra aynı etkinlik veritabanına gitmeden döner.
- `RedisTemplate` yapılandırması (`RedisConfig`).
- `ExternalLocationService`: `RestClient` ile dış bir API'den veri çekme altyapısı.
- SpringDoc ile otomatik Swagger dokümantasyonu.

### Aşama 6: Konteynerizasyon ve Canlıya Hazırlık

- **Çok aşamalı `Dockerfile`**: İlk aşama JDK ile jar'ı derler, ikinci aşama yalnızca JRE içeren küçük bir Alpine imajında çalıştırır. Derleme araçları son imaja girmez.
- Bağımlılıklar ayrı bir Docker katmanında indirilir: yalnızca kod değiştiğinde yeniden derleme çok daha hızlıdır.
- Uygulama container içinde **root olmayan** bir kullanıcıyla çalışır.
- `.dockerignore` ile `.env` ve derleme çıktıları imaja girmez.
- PostgreSQL ve Redis için `healthcheck`; uygulama ikisi de hazır olmadan başlamaz (`depends_on: service_healthy`).
- Gizli bilgiler (DB şifresi, JWT anahtarı) koddan çıkarılıp ortam değişkenlerine taşındı.

---

## Proje Yapısı

```
src/main/java/com/eventify/eventifypro
├── aop/            # LoggingAspect: metot çalışma süresi ölçümü
├── common/         # BaseEntity: ortak id ve audit alanları
├── config/         # RedisConfig: önbellek ve RedisTemplate ayarları
├── controller/     # REST uç noktaları (Auth, Event)
├── dto/            # İstek/yanıt nesneleri
├── entity/         # JPA entity'leri (User, Role, Category, Event, Ticket)
├── exception/      # GlobalExceptionHandler, ErrorResponse
├── mapper/         # MapStruct arayüzleri
├── repository/     # Spring Data JPA repository'leri
├── security/       # JWT servisi, filtre ve Security yapılandırması
├── service/        # İş mantığı arayüzleri ve dış servis istemcisi
│   └── impl/       # Servis implementasyonları
└── validation/     # Özel doğrulama anotasyonu ve doğrulayıcı
```

---
