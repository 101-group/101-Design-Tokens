// swift-tools-version: 5.9

import PackageDescription

let package = Package(
    name: "DesignIcons",
    platforms: [
        .iOS(.v13)
    ],
    products: [
        .library(
            name: "DesignIcons",
            targets: ["DesignIcons"]
        )
    ],
    targets: [
        .target(
            name: "DesignIcons",
            path: "icons/ios",
            resources: [
                .process("DesignIcons.xcassets")
            ]
        )
    ]
)
