# design-tokens

Канонические токены, committed CSS и web-иконки.
Генерация токенов и `tokens.css` происходит в плагине. Этот репозиторий хранит committed файлы и публикует их.

## Структура

```text
icons/
  icons.json
  web/
    monochrome/*.svg
    multicolor/*.svg

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

В pipeline только два manual job:

- `publish_icons_web_package`
- `publish_tokens_css`

Генератор `tokens.css` живёт в репозитории плагина `tokens-plain-for-figma`.
`publish_icons_web_package` публикует пакет иконок.
`publish_tokens_css` публикует уже закоммиченный `tokens/web/tokens.css` в `${TOKENS_DEPLOY_PATH:-$DEPLOY_PATH}/tokens.css`.

Если deploy path раздаётся как `/assets`, файл доступен по:

- `https://web.101-app.com/assets/tokens.css`
