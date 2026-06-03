#if canImport(UIKit)
import CoreText
import UIKit

public enum Fonts: String, CaseIterable, Equatable {
    case iosBodyMedium = "text-ios-body-medium"
    case iosBodyRegular = "text-ios-body-regular"
    case iosBodySemibold = "text-ios-body-semibold"
    case iosCaption1Medium = "text-ios-caption1-medium"
    case iosCaption1Regular = "text-ios-caption1-regular"
    case iosCaption2Medium = "text-ios-caption2-medium"
    case iosCaption2Regular = "text-ios-caption2-regular"
    case iosCaption2Semibold = "text-ios-caption2-semibold"
    case iosFootnoteMedium = "text-ios-footnote-medium"
    case iosFootnoteRegular = "text-ios-footnote-regular"
    case iosFootnoteSemibold = "text-ios-footnote-semibold"
    case iosLargeTitleBold = "text-ios-large-title-bold"
    case iosLargeTitleRegular = "text-ios-large-title-regular"
    case iosSubheadMedium = "text-ios-subhead-medium"
    case iosSubheadRegular = "text-ios-subhead-regular"
    case iosSubheadSemibold = "text-ios-subhead-semibold"
    case iosTitle1Bold = "text-ios-title1-bold"
    case iosTitle1Regular = "text-ios-title1-regular"
    case iosTitle2Bold = "text-ios-title2-bold"
    case iosTitle2Regular = "text-ios-title2-regular"
    case iosTitle3Bold = "text-ios-title3-bold"
    case iosTitle3Regular = "text-ios-title3-regular"

    public var fontName: String {
        rawValue
    }

    public var uiFont: UIFont {
        switch self {
        case .iosBodyMedium:
            return Self.makeFont(size: 17, weight: .medium, monospacedNumbers: false, stylisticAltOne: true, stylisticAltTwo: true)
        case .iosBodyRegular:
            return Self.makeFont(size: 17, weight: .regular, monospacedNumbers: true, stylisticAltOne: true, stylisticAltTwo: true)
        case .iosBodySemibold:
            return Self.makeFont(size: 17, weight: .bold, monospacedNumbers: false, stylisticAltOne: true, stylisticAltTwo: true)
        case .iosCaption1Medium:
            return Self.makeFont(size: 12, weight: .medium, monospacedNumbers: true, stylisticAltOne: true, stylisticAltTwo: true)
        case .iosCaption1Regular:
            return Self.makeFont(size: 12, weight: .regular, monospacedNumbers: true, stylisticAltOne: true, stylisticAltTwo: true)
        case .iosCaption2Medium:
            return Self.makeFont(size: 11, weight: .medium, monospacedNumbers: true, stylisticAltOne: true, stylisticAltTwo: true)
        case .iosCaption2Regular:
            return Self.makeFont(size: 11, weight: .regular, monospacedNumbers: true, stylisticAltOne: true, stylisticAltTwo: true)
        case .iosCaption2Semibold:
            return Self.makeFont(size: 11, weight: .bold, monospacedNumbers: true, stylisticAltOne: true, stylisticAltTwo: true)
        case .iosFootnoteMedium:
            return Self.makeFont(size: 13, weight: .medium, monospacedNumbers: true, stylisticAltOne: true, stylisticAltTwo: true)
        case .iosFootnoteRegular:
            return Self.makeFont(size: 13, weight: .regular, monospacedNumbers: true, stylisticAltOne: true, stylisticAltTwo: true)
        case .iosFootnoteSemibold:
            return Self.makeFont(size: 13, weight: .bold, monospacedNumbers: true, stylisticAltOne: true, stylisticAltTwo: true)
        case .iosLargeTitleBold:
            return Self.makeFont(size: 34, weight: .bold, monospacedNumbers: true, stylisticAltOne: true, stylisticAltTwo: true)
        case .iosLargeTitleRegular:
            return Self.makeFont(size: 34, weight: .regular, monospacedNumbers: true, stylisticAltOne: true, stylisticAltTwo: true)
        case .iosSubheadMedium:
            return Self.makeFont(size: 15, weight: .medium, monospacedNumbers: true, stylisticAltOne: true, stylisticAltTwo: true)
        case .iosSubheadRegular:
            return Self.makeFont(size: 15, weight: .regular, monospacedNumbers: true, stylisticAltOne: true, stylisticAltTwo: true)
        case .iosSubheadSemibold:
            return Self.makeFont(size: 15, weight: .bold, monospacedNumbers: true, stylisticAltOne: true, stylisticAltTwo: true)
        case .iosTitle1Bold:
            return Self.makeFont(size: 28, weight: .bold, monospacedNumbers: true, stylisticAltOne: true, stylisticAltTwo: true)
        case .iosTitle1Regular:
            return Self.makeFont(size: 28, weight: .regular, monospacedNumbers: true, stylisticAltOne: true, stylisticAltTwo: true)
        case .iosTitle2Bold:
            return Self.makeFont(size: 22, weight: .bold, monospacedNumbers: true, stylisticAltOne: true, stylisticAltTwo: true)
        case .iosTitle2Regular:
            return Self.makeFont(size: 22, weight: .regular, monospacedNumbers: true, stylisticAltOne: true, stylisticAltTwo: true)
        case .iosTitle3Bold:
            return Self.makeFont(size: 20, weight: .bold, monospacedNumbers: true, stylisticAltOne: true, stylisticAltTwo: true)
        case .iosTitle3Regular:
            return Self.makeFont(size: 20, weight: .regular, monospacedNumbers: true, stylisticAltOne: true, stylisticAltTwo: true)
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
    @nonobjc final class var grpIosBodyMedium: UIFont {
        Fonts.iosBodyMedium.uiFont
    }

    @nonobjc final class var grpIosBodyRegular: UIFont {
        Fonts.iosBodyRegular.uiFont
    }

    @nonobjc final class var grpIosBodySemibold: UIFont {
        Fonts.iosBodySemibold.uiFont
    }

    @nonobjc final class var grpIosCaption1Medium: UIFont {
        Fonts.iosCaption1Medium.uiFont
    }

    @nonobjc final class var grpIosCaption1Regular: UIFont {
        Fonts.iosCaption1Regular.uiFont
    }

    @nonobjc final class var grpIosCaption2Medium: UIFont {
        Fonts.iosCaption2Medium.uiFont
    }

    @nonobjc final class var grpIosCaption2Regular: UIFont {
        Fonts.iosCaption2Regular.uiFont
    }

    @nonobjc final class var grpIosCaption2Semibold: UIFont {
        Fonts.iosCaption2Semibold.uiFont
    }

    @nonobjc final class var grpIosFootnoteMedium: UIFont {
        Fonts.iosFootnoteMedium.uiFont
    }

    @nonobjc final class var grpIosFootnoteRegular: UIFont {
        Fonts.iosFootnoteRegular.uiFont
    }

    @nonobjc final class var grpIosFootnoteSemibold: UIFont {
        Fonts.iosFootnoteSemibold.uiFont
    }

    @nonobjc final class var grpIosLargeTitleBold: UIFont {
        Fonts.iosLargeTitleBold.uiFont
    }

    @nonobjc final class var grpIosLargeTitleRegular: UIFont {
        Fonts.iosLargeTitleRegular.uiFont
    }

    @nonobjc final class var grpIosSubheadMedium: UIFont {
        Fonts.iosSubheadMedium.uiFont
    }

    @nonobjc final class var grpIosSubheadRegular: UIFont {
        Fonts.iosSubheadRegular.uiFont
    }

    @nonobjc final class var grpIosSubheadSemibold: UIFont {
        Fonts.iosSubheadSemibold.uiFont
    }

    @nonobjc final class var grpIosTitle1Bold: UIFont {
        Fonts.iosTitle1Bold.uiFont
    }

    @nonobjc final class var grpIosTitle1Regular: UIFont {
        Fonts.iosTitle1Regular.uiFont
    }

    @nonobjc final class var grpIosTitle2Bold: UIFont {
        Fonts.iosTitle2Bold.uiFont
    }

    @nonobjc final class var grpIosTitle2Regular: UIFont {
        Fonts.iosTitle2Regular.uiFont
    }

    @nonobjc final class var grpIosTitle3Bold: UIFont {
        Fonts.iosTitle3Bold.uiFont
    }

    @nonobjc final class var grpIosTitle3Regular: UIFont {
        Fonts.iosTitle3Regular.uiFont
    }
}
#endif
