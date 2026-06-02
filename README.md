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
- iOS-иконки подключаются как Swift Package из этого Git repo по semver-тегу; `Package.swift` отдаёт `icons/ios/DesignIcons.xcassets` как ресурсы target `DesignIcons`
- iOS asset names имеют формат `icon-<section>-<name>`, например `icon-monochrome-search`; enum `DesignIcon` даёт типизированные имена: `DesignIcon.monochromeSearch.imageName`

## GitLab

В pipeline два независимых job в stage `publish`:

- `release_icons`
- `deploy_tokens`

Генератор `tokens.css` живёт в репозитории плагина `tokens-plain-for-figma`.
`release_icons` автоматически публикует web-пакет иконок из всех папок внутри `icons/web` при Git tag формата `1.2.3`. Версия web-пакета равна тегу. Этот же tag является версией Swift Package для iOS. На `main` этот job остаётся manual для ручной публикации следующего patch.
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
