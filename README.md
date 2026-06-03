# design-tokens

Канонические токены, committed CSS, web-иконки и native resources.
Генерация происходит в Figma-плагине. Этот репозиторий хранит committed файлы и публикует их.

## Структура

```text
tokens.json

web/
  tokens.css
  icons/
    <section-folder>/*.svg
    icons.json

ios/
  Icons.swift
  Colors.swift
  Fonts.swift
  Icons.xcassets/

android/
  res/
    drawable/*.xml
    values/colors.xml
    values/fonts.xml
    values-night/colors.xml
```

## Правила

- `tokens.json` и `web/tokens.css` коммитятся вместе.
- `web/tokens.css` руками не редактируется.
- `web/icons/icons.json` нужен плагину как manifest для rename/delete sync.
- iOS подключается как Swift Package из этого Git repo по semver-тегу. `Package.swift` отдаёт папку `ios/`, где лежат Swift-файлы и `Icons.xcassets`.
- iOS иконки доступны через `Icons.<name>.imageName`, bundle helper остаётся `DesignIcons.bundle`.
- iOS цвета и шрифты доступны через `Colors.<token>.uiColor`, `Colors.<token>.color`, `UIFont.grp<Token>` и `Fonts.<token>.uiFont`.
- Android иконки лежат в `android/res/drawable`, цвета в `values/colors.xml` и `values-night/colors.xml`, шрифты и text styles в `values/fonts.xml`.

## GitLab CI

В pipeline две ручные кнопки на `main`:

- `Deploy Web CSS` публикует `web/tokens.css` на production.
- `Release Icons/Colors/Fonts` публикует web npm package иконок. На semver-теге `1.2.3` job запускается автоматически; этот же тег является версией Swift Package для iOS.

Для `Deploy Web CSS` нужны GitLab CI/CD variables:

- `SSH_PRIVATE_KEY`
- `SSH_HOST`

Опционально:

- `SSH_USER`, по умолчанию `www`
- `DEPLOY_PATH`, по умолчанию `/home/www/code/design-tokens-assets`

CSS раздаётся в production:

- `https://101-app.com/tokens.css`
- `https://101-app.com/assets/tokens.css`
