# 101 Design Tokens

Public design tokens and generated platform resources for Web, iOS, and Android.

Use a Git tag for stable integration, for example `1.0.104`.

## Contents

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

- CSS tokens: `web/tokens.css`
- SVG icons: `web/icons/<section>/*.svg`

## iOS

Add this repository as a Swift Package:

```text
https://github.com/101-group/101-Design-Tokens
```

Use the product `DesignIcons`.

Examples:

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

Use `android/res` as Android resources.

Examples:

```kotlin
R.drawable.icon_monochrome_adress
R.color.color_text_primary
R.dimen.font_size_android_body_medium
R.style.TextAndroidBodyMedium
```

Dark theme colors are in `android/res/values-night/colors.xml`.

## Source

Files are generated from Figma tokens and icons. Do not edit generated platform files manually.
