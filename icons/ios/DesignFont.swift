#if canImport(UIKit)
import CoreText
import UIKit

public enum DesignFont: String, CaseIterable, Equatable {
    case webBodyMedium = "text-web-body-medium"
    case webBodyRegular = "text-web-body-regular"
    case webFootnoteMedium = "text-web-footnote-medium"
    case webFootnoteRegular = "text-web-footnote-regular"
    case webSubheadMedium = "text-web-subhead-medium"
    case webSubheadRegular = "text-web-subhead-regular"
    case webTitleMedium = "text-web-title-medium"
    case webTitleRegular = "text-web-title-regular"

    public var fontName: String {
        rawValue
    }

    public var uiFont: UIFont {
        switch self {
        case .webBodyMedium:
            return Self.makeFont(size: 16, weight: .medium, monospacedNumbers: true)
        case .webBodyRegular:
            return Self.makeFont(size: 16, weight: .regular, monospacedNumbers: true)
        case .webFootnoteMedium:
            return Self.makeFont(size: 12, weight: .medium, monospacedNumbers: true)
        case .webFootnoteRegular:
            return Self.makeFont(size: 12, weight: .regular, monospacedNumbers: true)
        case .webSubheadMedium:
            return Self.makeFont(size: 14, weight: .medium, monospacedNumbers: true)
        case .webSubheadRegular:
            return Self.makeFont(size: 14, weight: .regular, monospacedNumbers: true)
        case .webTitleMedium:
            return Self.makeFont(size: 18, weight: .medium, monospacedNumbers: false)
        case .webTitleRegular:
            return Self.makeFont(size: 18, weight: .regular, monospacedNumbers: false)
        }
    }

    private static func makeFont(
        size: CGFloat,
        weight: UIFont.Weight,
        monospacedNumbers: Bool = false,
        stylisticAltOne: Bool = false,
        stylisticAltTwo: Bool = false
    ) -> UIFont {
        guard monospacedNumbers || stylisticAltOne || stylisticAltTwo else {
            return .systemFont(ofSize: size, weight: weight)
        }

        var featureSettings: [[UIFontDescriptor.FeatureKey: Int]] = []
        if monospacedNumbers {
            featureSettings.append([.typeIdentifier: kNumberSpacingType, .featureIdentifier: kMonospacedNumbersSelector])
        }
        if stylisticAltOne {
            featureSettings.append([.typeIdentifier: kStylisticAlternativesType, .featureIdentifier: kStylisticAltOneOnSelector])
        }
        if stylisticAltTwo {
            featureSettings.append([.typeIdentifier: kStylisticAlternativesType, .featureIdentifier: kStylisticAltTwoOnSelector])
        }

        let descriptor = UIFontDescriptor.preferredFontDescriptor(withTextStyle: .body)
            .addingAttributes([.traits: [UIFontDescriptor.TraitKey.weight: weight]])
            .addingAttributes([.featureSettings: featureSettings])
        return UIFont(descriptor: descriptor, size: size)
    }
}

public extension UIFont {
    @nonobjc final class var grpWebBodyMedium: UIFont {
        DesignFont.webBodyMedium.uiFont
    }

    @nonobjc final class var grpWebBodyRegular: UIFont {
        DesignFont.webBodyRegular.uiFont
    }

    @nonobjc final class var grpWebFootnoteMedium: UIFont {
        DesignFont.webFootnoteMedium.uiFont
    }

    @nonobjc final class var grpWebFootnoteRegular: UIFont {
        DesignFont.webFootnoteRegular.uiFont
    }

    @nonobjc final class var grpWebSubheadMedium: UIFont {
        DesignFont.webSubheadMedium.uiFont
    }

    @nonobjc final class var grpWebSubheadRegular: UIFont {
        DesignFont.webSubheadRegular.uiFont
    }

    @nonobjc final class var grpWebTitleMedium: UIFont {
        DesignFont.webTitleMedium.uiFont
    }

    @nonobjc final class var grpWebTitleRegular: UIFont {
        DesignFont.webTitleRegular.uiFont
    }
}
#endif
