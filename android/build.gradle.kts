plugins {
    id("com.android.library")
    id("maven-publish")
}

val designTokensVersion = providers.environmentVariable("DESIGN_TOKENS_PACKAGE_VERSION")
    .orElse(providers.environmentVariable("VERSION"))
    .orElse("0.0.0-development")

android {
    namespace = "app.oneohone.designtokens"
    compileSdk = 35

    defaultConfig {
        minSdk = 21
    }

    sourceSets {
        named("main") {
            manifest.srcFile("AndroidManifest.xml")
            res.srcDirs("res")
        }
    }

    publishing {
        singleVariant("release")
    }
}

publishing {
    publications {
        register<MavenPublication>("release") {
            groupId = "com.github.101-group.101-Design-Tokens"
            artifactId = "android"
            version = designTokensVersion.get()

            afterEvaluate {
                from(components["release"])
            }

            pom {
                name.set("101 Design Tokens Android")
                description.set("Generated Android resources for 101 design tokens.")
                url.set("https://github.com/101-group/101-Design-Tokens")
            }
        }
    }
}
