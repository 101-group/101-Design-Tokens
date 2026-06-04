# 101 Design Tokens

Ресурсы дизайна 101 для Web, iOS и Android.

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

Web использует отдельный npm package. В него попадают только нужные web-файлы: `tokens.css` и `icons/`.

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

### Промт для подключения Web

```text
Подключи дизайн-ресурсы 101 в web-проект.

Нужно использовать npm package @101app/design-tokens-web.
Установи пакет, подключи CSS-файл @101app/design-tokens-web/tokens.css в общий entrypoint стилей/приложения и замени локальные импорты дизайн-иконок на импорты из @101app/design-tokens-web/icons/.

Проверь, что после подключения:
- CSS-переменные доступны во всём приложении;
- текущие темы и цвета не сломались;
- SVG-иконки импортируются из пакета;
- в репозитории не осталось лишней локальной копии сгенерированных web-токенов, если она больше не нужна.

Версию пакета бери последнюю доступную.
```

### Промт для обновления Web

```text
Обнови дизайн-ресурсы 101 в web-проекте.

Нужно обновить npm package @101app/design-tokens-web до последней версии.
После обновления проверь, что импорт @101app/design-tokens-web/tokens.css работает, SVG-иконки из @101app/design-tokens-web/icons/ собираются, а приложение проходит стандартную проверку проекта.

Если после обновления появились изменения в названиях иконок или CSS-переменных, аккуратно поправь импорты и использования.
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

### Промт для подключения iOS

```text
Подключи дизайн-ресурсы 101 в iOS-проект.

Нужно добавить Swift Package:
https://github.com/101-group/101-Design-Tokens

Выбери последнюю стабильную версию по Git tag и подключи продукт DesignTokens к нужному target.

Используй:
- Icons.swift для имён иконок;
- Icons.xcassets для самих iOS-иконок;
- Colors.swift для цветов светлой и тёмной темы;
- Fonts.swift для шрифтов.

Проверь на экране, что иконки находятся через DesignTokens.bundle, цвета работают в light/dark theme, а шрифты применяются без ручного копирования файлов из репозитория токенов.
```

### Промт для обновления iOS

```text
Обнови дизайн-ресурсы 101 в iOS-проекте.

Нужно обновить Swift Package https://github.com/101-group/101-Design-Tokens до последнего Git tag.
После обновления проверь, что проект собирается, DesignTokens.bundle доступен, Icons.swift, Colors.swift и Fonts.swift используются без ошибок.

Если какие-то иконки, цвета или шрифты были переименованы, поправь места использования в проекте.
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

### Промт для подключения Android

```text
Подключи дизайн-ресурсы 101 в Android-проект.

Нужно подключить GitHub-репозиторий через JitPack.

В settings.gradle.kts добавь репозиторий:
maven("https://jitpack.io")

В зависимости app/module добавь Android package последней версии:
implementation("com.github.101-group.101-Design-Tokens:android:<version>")

Используй:
- R.drawable.* для иконок;
- R.color.* для цветов;
- R.dimen.* для размеров шрифтов;
- R.style.* для текстовых стилей.

Проверь, что проект собирается, ресурсы доступны через R, светлая и тёмная тема подхватывают нужные цвета, а локально копировать android/res из репозитория токенов не нужно.
```

### Промт для обновления Android

```text
Обнови дизайн-ресурсы 101 в Android-проекте.

Нужно обновить версию зависимости:
implementation("com.github.101-group.101-Design-Tokens:android:<new-version>")

Версию бери из последнего GitHub release / Git tag репозитория:
https://github.com/101-group/101-Design-Tokens

После обновления пересобери проект и проверь, что R.drawable.*, R.color.*, R.dimen.* и R.style.* доступны.
Если какие-то ресурсы были переименованы, поправь места использования в проекте.
```

## Релиз

Релиз запускается в GitHub Actions кнопкой `Release Design Tokens`.

Версию вводить не нужно. Workflow сам найдёт последний Git tag `1.0.N`, проверит web npm package, проверит Android Gradle package, создаст следующий tag для iOS/Android и опубликует web npm package `@101app/design-tokens-web` с этой же версией.

## Источник

Файлы генерируются из Figma-токенов и иконок. Не редактируйте сгенерированные platform-файлы вручную.
