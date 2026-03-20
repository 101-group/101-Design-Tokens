# Пайплайн design-tokens

Этот репозиторий хранит дизайн-токены в `tokens.json` и собирает готовый CSS-файл для раздачи.

Также репозиторий хранит канонические SVG-иконки в `icons/` и собирает web-output в `dist/icons/web/` для потребления в `web` на этапе сборки.

Этот же web-output затем подготавливается и публикуется как npm-пакет `@101/design-icons-web`.

## Что создаётся на выходе

Команда сборки создаёт:

- `dist/tokens.css`
- `dist/icons/web/monochrome/*.svg`
- `dist/icons/web/multicolor/*.svg`
- `dist/npm/design-icons-web/*`

CSS-файл содержит:

- CSS-переменные в `:root`
- переопределения переменных для светлой и тёмной темы через `[data-theme]`
- сгенерированные CSS-классы из style-токенов, например для типографики и эффектов

## Локальная сборка

Требования:

- Node.js 18+

Запуск:

```bash
node scripts/build-css.mjs
```

Или через npm:

```bash
npm run build:css
npm run build:icons
npm run build:icons:web-package
npm run check:icons:web-package
```

### Иконки

Источник истины:

- `icons/monochrome/*.svg`
- `icons/multicolor/*.svg`

Выходные файлы для web:

- `dist/icons/web/monochrome/*.svg`
- `dist/icons/web/multicolor/*.svg`

Сборка иконок просто копирует уже подготовленные SVG из `icons/` в стабильный выходной набор для `web`.
На этом этапе файлы не переоптимизируются и не трансформируются.

### Web-пакет

Подготовленный npm-пакет для `web` создаётся в:

- `dist/npm/design-icons-web/package.json`
- `dist/npm/design-icons-web/monochrome/*.svg`
- `dist/npm/design-icons-web/multicolor/*.svg`

Контракт импорта для потребителя:

```ts
import ProjectIcon from "@101/design-icons-web/monochrome/project.svg?component";
```

Локальный staging использует версию `0.0.0-development`.
Публикуемая версия назначается во время release job и автоматически повышает patch последней опубликованной версии.

## GitLab CI/CD

Файл пайплайна: `.gitlab-ci.yml`

Пайплайн использует две стадии: `build` и `release`.

Jobs в пайплайне:

1. `build_css` — вручную собирает `dist/tokens.css` и сохраняет его как артефакт.
2. `build_icons_web_package` — вручную собирает staged-пакет `@101/design-icons-web` в `dist/npm/design-icons-web` и валидирует его через `npm pack --dry-run`.
3. `publish_icons_web_package` — ручной job публикации на ветке по умолчанию; доступен только после успешного `build_icons_web_package` в том же pipeline, проверяет, менялся ли `icons/` с последнего релиза, вычисляет следующую patch-версию, пересобирает пакет с этой версией и публикует его в GitLab Package Registry.
4. `deploy_css` — вручную загружает `dist/tokens.css` на сервер через `rsync` по SSH.

### Release flow для web-иконок

1. Обновить SVG в `icons/`.
2. Сделать `push` в GitLab.
3. Вручную запустить `build_icons_web_package`.
4. На ветке по умолчанию вручную запустить `publish_icons_web_package` в том же pipeline после успешного `build_icons_web_package`.
5. Job публикации сначала проверит, были ли изменения в `icons/` с момента последней опубликованной версии. Если изменений нет, job остановится и новый пакет не опубликует.
6. Если изменения есть, job автоматически определит следующую patch-версию:
   - если последняя опубликованная версия `1.0.0`, будет опубликована `1.0.1`
   - если пакет ещё ни разу не публиковался, будет опубликована `1.0.0`
7. После этого `web` может обновить зависимость `@101/design-icons-web` до новой версии.

### Обязательные CI/CD-переменные

Задаются в настройках проекта GitLab (`Settings -> CI/CD -> Variables`):

- `SSH_HOST` — хост целевого сервера
- `SSH_PORT` — опционально, по умолчанию `22`
- `SSH_USER` — SSH-пользователь
- `SSH_PRIVATE_KEY` — приватный ключ для deploy-пользователя (plain value или file variable)
- `SSH_PRIVATE_KEY_DEPLOY` — опциональный override ключ для deploy job; если не задан, используется `SSH_PRIVATE_KEY`
- `TOKENS_DEPLOY_PATH` — абсолютный путь на сервере, куда нужно загрузить `tokens.css`
- `DEPLOY_PATH` — legacy fallback-переменная для пути деплоя `tokens.css` на время миграции

Опционально, но рекомендуется:

- `SSH_KNOWN_HOSTS` — заранее сохранённая запись known_hosts для строгой проверки хоста

Для публикации пакета используются переменные GitLab CI:

- `CI_API_V4_URL`
- `CI_PROJECT_ID`
- `CI_JOB_TOKEN`, `NODE_AUTH_TOKEN` или `NPM_TOKEN`

Опционально можно явно переопределить registry через:

- `DESIGN_ICONS_WEB_PACKAGE_REGISTRY`

Deploy jobs запускаются только на ветке по умолчанию и только если заданы обязательные переменные. `deploy_css` предпочитает `TOKENS_DEPLOY_PATH` и использует `DEPLOY_PATH` только как legacy fallback на время миграции.

## Что получается на сервере

После успешного деплоя файл будет доступен по пути:

- `${TOKENS_DEPLOY_PATH}/tokens.css`

Иконки не публикуются как runtime URL.
`web` должен потреблять опубликованный npm-пакет `@101/design-icons-web`, внутри которого лежат raw SVG для импортов на этапе сборки.
