# design-tokens

Канонические токены, committed CSS и web-иконки.
Генерация токенов и `tokens.css` происходит в плагине. Этот репозиторий хранит committed файлы и публикует их.

## Структура

```text
icons/
  icons.json
  web/
    <section-folder>/*.svg
  android/
    res/drawable/*.xml
  ios/
    DesignIcons.xcassets/*.imageset/

tokens/
  tokens.json
  web/
    tokens.css

scripts/
  publish-icons-web-package.mjs
  publish-tokens.mjs
```

## Правила

- `tokens/tokens.json` и `tokens/web/tokens.css` коммитятся вместе
- `tokens/web/tokens.css` руками не редактируется

## GitLab

В pipeline только два независимых manual job в stage `publish`:

- `release_icons`
- `deploy_tokens`

Генератор `tokens.css` живёт в репозитории плагина `tokens-plain-for-figma`.
`release_icons` публикует web-пакет иконок из всех папок внутри `icons/web`.
`deploy_tokens` публикует уже закоммиченный `tokens/web/tokens.css` в production по SSH так же, как apex-деплой репозитория `web`:

Обязательные GitLab CI/CD variables:

- ключ: `$SSH_PRIVATE_KEY`
- сервер: `$SSH_HOST`

Опциональные GitLab CI/CD variables:

- пользователь: `${SSH_USER:-www}`
- путь: `${DEPLOY_PATH:-/home/www/code/design-tokens-assets}/tokens.css`

Файл публикуется в стабильный каталог `/home/www/code/design-tokens-assets/`, который не затирается при релизах web-репозитория. После распаковки бандла deploy-скрипт web создаёт симлинки `dist/tokens.css` и `dist/assets/tokens.css` на этот стабильный файл.

Раздаётся в apex production:

- `https://101-app.com/tokens.css` (через Express SSR из `dist/tokens.css`)
- `https://101-app.com/assets/tokens.css` (через nginx static из `dist/assets/tokens.css`, legacy совместимость)
