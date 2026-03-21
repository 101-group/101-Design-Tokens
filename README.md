# Пайплайн design-tokens

Репозиторий хранит канонические токены, committed CSS и SVG-иконки для web.

Структура:

- `tokens/tokens.json` — source of truth для токенов
- `tokens/web/tokens.css` — committed generated CSS для runtime-деплоя
- `scripts/generate-css.mjs` — генератор `tokens/tokens.json -> tokens/web/tokens.css`
- `icons/web/monochrome/*.svg` и `icons/web/multicolor/*.svg` — канонические SVG
- `icons/icons.json` — metadata map для иконок

## Локальная работа

Требования:

- Node.js 18+

Команды:

```bash
npm run build:css
npm run check:icons:web-package
```

`npm run build:css` регенерирует committed файл `tokens/web/tokens.css`.

`npm run check:icons:web-package` собирает временный npm-пакет `@101/design-icons-web` в системную temp-директорию и валидирует его через `npm pack --dry-run`.

Контракт импорта для потребителя пакета иконок:

```ts
import ProjectIcon from "@101/design-icons-web/monochrome/project.svg?component";
```

## GitLab CI/CD

Файл пайплайна: `.gitlab-ci.yml`

Пайплайн использует стадии `build` и `release`.

Jobs:

1. `build_icons_web_package` — вручную прогоняет dry-run сборки npm-пакета иконок без записи артефактов в репозиторий.
2. `publish_icons_web_package` — вручную публикует `@101/design-icons-web` из временной staging-директории на ветке по умолчанию.
3. `deploy_css` — вручную деплоит committed файл `tokens/web/tokens.css` на сервер через `rsync` по SSH.

### CSS deploy

`deploy_css` не генерирует CSS заново. Job берёт уже закоммиченный `tokens/web/tokens.css` и загружает его в:

- `${TOKENS_DEPLOY_PATH}/tokens.css`
- `${DEPLOY_PATH}/tokens.css` как legacy fallback, если `TOKENS_DEPLOY_PATH` не задан

Если `TOKENS_DEPLOY_PATH` указывает на директорию, которая раздаётся сайтом как `/assets`, публичный URL остаётся:

- `https://web.101-app.com/assets/tokens.css`

### Обязательные CI/CD-переменные для CSS deploy

- `SSH_HOST`
- `SSH_PORT` — опционально, по умолчанию `22`
- `SSH_USER`
- `SSH_PRIVATE_KEY`
- `SSH_PRIVATE_KEY_DEPLOY` — опциональный override
- `TOKENS_DEPLOY_PATH`
- `DEPLOY_PATH` — legacy fallback на время миграции

Рекомендуется также задать:

- `SSH_KNOWN_HOSTS`

### Переменные для публикации npm-пакета иконок

- `CI_API_V4_URL`
- `CI_PROJECT_ID`
- `CI_JOB_TOKEN`, `NODE_AUTH_TOKEN` или `NPM_TOKEN`
- `DESIGN_ICONS_WEB_PACKAGE_REGISTRY` — опционально

Публикация иконок останавливается, если с момента последней опубликованной версии не было изменений в `icons/`.
