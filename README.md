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

В pipeline только два независимых manual job в stage `publish`:

- `release_icons`
- `deploy_tokens`

Генератор `tokens.css` живёт в репозитории плагина `tokens-plain-for-figma`.
`release_icons` публикует пакет иконок.
`deploy_tokens` публикует уже закоммиченный `tokens/web/tokens.css` в production по SSH так же, как репозиторий `web`:

- ключ: `${SSH_PRIVATE_KEY_DEPLOY:-$SSH_PRIVATE_KEY}`
- сервер: `${SSH_HOST:-$SERVER_IP}`
- пользователь: `${SSH_USER:-www}`
- путь: `${TOKENS_DEPLOY_PATH:-/home/www/code/101-web/dist}/tokens.css`

Так как production раздаёт статику из `101-web/dist`, файл доступен по:

- `https://prod.101-app.com/tokens.css`
