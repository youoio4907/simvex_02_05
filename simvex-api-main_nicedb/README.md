## 1. 프로젝트 다운로드

```bash
git clone https://github.com/dosacha/simvex-api
cd simvex-api
```

---

## 2. 필수 프로그램 설치
(아무 세팅 없는 환경 기준)

### 2-1. Java 17 설치

아래 중 하나만 설치하면 된다.

- Temurin (OpenJDK) 17
- Oracle JDK 17

설치 확인:

```bash
java -version
```

---

### 2-2. Docker Desktop 설치

PostgreSQL 은 Docker 컨테이너로만 실행한다.
로컬 DB 설치는 필요 없다.

설치 확인:

```bash
docker --version
```

---

## 3. PostgreSQL 실행 (Docker)

```bash
docker run -d --name simvex-pg   -e POSTGRES_DB=simvex   -e POSTGRES_USER=simvex   -e POSTGRES_PASSWORD=simvexpw   -p 5432:5432   postgres:15
```

실행 중인지 확인:

```bash
docker ps
```

문제 생기면 초기화:

```bash
docker rm -f simvex-pg
```

---

## 4. application.yml 설정

경로:
`src/main/resources/application.yml`

```yml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/simvex
    username: simvex
    password: simvexpw
    driver-class-name: org.postgresql.Driver

  jpa:
    hibernate:
      ddl-auto: update
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect

logging:
  level:
    org.hibernate.SQL: debug

openai:
  api-key: ${OPENAI_API_KEY}

simvex:
  assets:
    import:
      enabled: true
      root: ${user.dir}/src/main/resources/static/assets/3d
```

---

## 5. simvex.assets.import.root 설명 (중요)

`simvex.assets.import.root` 는 서버 시작 시 3D 에셋을 자동으로 DB 에 등록하는 기준 폴더다.

실제 기준 경로:

```
src/main/resources/static/assets/3d
```

폴더 구조 예시:

```
assets/3d/
 ├─ Drone/
 │   ├─ Arm gear.glb
 │   ├─ Main frame.glb
 │   ├─ 조립도1.png
 │   └─ ...
 ├─ Robot Arm/
 ├─ Leaf Spring/
 └─ V4_Engine/
```

동작 방식:

- 폴더 이름 → ModelEntity
- glb / png / jpg → PartEntity
- 서버 실행 시 AssetImportRunner 가 자동으로 DB upsert

⚠️ 폴더 위치를 변경하면 `simvex.assets.import.root` 도 반드시 수정해야 한다.

---

## 6. OpenAI API Key 설정 (선택)

AI 기능을 실제 OpenAI 로 사용하려면 필요하다.
키가 없어도 Mock AI 로 서버는 정상 실행된다.

Windows (PowerShell):

```powershell
setx OPENAI_API_KEY "your-openai-api-key"
```

> 새 PowerShell 창을 열어야 적용된다.

---

## 7. 서버 실행

Windows:

```bash
.\gradlew clean bootRun
```

macOS / Linux:

```bash
./gradlew clean bootRun
```

정상 로그 예시:

```
Tomcat started on port 8080
[AssetImportRunner] scanning: .../assets/3d
[AssetImportRunner] model upsert: Drone
[AssetImportRunner] part upsert: Drone / Arm gear
```

---

## 8. API 동작 확인

전체 모델 조회:

```bash
curl http://localhost:8080/api/models
```

특정 모델의 부품 조회:

```bash
curl http://localhost:8080/api/models/1/parts
```

JSON 이 내려오면 정상이다.

---

## 9. 주요 API 엔드포인트

| Method | Endpoint | 설명 |
|------|---------|------|
| GET | /api/models | 전체 모델 목록 |
| GET | /api/models/{id}/parts | 모델별 부품 목록 |
| POST | /api/ai/ask | AI 질문 |

---

## 10. 프로젝트 구조

```
src/main/java/com/simvex/simvex_api
 ├─ ai
 │   ├─ OpenAIClient
 │   ├─ MockAiClient
 │   └─ PromptTemplateService
 ├─ bootstrap
 │   └─ AssetImportRunner
 ├─ controller
 │   ├─ ModelController
 │   └─ AiController
 ├─ model
 │   ├─ ModelEntity
 │   └─ ModelRepository
 ├─ part
 │   ├─ PartEntity
 │   └─ PartRepository
 └─ dto
     └─ PartDto

src/main/resources
 ├─ static/assets/3d
 ├─ prompts
 └─ application.yml
```

---

## 11. 프론트엔드 연동 기준 (중요)

프론트(simvex-ui)는 UX 흐름 기준으로 연동된다.

```
/Home
 → 지금 시작하기
 → /Study
 → 분야별 탐색
 → 학습 뷰 (3D Viewer + Note + AI Assistant)
```

백엔드는 아래를 제공하는 역할만 담당한다.

- 모델 선택 상태
- 선택된 모델의 Part 정보
- AI 컨텍스트용 메타데이터

---

## 12. 자주 발생하는 문제

데이터가 안 들어오는 경우:

- assets/3d 폴더가 비어 있음
- simvex.assets.import.enabled=true 확인

DB 연결 에러:

- Docker 미실행
- 포트 5432 충돌

8080 포트 충돌:

- 다른 서버 종료
- 또는 포트 변경

---

## 비고

- DB 스키마는 JPA ddl-auto: update 로 자동 관리
- AI 기능은 Mock ↔ OpenAI 전환 가능
- 에셋 추가 후 서버 재시작 필요
