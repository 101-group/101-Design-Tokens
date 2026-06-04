# 101 Design Tokens

Публичные дизайн-токены и сгенерированные ресурсы для Web, iOS и Android.

Для стабильного подключения используйте Git tag, например `1.0.104`.

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

- CSS-токены: `web/tokens.css`
- SVG-иконки: `web/icons/<section>/*.svg`

## iOS

Подключите репозиторий как Swift Package:

```text
https://github.com/101-group/101-Design-Tokens
```

Используйте продукт `DesignIcons`.

Примеры:

```swift
UIImage(
    named: Icons.monochromeAdress.imageName,
    in: DesignIcons.bundle,
    compatibleWith: nil
)

Colors.textPrimary.uiColor
Colors.textPrimary.color

Fonts.iosBodyRegular.uiFont
UIFont.grpIosBodyRegular
```

## Android

Используйте `android/res` как Android resources.

Примеры:

```kotlin
R.drawable.icon_monochrome_adress
R.color.color_text_primary
R.dimen.font_size_android_body_medium
R.style.TextAndroidBodyMedium
```

Цвета для тёмной темы лежат в `android/res/values-night/colors.xml`.

## Источник

Файлы генерируются из Figma-токенов и иконок. Не редактируйте сгенерированные platform-файлы вручную.
