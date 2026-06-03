#if canImport(UIKit)
import CoreText
import UIKit

public enum Fonts: String, CaseIterable, Equatable {
    case androidBodyMedium = "text-android-body-medium"
    case androidBodyRegular = "text-android-body-regular"
    case androidBodySemibold = "text-android-body-semibold"
    case androidCaption1Medium = "text-android-caption1-medium"
    case androidCaption1Regular = "text-android-caption1-regular"
    case androidCaption2Regular = "text-android-caption2-regular"
    case androidCaption2Semibold = "text-android-caption2-semibold"
    case androidFootnoteMedium = "text-android-footnote-medium"
    case androidFootnoteRegular = "text-android-footnote-regular"
    case androidFootnoteSemibold = "text-android-footnote-semibold"
    case androidLargeTitleBold = "text-android-large-title-bold"
    case androidLargeTitleRegular = "text-android-large-title-regular"
    case androidSubheadMedium = "text-android-subhead-medium"
    case androidSubheadRegular = "text-android-subhead-regular"
    case androidSubheadSemibold = "text-android-subhead-semibold"
    case androidTitle1Bold = "text-android-title1-bold"
    case androidTitle1Regular = "text-android-title1-regular"
    case androidTitle2Bold = "text-android-title2-bold"
    case androidTitle2Regular = "text-android-title2-regular"
    case androidTitle3Bold = "text-android-title3-bold"
    case androidTitle3Regular = "text-android-title3-regular"
    case iOsBodyMedium = "text-i-os-body-medium"
    case iOsBodyRegular = "text-i-os-body-regular"
    case iOsBodySemibold = "text-i-os-body-semibold"
    case iOsCaption1Medium = "text-i-os-caption1-medium"
    case iOsCaption1Regular = "text-i-os-caption1-regular"
    case iOsCaption2Medium = "text-i-os-caption2-medium"
    case iOsCaption2Regular = "text-i-os-caption2-regular"
    case iOsCaption2Semibold = "text-i-os-caption2-semibold"
    case iOsFootnoteMedium = "text-i-os-footnote-medium"
    case iOsFootnoteRegular = "text-i-os-footnote-regular"
    case iOsFootnoteSemibold = "text-i-os-footnote-semibold"
    case iOsLargeTitleBold = "text-i-os-large-title-bold"
    case iOsLargeTitleRegular = "text-i-os-large-title-regular"
    case iOsSubheadMedium = "text-i-os-subhead-medium"
    case iOsSubheadRegular = "text-i-os-subhead-regular"
    case iOsSubheadSemibold = "text-i-os-subhead-semibold"
    case iOsTitle1Bold = "text-i-os-title1-bold"
    case iOsTitle1Regular = "text-i-os-title1-regular"
    case iOsTitle2Bold = "text-i-os-title2-bold"
    case iOsTitle2Regular = "text-i-os-title2-regular"
    case iOsTitle3Bold = "text-i-os-title3-bold"
    case iOsTitle3Regular = "text-i-os-title3-regular"
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
        case .androidBodyMedium:
            return Self.makeFont(size: 17, weight: .medium, monospacedNumbers: false, stylisticAltOne: true, stylisticAltTwo: true)
        case .androidBodyRegular:
            return Self.makeFont(size: 17, weight: .regular, monospacedNumbers: false)
        case .androidBodySemibold:
            return Self.makeFont(size: 17, weight: .bold, monospacedNumbers: false)
        case .androidCaption1Medium:
            return Self.makeFont(size: 12, weight: .medium, monospacedNumbers: false)
        case .androidCaption1Regular:
            return Self.makeFont(size: 12, weight: .regular, monospacedNumbers: false)
        case .androidCaption2Regular:
            return Self.makeFont(size: 11, weight: .regular, monospacedNumbers: true, stylisticAltOne: true, stylisticAltTwo: true)
        case .androidCaption2Semibold:
            return Self.makeFont(size: 11, weight: .bold, monospacedNumbers: true, stylisticAltOne: true, stylisticAltTwo: true)
        case .androidFootnoteMedium:
            return Self.makeFont(size: 13, weight: .medium, monospacedNumbers: true, stylisticAltOne: true, stylisticAltTwo: true)
        case .androidFootnoteRegular:
            return Self.makeFont(size: 13, weight: .regular, monospacedNumbers: true, stylisticAltOne: true, stylisticAltTwo: true)
        case .androidFootnoteSemibold:
            return Self.makeFont(size: 13, weight: .bold, monospacedNumbers: false, stylisticAltOne: true, stylisticAltTwo: true)
        case .androidLargeTitleBold:
            return Self.makeFont(size: 34, weight: .bold, monospacedNumbers: false)
        case .androidLargeTitleRegular:
            return Self.makeFont(size: 34, weight: .regular, monospacedNumbers: false)
        case .androidSubheadMedium:
            return Self.makeFont(size: 15, weight: .medium, monospacedNumbers: false)
        case .androidSubheadRegular:
            return Self.makeFont(size: 15, weight: .regular, monospacedNumbers: false)
        case .androidSubheadSemibold:
            return Self.makeFont(size: 15, weight: .bold, monospacedNumbers: false)
        case .androidTitle1Bold:
            return Self.makeFont(size: 28, weight: .bold, monospacedNumbers: false)
        case .androidTitle1Regular:
            return Self.makeFont(size: 28, weight: .regular, monospacedNumbers: false)
        case .androidTitle2Bold:
            return Self.makeFont(size: 22, weight: .bold, monospacedNumbers: false)
        case .androidTitle2Regular:
            return Self.makeFont(size: 22, weight: .regular, monospacedNumbers: false)
        case .androidTitle3Bold:
            return Self.makeFont(size: 20, weight: .bold, monospacedNumbers: false)
        case .androidTitle3Regular:
            return Self.makeFont(size: 20, weight: .regular, monospacedNumbers: false)
        case .iOsBodyMedium:
            return Self.makeFont(size: 17, weight: .medium, monospacedNumbers: false, stylisticAltOne: true, stylisticAltTwo: true)
        case .iOsBodyRegular:
            return Self.makeFont(size: 17, weight: .regular, monospacedNumbers: true, stylisticAltOne: true, stylisticAltTwo: true)
        case .iOsBodySemibold:
            return Self.makeFont(size: 17, weight: .bold, monospacedNumbers: false, stylisticAltOne: true, stylisticAltTwo: true)
        case .iOsCaption1Medium:
            return Self.makeFont(size: 12, weight: .medium, monospacedNumbers: true, stylisticAltOne: true, stylisticAltTwo: true)
        case .iOsCaption1Regular:
            return Self.makeFont(size: 12, weight: .regular, monospacedNumbers: true, stylisticAltOne: true, stylisticAltTwo: true)
        case .iOsCaption2Medium:
            return Self.makeFont(size: 11, weight: .medium, monospacedNumbers: true, stylisticAltOne: true, stylisticAltTwo: true)
        case .iOsCaption2Regular:
            return Self.makeFont(size: 11, weight: .regular, monospacedNumbers: true, stylisticAltOne: true, stylisticAltTwo: true)
        case .iOsCaption2Semibold:
            return Self.makeFont(size: 11, weight: .bold, monospacedNumbers: true, stylisticAltOne: true, stylisticAltTwo: true)
        case .iOsFootnoteMedium:
            return Self.makeFont(size: 13, weight: .medium, monospacedNumbers: true, stylisticAltOne: true, stylisticAltTwo: true)
        case .iOsFootnoteRegular:
            return Self.makeFont(size: 13, weight: .regular, monospacedNumbers: true, stylisticAltOne: true, stylisticAltTwo: true)
        case .iOsFootnoteSemibold:
            return Self.makeFont(size: 13, weight: .bold, monospacedNumbers: true, stylisticAltOne: true, stylisticAltTwo: true)
        case .iOsLargeTitleBold:
            return Self.makeFont(size: 34, weight: .bold, monospacedNumbers: true, stylisticAltOne: true, stylisticAltTwo: true)
        case .iOsLargeTitleRegular:
            return Self.makeFont(size: 34, weight: .regular, monospacedNumbers: true, stylisticAltOne: true, stylisticAltTwo: true)
        case .iOsSubheadMedium:
            return Self.makeFont(size: 15, weight: .medium, monospacedNumbers: true, stylisticAltOne: true, stylisticAltTwo: true)
        case .iOsSubheadRegular:
            return Self.makeFont(size: 15, weight: .regular, monospacedNumbers: true, stylisticAltOne: true, stylisticAltTwo: true)
        case .iOsSubheadSemibold:
            return Self.makeFont(size: 15, weight: .bold, monospacedNumbers: true, stylisticAltOne: true, stylisticAltTwo: true)
        case .iOsTitle1Bold:
            return Self.makeFont(size: 28, weight: .bold, monospacedNumbers: true, stylisticAltOne: true, stylisticAltTwo: true)
        case .iOsTitle1Regular:
            return Self.makeFont(size: 28, weight: .regular, monospacedNumbers: true, stylisticAltOne: true, stylisticAltTwo: true)
        case .iOsTitle2Bold:
            return Self.makeFont(size: 22, weight: .bold, monospacedNumbers: true, stylisticAltOne: true, stylisticAltTwo: true)
        case .iOsTitle2Regular:
            return Self.makeFont(size: 22, weight: .regular, monospacedNumbers: true, stylisticAltOne: true, stylisticAltTwo: true)
        case .iOsTitle3Bold:
            return Self.makeFont(size: 20, weight: .bold, monospacedNumbers: true, stylisticAltOne: true, stylisticAltTwo: true)
        case .iOsTitle3Regular:
            return Self.makeFont(size: 20, weight: .regular, monospacedNumbers: true, stylisticAltOne: true, stylisticAltTwo: true)
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
    @nonobjc final class var grpAndroidBodyMedium: UIFont {
        Fonts.androidBodyMedium.uiFont
    }

    @nonobjc final class var grpAndroidBodyRegular: UIFont {
        Fonts.androidBodyRegular.uiFont
    }

    @nonobjc final class var grpAndroidBodySemibold: UIFont {
        Fonts.androidBodySemibold.uiFont
    }

    @nonobjc final class var grpAndroidCaption1Medium: UIFont {
        Fonts.androidCaption1Medium.uiFont
    }

    @nonobjc final class var grpAndroidCaption1Regular: UIFont {
        Fonts.androidCaption1Regular.uiFont
    }

    @nonobjc final class var grpAndroidCaption2Regular: UIFont {
        Fonts.androidCaption2Regular.uiFont
    }

    @nonobjc final class var grpAndroidCaption2Semibold: UIFont {
        Fonts.androidCaption2Semibold.uiFont
    }

    @nonobjc final class var grpAndroidFootnoteMedium: UIFont {
        Fonts.androidFootnoteMedium.uiFont
    }

    @nonobjc final class var grpAndroidFootnoteRegular: UIFont {
        Fonts.androidFootnoteRegular.uiFont
    }

    @nonobjc final class var grpAndroidFootnoteSemibold: UIFont {
        Fonts.androidFootnoteSemibold.uiFont
    }

    @nonobjc final class var grpAndroidLargeTitleBold: UIFont {
        Fonts.androidLargeTitleBold.uiFont
    }

    @nonobjc final class var grpAndroidLargeTitleRegular: UIFont {
        Fonts.androidLargeTitleRegular.uiFont
    }

    @nonobjc final class var grpAndroidSubheadMedium: UIFont {
        Fonts.androidSubheadMedium.uiFont
    }

    @nonobjc final class var grpAndroidSubheadRegular: UIFont {
        Fonts.androidSubheadRegular.uiFont
    }

    @nonobjc final class var grpAndroidSubheadSemibold: UIFont {
        Fonts.androidSubheadSemibold.uiFont
    }

    @nonobjc final class var grpAndroidTitle1Bold: UIFont {
        Fonts.androidTitle1Bold.uiFont
    }

    @nonobjc final class var grpAndroidTitle1Regular: UIFont {
        Fonts.androidTitle1Regular.uiFont
    }

    @nonobjc final class var grpAndroidTitle2Bold: UIFont {
        Fonts.androidTitle2Bold.uiFont
    }

    @nonobjc final class var grpAndroidTitle2Regular: UIFont {
        Fonts.androidTitle2Regular.uiFont
    }

    @nonobjc final class var grpAndroidTitle3Bold: UIFont {
        Fonts.androidTitle3Bold.uiFont
    }

    @nonobjc final class var grpAndroidTitle3Regular: UIFont {
        Fonts.androidTitle3Regular.uiFont
    }

    @nonobjc final class var grpIOsBodyMedium: UIFont {
        Fonts.iOsBodyMedium.uiFont
    }

    @nonobjc final class var grpIOsBodyRegular: UIFont {
        Fonts.iOsBodyRegular.uiFont
    }

    @nonobjc final class var grpIOsBodySemibold: UIFont {
        Fonts.iOsBodySemibold.uiFont
    }

    @nonobjc final class var grpIOsCaption1Medium: UIFont {
        Fonts.iOsCaption1Medium.uiFont
    }

    @nonobjc final class var grpIOsCaption1Regular: UIFont {
        Fonts.iOsCaption1Regular.uiFont
    }

    @nonobjc final class var grpIOsCaption2Medium: UIFont {
        Fonts.iOsCaption2Medium.uiFont
    }

    @nonobjc final class var grpIOsCaption2Regular: UIFont {
        Fonts.iOsCaption2Regular.uiFont
    }

    @nonobjc final class var grpIOsCaption2Semibold: UIFont {
        Fonts.iOsCaption2Semibold.uiFont
    }

    @nonobjc final class var grpIOsFootnoteMedium: UIFont {
        Fonts.iOsFootnoteMedium.uiFont
    }

    @nonobjc final class var grpIOsFootnoteRegular: UIFont {
        Fonts.iOsFootnoteRegular.uiFont
    }

    @nonobjc final class var grpIOsFootnoteSemibold: UIFont {
        Fonts.iOsFootnoteSemibold.uiFont
    }

    @nonobjc final class var grpIOsLargeTitleBold: UIFont {
        Fonts.iOsLargeTitleBold.uiFont
    }

    @nonobjc final class var grpIOsLargeTitleRegular: UIFont {
        Fonts.iOsLargeTitleRegular.uiFont
    }

    @nonobjc final class var grpIOsSubheadMedium: UIFont {
        Fonts.iOsSubheadMedium.uiFont
    }

    @nonobjc final class var grpIOsSubheadRegular: UIFont {
        Fonts.iOsSubheadRegular.uiFont
    }

    @nonobjc final class var grpIOsSubheadSemibold: UIFont {
        Fonts.iOsSubheadSemibold.uiFont
    }

    @nonobjc final class var grpIOsTitle1Bold: UIFont {
        Fonts.iOsTitle1Bold.uiFont
    }

    @nonobjc final class var grpIOsTitle1Regular: UIFont {
        Fonts.iOsTitle1Regular.uiFont
    }

    @nonobjc final class var grpIOsTitle2Bold: UIFont {
        Fonts.iOsTitle2Bold.uiFont
    }

    @nonobjc final class var grpIOsTitle2Regular: UIFont {
        Fonts.iOsTitle2Regular.uiFont
    }

    @nonobjc final class var grpIOsTitle3Bold: UIFont {
        Fonts.iOsTitle3Bold.uiFont
    }

    @nonobjc final class var grpIOsTitle3Regular: UIFont {
        Fonts.iOsTitle3Regular.uiFont
    }

    @nonobjc final class var grpWebBodyMedium: UIFont {
        Fonts.webBodyMedium.uiFont
    }

    @nonobjc final class var grpWebBodyRegular: UIFont {
        Fonts.webBodyRegular.uiFont
    }

    @nonobjc final class var grpWebFootnoteMedium: UIFont {
        Fonts.webFootnoteMedium.uiFont
    }

    @nonobjc final class var grpWebFootnoteRegular: UIFont {
        Fonts.webFootnoteRegular.uiFont
    }

    @nonobjc final class var grpWebSubheadMedium: UIFont {
        Fonts.webSubheadMedium.uiFont
    }

    @nonobjc final class var grpWebSubheadRegular: UIFont {
        Fonts.webSubheadRegular.uiFont
    }

    @nonobjc final class var grpWebTitleMedium: UIFont {
        Fonts.webTitleMedium.uiFont
    }

    @nonobjc final class var grpWebTitleRegular: UIFont {
        Fonts.webTitleRegular.uiFont
    }
}
#endif
