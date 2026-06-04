# 101 Design Tokens

Публичная библиотека дизайн-токенов и сгенерированных ресурсов для Web, iOS и Android.

Один релиз = одна версия, например `1.0.108`. Внутри релиза лежат все платформы: web, iOS и Android.

## Что внутри

```text
tokens.json

web/
  tokens.css
  icons/

ios/
  Icons.swift
  Colors.swift
  Fonts.swift
  Icons.xcassets/

android/
  res/
    drawable/
    values/colors.xml
    values/fonts.xml
    values-night/colors.xml
```

## Web

Установите npm package:

```bash
npm install @101/design-tokens
```

CSS:

```ts
import "@101/design-tokens/tokens.css";
```

Иконки:

```ts
import IconAdd from "@101/design-tokens/web/icons/monochrome/add.svg";
```

## iOS

Подключите репозиторий как Swift Package:

```text
https://github.com/101-group/101-Design-Tokens
```

Используйте продукт `DesignTokens` и нужную версию Git tag.

Примеры:

```swift
UIImage(
    named: Icons.monochromeAdress.imageName,
    in: DesignTokens.bundle,
    compatibleWith: nil
)

Colors.textPrimary.uiColor
Colors.textPrimary.color

Fonts.iosBodyRegular.uiFont
UIFont.grpIosBodyRegular
```

## Android

Подключите `android/res` как Android resources из нужной версии Git tag.

Примеры:

```kotlin
R.drawable.icon_monochrome_adress
R.color.color_text_primary
R.dimen.font_size_android_body_medium
R.style.TextAndroidBodyMedium
```

Цвета для тёмной темы лежат в `android/res/values-night/colors.xml`.

## Релиз

Релиз запускается в GitHub Actions кнопкой `Release Design Tokens`.

Нужно ввести версию `1.0.N`. Workflow создаст Git tag с этой же версией и опубликует npm package `@101/design-tokens`.

## Источник

Файлы генерируются из Figma-токенов и иконок. Не редактируйте сгенерированные platform-файлы вручную.
