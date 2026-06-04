# 101 Design Tokens

Публичный репозиторий дизайн-токенов и сгенерированных ресурсов для Web, iOS и Android.

Один релиз = одна версия, например `1.0.108`. Версия общая для всех платформ, но каждая платформа подключается своим способом.

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
  build.gradle.kts
  AndroidManifest.xml
  res/
    drawable/
    values/colors.xml
    values/fonts.xml
    values-night/colors.xml
```

## Web

Web использует отдельный npm package. В него попадают только `tokens.css` и `icons/`.

```bash
npm install @101app/design-tokens-web
```

CSS:

```ts
import "@101app/design-tokens-web/tokens.css";
```

Иконки:

```ts
import IconAdd from "@101app/design-tokens-web/icons/monochrome/add.svg";
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

Android использует Gradle dependency через JitPack. Добавьте JitPack repository в `settings.gradle.kts`:

```kotlin
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
        maven("https://jitpack.io")
    }
}
```

Подключите Android package нужной версии:

```kotlin
dependencies {
    implementation("com.github.101-group.101-Design-Tokens:android:<version>")
}
```

При новом релизе обновляйте только номер версии:

```text
1.0.106 -> 1.0.107
```

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

Версию вводить не нужно. Workflow сам найдёт последний Git tag `1.0.N`, проверит web npm package, проверит Android Gradle package, создаст следующий tag для iOS/Android и опубликует web npm package `@101app/design-tokens-web` с этой же версией.

## Источник

Файлы генерируются из Figma-токенов и иконок. Не редактируйте сгенерированные platform-файлы вручную.
