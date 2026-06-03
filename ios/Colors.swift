#if canImport(UIKit)
import SwiftUI
import UIKit

public enum Colors: String, CaseIterable, Equatable {
    case accentBlue = "color-accent-blue"
    case accentDefault = "color-accent-default"
    case amountNegative = "color-amount-negative"
    case amountPositive = "color-amount-positive"
    case baseBlue300 = "color-base-blue-300"
    case baseBlue350 = "color-base-blue-350"
    case baseBlue400 = "color-base-blue-400"
    case baseBlue450 = "color-base-blue-450"
    case baseBlue500 = "color-base-blue-500"
    case baseBlue550 = "color-base-blue-550"
    case baseBlue600 = "color-base-blue-600"
    case baseCyan300 = "color-base-cyan-300"
    case baseCyan350 = "color-base-cyan-350"
    case baseCyan400 = "color-base-cyan-400"
    case baseCyan450 = "color-base-cyan-450"
    case baseCyan500 = "color-base-cyan-500"
    case baseCyan550 = "color-base-cyan-550"
    case baseCyan600 = "color-base-cyan-600"
    case baseDefault50 = "color-base-default-50"
    case baseDefault100 = "color-base-default-100"
    case baseDefault150 = "color-base-default-150"
    case baseDefault200 = "color-base-default-200"
    case baseDefault300 = "color-base-default-300"
    case baseDefault350 = "color-base-default-350"
    case baseDefault400 = "color-base-default-400"
    case baseDefault450 = "color-base-default-450"
    case baseDefault500 = "color-base-default-500"
    case baseDefault550 = "color-base-default-550"
    case baseDefault600 = "color-base-default-600"
    case baseDefault900 = "color-base-default-900"
    case baseDefault950 = "color-base-default-950"
    case baseDefault1000 = "color-base-default-1000"
    case baseGreen300 = "color-base-green-300"
    case baseGreen350 = "color-base-green-350"
    case baseGreen400 = "color-base-green-400"
    case baseGreen450 = "color-base-green-450"
    case baseGreen500 = "color-base-green-500"
    case baseGreen550 = "color-base-green-550"
    case baseGreen600 = "color-base-green-600"
    case baseIndigo300 = "color-base-indigo-300"
    case baseIndigo350 = "color-base-indigo-350"
    case baseIndigo400 = "color-base-indigo-400"
    case baseIndigo450 = "color-base-indigo-450"
    case baseIndigo500 = "color-base-indigo-500"
    case baseIndigo550 = "color-base-indigo-550"
    case baseIndigo600 = "color-base-indigo-600"
    case baseOrange300 = "color-base-orange-300"
    case baseOrange350 = "color-base-orange-350"
    case baseOrange400 = "color-base-orange-400"
    case baseOrange450 = "color-base-orange-450"
    case baseOrange500 = "color-base-orange-500"
    case baseOrange550 = "color-base-orange-550"
    case baseOrange600 = "color-base-orange-600"
    case baseRed300 = "color-base-red-300"
    case baseRed350 = "color-base-red-350"
    case baseRed400 = "color-base-red-400"
    case baseRed450 = "color-base-red-450"
    case baseRed500 = "color-base-red-500"
    case baseRed550 = "color-base-red-550"
    case baseRed600 = "color-base-red-600"
    case baseYellow300 = "color-base-yellow-300"
    case baseYellow350 = "color-base-yellow-350"
    case baseYellow400 = "color-base-yellow-400"
    case baseYellow450 = "color-base-yellow-450"
    case baseYellow500 = "color-base-yellow-500"
    case baseYellow550 = "color-base-yellow-550"
    case baseYellow600 = "color-base-yellow-600"
    case borderPrimary = "color-border-primary"
    case borderSecondary = "color-border-secondary"
    case eventAgentFee = "color-event-agent-fee"
    case eventDividends = "color-event-dividends"
    case eventEstimate = "color-event-estimate"
    case eventEstimateMuted = "color-event-estimate-muted"
    case eventExpense = "color-event-expense"
    case eventExpenseMuted = "color-event-expense-muted"
    case eventIncome = "color-event-income"
    case eventMarkup = "color-event-markup"
    case eventPaymentOwn = "color-event-payment-own"
    case eventPaymentWorking = "color-event-payment-working"
    case focusRing = "color-focus-ring"
    case highlightCalendar = "color-highlight-calendar"
    case highlightText = "color-highlight-text"
    case highlighter = "color-highlighter"
    case onAccentPrimary = "color-on-accent-primary"
    case onAccentSecondary = "color-on-accent-secondary"
    case onAccentTertiary = "color-on-accent-tertiary"
    case overlay = "color-overlay"
    case shadowBase = "color-shadow-base"
    case shadowStroke = "color-shadow-stroke"
    case shadowStrokeLight = "color-shadow-stroke-light"
    case stateDisabled = "color-state-disabled"
    case stateHover = "color-state-hover"
    case stateOnAccentHover = "color-state-on-accent-hover"
    case stateOnAccentPressed = "color-state-on-accent-pressed"
    case statePressed = "color-state-pressed"
    case stateSelected = "color-state-selected"
    case staticBlack = "color-static-black"
    case staticWhite = "color-static-white"
    case statusError = "color-status-error"
    case statusSuccess = "color-status-success"
    case statusWarning = "color-status-warning"
    case surface0 = "color-surface-0"
    case surface1 = "color-surface-1"
    case surface2 = "color-surface-2"
    case surface3 = "color-surface-3"
    case surfaceInverse = "color-surface-inverse"
    case textPrimary = "color-text-primary"
    case textQuaternary = "color-text-quaternary"
    case textSecondary = "color-text-secondary"
    case textTertiary = "color-text-tertiary"
    case toast = "color-toast"

    public var colorName: String {
        rawValue
    }

    public var uiColor: UIColor {
        switch self {
        case .accentBlue:
            return Self.dynamicColor(light: "#0088FF", dark: "#0091FF")
        case .accentDefault:
            return Self.dynamicColor(light: "#0E0E0F", dark: "#FFFFFF")
        case .amountNegative:
            return Self.dynamicColor(light: "#F40017", dark: "#F40017")
        case .amountPositive:
            return Self.dynamicColor(light: "#00A530", dark: "#00A530")
        case .baseBlue300:
            return Self.dynamicColor(light: "#004999", dark: "#004999")
        case .baseBlue350:
            return Self.dynamicColor(light: "#0055B2", dark: "#0055B2")
        case .baseBlue400:
            return Self.dynamicColor(light: "#0062CC", dark: "#0062CC")
        case .baseBlue450:
            return Self.dynamicColor(light: "#006EE5", dark: "#006EE5")
        case .baseBlue500:
            return Self.dynamicColor(light: "#007AFF", dark: "#007AFF")
        case .baseBlue550:
            return Self.dynamicColor(light: "#1A87FF", dark: "#1A87FF")
        case .baseBlue600:
            return Self.dynamicColor(light: "#3395FF", dark: "#3395FF")
        case .baseCyan300:
            return Self.dynamicColor(light: "#1E688A", dark: "#1E688A")
        case .baseCyan350:
            return Self.dynamicColor(light: "#2379A1", dark: "#2379A1")
        case .baseCyan400:
            return Self.dynamicColor(light: "#288AB8", dark: "#288AB8")
        case .baseCyan450:
            return Self.dynamicColor(light: "#2D9CCF", dark: "#2D9CCF")
        case .baseCyan500:
            return Self.dynamicColor(light: "#32ADE6", dark: "#32ADE6")
        case .baseCyan550:
            return Self.dynamicColor(light: "#47B5E8", dark: "#47B5E8")
        case .baseCyan600:
            return Self.dynamicColor(light: "#5BBDEB", dark: "#5BBDEB")
        case .baseDefault50:
            return Self.dynamicColor(light: "#0E0E0F", dark: "#0E0E0F")
        case .baseDefault100:
            return Self.dynamicColor(light: "#1C1C1D", dark: "#1C1C1D")
        case .baseDefault150:
            return Self.dynamicColor(light: "#2B2B2C", dark: "#2B2B2C")
        case .baseDefault200:
            return Self.dynamicColor(light: "#39393B", dark: "#39393B")
        case .baseDefault300:
            return Self.dynamicColor(light: "#555558", dark: "#555558")
        case .baseDefault350:
            return Self.dynamicColor(light: "#636367", dark: "#636367")
        case .baseDefault400:
            return Self.dynamicColor(light: "#727276", dark: "#727276")
        case .baseDefault450:
            return Self.dynamicColor(light: "#808084", dark: "#808084")
        case .baseDefault500:
            return Self.dynamicColor(light: "#8E8E93", dark: "#8E8E93")
        case .baseDefault550:
            return Self.dynamicColor(light: "#99999E", dark: "#99999E")
        case .baseDefault600:
            return Self.dynamicColor(light: "#A5A5A9", dark: "#A5A5A9")
        case .baseDefault900:
            return Self.dynamicColor(light: "#E5E5E5", dark: "#E5E5E5")
        case .baseDefault950:
            return Self.dynamicColor(light: "#F2F2F7", dark: "#F2F2F7")
        case .baseDefault1000:
            return Self.dynamicColor(light: "#FFFFFF", dark: "#FFFFFF")
        case .baseGreen300:
            return Self.dynamicColor(light: "#1F7735", dark: "#1F7735")
        case .baseGreen350:
            return Self.dynamicColor(light: "#248B3E", dark: "#248B3E")
        case .baseGreen400:
            return Self.dynamicColor(light: "#2A9F47", dark: "#2A9F47")
        case .baseGreen450:
            return Self.dynamicColor(light: "#2FB350", dark: "#2FB350")
        case .baseGreen500:
            return Self.dynamicColor(light: "#34C759", dark: "#34C759")
        case .baseGreen550:
            return Self.dynamicColor(light: "#48CD6A", dark: "#48CD6A")
        case .baseGreen600:
            return Self.dynamicColor(light: "#5DD27A", dark: "#5DD27A")
        case .baseIndigo300:
            return Self.dynamicColor(light: "#353480", dark: "#353480")
        case .baseIndigo350:
            return Self.dynamicColor(light: "#3E3C96", dark: "#3E3C96")
        case .baseIndigo400:
            return Self.dynamicColor(light: "#4645AB", dark: "#4645AB")
        case .baseIndigo450:
            return Self.dynamicColor(light: "#4F4DC1", dark: "#4F4DC1")
        case .baseIndigo500:
            return Self.dynamicColor(light: "#5856D6", dark: "#5856D6")
        case .baseIndigo550:
            return Self.dynamicColor(light: "#6967DA", dark: "#6967DA")
        case .baseIndigo600:
            return Self.dynamicColor(light: "#7978DE", dark: "#7978DE")
        case .baseOrange300:
            return Self.dynamicColor(light: "#995F06", dark: "#995F06")
        case .baseOrange350:
            return Self.dynamicColor(light: "#B26F07", dark: "#B26F07")
        case .baseOrange400:
            return Self.dynamicColor(light: "#CC7F08", dark: "#CC7F08")
        case .baseOrange450:
            return Self.dynamicColor(light: "#E58F09", dark: "#E58F09")
        case .baseOrange500:
            return Self.dynamicColor(light: "#FF9F0A", dark: "#FF9F0A")
        case .baseOrange550:
            return Self.dynamicColor(light: "#FFA923", dark: "#FFA923")
        case .baseOrange600:
            return Self.dynamicColor(light: "#FFB23B", dark: "#FFB23B")
        case .baseRed300:
            return Self.dynamicColor(light: "#99231D", dark: "#99231D")
        case .baseRed350:
            return Self.dynamicColor(light: "#B22922", dark: "#B22922")
        case .baseRed400:
            return Self.dynamicColor(light: "#CC2F26", dark: "#CC2F26")
        case .baseRed450:
            return Self.dynamicColor(light: "#E5352B", dark: "#E5352B")
        case .baseRed500:
            return Self.dynamicColor(light: "#FF3B30", dark: "#FF3B30")
        case .baseRed550:
            return Self.dynamicColor(light: "#FF4F45", dark: "#FF4F45")
        case .baseRed600:
            return Self.dynamicColor(light: "#FF6259", dark: "#FF6259")
        case .baseYellow300:
            return Self.dynamicColor(light: "#997A00", dark: "#997A00")
        case .baseYellow350:
            return Self.dynamicColor(light: "#B28F00", dark: "#B28F00")
        case .baseYellow400:
            return Self.dynamicColor(light: "#CCA300", dark: "#CCA300")
        case .baseYellow450:
            return Self.dynamicColor(light: "#E5B800", dark: "#E5B800")
        case .baseYellow500:
            return Self.dynamicColor(light: "#FFCC00", dark: "#FFCC00")
        case .baseYellow550:
            return Self.dynamicColor(light: "#FFD11A", dark: "#FFD11A")
        case .baseYellow600:
            return Self.dynamicColor(light: "#FFD633", dark: "#FFD633")
        case .borderPrimary:
            return Self.dynamicColor(light: "#E8E8E8", dark: "#343438")
        case .borderSecondary:
            return Self.dynamicColor(light: "#C6C6C8", dark: "#202022")
        case .eventAgentFee:
            return Self.dynamicColor(light: "#2B91A0", dark: "#2B91A0")
        case .eventDividends:
            return Self.dynamicColor(light: "#2D9CCF", dark: "#32ADE6")
        case .eventEstimate:
            return Self.dynamicColor(light: "#6D43F6", dark: "#6D43F6")
        case .eventEstimateMuted:
            return Self.dynamicColor(light: "#A9A2EF", dark: "#666290")
        case .eventExpense:
            return Self.dynamicColor(light: "#C4317A", dark: "#C4317A")
        case .eventExpenseMuted:
            return Self.dynamicColor(light: "#D796C0", dark: "#8E637F")
        case .eventIncome:
            return Self.dynamicColor(light: "#6E8D44", dark: "#6E8D44")
        case .eventMarkup:
            return Self.dynamicColor(light: "#E58F09", dark: "#FF9F0A")
        case .eventPaymentOwn:
            return Self.dynamicColor(light: "#A65959", dark: "#A65959")
        case .eventPaymentWorking:
            return Self.dynamicColor(light: "#C19810", dark: "#C19810")
        case .focusRing:
            return Self.dynamicColor(light: "#0088FF", dark: "#0091FF")
        case .highlightCalendar:
            return Self.dynamicColor(light: "#F75951", dark: "#F75951")
        case .highlightText:
            return Self.dynamicColor(light: "#3CD3FE61", dark: "#3CD3FE78")
        case .highlighter:
            return Self.dynamicColor(light: "#3CD3FE61", dark: "#3CD3FE78")
        case .onAccentPrimary:
            return Self.dynamicColor(light: "#ECECF1", dark: "#1C1C1D")
        case .onAccentSecondary:
            return Self.dynamicColor(light: "#9F9FA5", dark: "#8A8A8E")
        case .onAccentTertiary:
            return Self.dynamicColor(light: "#5A5A5F", dark: "#BBBBC1")
        case .overlay:
            return Self.dynamicColor(light: "#0000009E", dark: "#00000061")
        case .shadowBase:
            return Self.dynamicColor(light: "#00000029", dark: "#00000029")
        case .shadowStroke:
            return Self.dynamicColor(light: "#00000029", dark: "#FFFFFF21")
        case .shadowStrokeLight:
            return Self.dynamicColor(light: "#0000000D", dark: "#FFFFFF0A")
        case .stateDisabled:
            return Self.dynamicColor(light: "#7878809E", dark: "#78788080")
        case .stateHover:
            return Self.dynamicColor(light: "#0000000A", dark: "#FFFFFF14")
        case .stateOnAccentHover:
            return Self.dynamicColor(light: "#FFFFFF3D", dark: "#00000029")
        case .stateOnAccentPressed:
            return Self.dynamicColor(light: "#FFFFFF61", dark: "#0000003D")
        case .statePressed:
            return Self.dynamicColor(light: "#00000014", dark: "#FFFFFF1F")
        case .stateSelected:
            return Self.dynamicColor(light: "#0000000F", dark: "#FFFFFF1A")
        case .staticBlack:
            return Self.dynamicColor(light: "#0E0E0F", dark: "#0E0E0F")
        case .staticWhite:
            return Self.dynamicColor(light: "#FFFFFF", dark: "#FFFFFF")
        case .statusError:
            return Self.dynamicColor(light: "#F75951", dark: "#F75951")
        case .statusSuccess:
            return Self.dynamicColor(light: "#2FB350", dark: "#34C759")
        case .statusWarning:
            return Self.dynamicColor(light: "#E58F09", dark: "#FF9F0A")
        case .surface0:
            return Self.dynamicColor(light: "#EFEFEF", dark: "#101010")
        case .surface1:
            return Self.dynamicColor(light: "#F9F9F9", dark: "#191919")
        case .surface2:
            return Self.dynamicColor(light: "#FFFFFF", dark: "#222222")
        case .surface3:
            return Self.dynamicColor(light: "#FFFFFF", dark: "#323232")
        case .surfaceInverse:
            return Self.dynamicColor(light: "#000000CC", dark: "#FFFFFFCC")
        case .textPrimary:
            return Self.dynamicColor(light: "#2A2A2C", dark: "#ECECF1")
        case .textQuaternary:
            return Self.dynamicColor(light: "#DEDEE5", dark: "#303034")
        case .textSecondary:
            return Self.dynamicColor(light: "#8A8A8E", dark: "#9F9FA5")
        case .textTertiary:
            return Self.dynamicColor(light: "#BBBBC1", dark: "#5A5A5F")
        case .toast:
            return Self.dynamicColor(light: "#000000CC", dark: "#000000CC")
        }
    }

    public var color: Color {
        Color(uiColor)
    }

    private static func dynamicColor(light: String, dark: String) -> UIColor {
        if #available(iOS 13.0, *) {
            return UIColor { traits in
                traits.userInterfaceStyle == .dark ? Self.color(hex: dark) : Self.color(hex: light)
            }
        }
        return Self.color(hex: light)
    }

    private static func color(hex: String) -> UIColor {
        let normalized = hex.trimmingCharacters(in: CharacterSet(charactersIn: "#"))
        let scanner = Scanner(string: normalized)
        var value: UInt64 = 0
        guard scanner.scanHexInt64(&value) else {
            return UIColor(white: 0, alpha: 1)
        }

        switch normalized.count {
        case 6:
            return UIColor(
                red: CGFloat((value & 0xFF0000) >> 16) / 255.0,
                green: CGFloat((value & 0x00FF00) >> 8) / 255.0,
                blue: CGFloat(value & 0x0000FF) / 255.0,
                alpha: 1.0
            )
        case 8:
            return UIColor(
                red: CGFloat((value & 0xFF000000) >> 24) / 255.0,
                green: CGFloat((value & 0x00FF0000) >> 16) / 255.0,
                blue: CGFloat((value & 0x0000FF00) >> 8) / 255.0,
                alpha: CGFloat(value & 0x000000FF) / 255.0
            )
        default:
            return UIColor(white: 0, alpha: 1)
        }
    }
}

public extension UIColor {
    @nonobjc final class var grpAccentBlue: UIColor {
        Colors.accentBlue.uiColor
    }

    @nonobjc final class var grpAccentDefault: UIColor {
        Colors.accentDefault.uiColor
    }

    @nonobjc final class var grpAmountNegative: UIColor {
        Colors.amountNegative.uiColor
    }

    @nonobjc final class var grpAmountPositive: UIColor {
        Colors.amountPositive.uiColor
    }

    @nonobjc final class var grpBaseBlue300: UIColor {
        Colors.baseBlue300.uiColor
    }

    @nonobjc final class var grpBaseBlue350: UIColor {
        Colors.baseBlue350.uiColor
    }

    @nonobjc final class var grpBaseBlue400: UIColor {
        Colors.baseBlue400.uiColor
    }

    @nonobjc final class var grpBaseBlue450: UIColor {
        Colors.baseBlue450.uiColor
    }

    @nonobjc final class var grpBaseBlue500: UIColor {
        Colors.baseBlue500.uiColor
    }

    @nonobjc final class var grpBaseBlue550: UIColor {
        Colors.baseBlue550.uiColor
    }

    @nonobjc final class var grpBaseBlue600: UIColor {
        Colors.baseBlue600.uiColor
    }

    @nonobjc final class var grpBaseCyan300: UIColor {
        Colors.baseCyan300.uiColor
    }

    @nonobjc final class var grpBaseCyan350: UIColor {
        Colors.baseCyan350.uiColor
    }

    @nonobjc final class var grpBaseCyan400: UIColor {
        Colors.baseCyan400.uiColor
    }

    @nonobjc final class var grpBaseCyan450: UIColor {
        Colors.baseCyan450.uiColor
    }

    @nonobjc final class var grpBaseCyan500: UIColor {
        Colors.baseCyan500.uiColor
    }

    @nonobjc final class var grpBaseCyan550: UIColor {
        Colors.baseCyan550.uiColor
    }

    @nonobjc final class var grpBaseCyan600: UIColor {
        Colors.baseCyan600.uiColor
    }

    @nonobjc final class var grpBaseDefault50: UIColor {
        Colors.baseDefault50.uiColor
    }

    @nonobjc final class var grpBaseDefault100: UIColor {
        Colors.baseDefault100.uiColor
    }

    @nonobjc final class var grpBaseDefault150: UIColor {
        Colors.baseDefault150.uiColor
    }

    @nonobjc final class var grpBaseDefault200: UIColor {
        Colors.baseDefault200.uiColor
    }

    @nonobjc final class var grpBaseDefault300: UIColor {
        Colors.baseDefault300.uiColor
    }

    @nonobjc final class var grpBaseDefault350: UIColor {
        Colors.baseDefault350.uiColor
    }

    @nonobjc final class var grpBaseDefault400: UIColor {
        Colors.baseDefault400.uiColor
    }

    @nonobjc final class var grpBaseDefault450: UIColor {
        Colors.baseDefault450.uiColor
    }

    @nonobjc final class var grpBaseDefault500: UIColor {
        Colors.baseDefault500.uiColor
    }

    @nonobjc final class var grpBaseDefault550: UIColor {
        Colors.baseDefault550.uiColor
    }

    @nonobjc final class var grpBaseDefault600: UIColor {
        Colors.baseDefault600.uiColor
    }

    @nonobjc final class var grpBaseDefault900: UIColor {
        Colors.baseDefault900.uiColor
    }

    @nonobjc final class var grpBaseDefault950: UIColor {
        Colors.baseDefault950.uiColor
    }

    @nonobjc final class var grpBaseDefault1000: UIColor {
        Colors.baseDefault1000.uiColor
    }

    @nonobjc final class var grpBaseGreen300: UIColor {
        Colors.baseGreen300.uiColor
    }

    @nonobjc final class var grpBaseGreen350: UIColor {
        Colors.baseGreen350.uiColor
    }

    @nonobjc final class var grpBaseGreen400: UIColor {
        Colors.baseGreen400.uiColor
    }

    @nonobjc final class var grpBaseGreen450: UIColor {
        Colors.baseGreen450.uiColor
    }

    @nonobjc final class var grpBaseGreen500: UIColor {
        Colors.baseGreen500.uiColor
    }

    @nonobjc final class var grpBaseGreen550: UIColor {
        Colors.baseGreen550.uiColor
    }

    @nonobjc final class var grpBaseGreen600: UIColor {
        Colors.baseGreen600.uiColor
    }

    @nonobjc final class var grpBaseIndigo300: UIColor {
        Colors.baseIndigo300.uiColor
    }

    @nonobjc final class var grpBaseIndigo350: UIColor {
        Colors.baseIndigo350.uiColor
    }

    @nonobjc final class var grpBaseIndigo400: UIColor {
        Colors.baseIndigo400.uiColor
    }

    @nonobjc final class var grpBaseIndigo450: UIColor {
        Colors.baseIndigo450.uiColor
    }

    @nonobjc final class var grpBaseIndigo500: UIColor {
        Colors.baseIndigo500.uiColor
    }

    @nonobjc final class var grpBaseIndigo550: UIColor {
        Colors.baseIndigo550.uiColor
    }

    @nonobjc final class var grpBaseIndigo600: UIColor {
        Colors.baseIndigo600.uiColor
    }

    @nonobjc final class var grpBaseOrange300: UIColor {
        Colors.baseOrange300.uiColor
    }

    @nonobjc final class var grpBaseOrange350: UIColor {
        Colors.baseOrange350.uiColor
    }

    @nonobjc final class var grpBaseOrange400: UIColor {
        Colors.baseOrange400.uiColor
    }

    @nonobjc final class var grpBaseOrange450: UIColor {
        Colors.baseOrange450.uiColor
    }

    @nonobjc final class var grpBaseOrange500: UIColor {
        Colors.baseOrange500.uiColor
    }

    @nonobjc final class var grpBaseOrange550: UIColor {
        Colors.baseOrange550.uiColor
    }

    @nonobjc final class var grpBaseOrange600: UIColor {
        Colors.baseOrange600.uiColor
    }

    @nonobjc final class var grpBaseRed300: UIColor {
        Colors.baseRed300.uiColor
    }

    @nonobjc final class var grpBaseRed350: UIColor {
        Colors.baseRed350.uiColor
    }

    @nonobjc final class var grpBaseRed400: UIColor {
        Colors.baseRed400.uiColor
    }

    @nonobjc final class var grpBaseRed450: UIColor {
        Colors.baseRed450.uiColor
    }

    @nonobjc final class var grpBaseRed500: UIColor {
        Colors.baseRed500.uiColor
    }

    @nonobjc final class var grpBaseRed550: UIColor {
        Colors.baseRed550.uiColor
    }

    @nonobjc final class var grpBaseRed600: UIColor {
        Colors.baseRed600.uiColor
    }

    @nonobjc final class var grpBaseYellow300: UIColor {
        Colors.baseYellow300.uiColor
    }

    @nonobjc final class var grpBaseYellow350: UIColor {
        Colors.baseYellow350.uiColor
    }

    @nonobjc final class var grpBaseYellow400: UIColor {
        Colors.baseYellow400.uiColor
    }

    @nonobjc final class var grpBaseYellow450: UIColor {
        Colors.baseYellow450.uiColor
    }

    @nonobjc final class var grpBaseYellow500: UIColor {
        Colors.baseYellow500.uiColor
    }

    @nonobjc final class var grpBaseYellow550: UIColor {
        Colors.baseYellow550.uiColor
    }

    @nonobjc final class var grpBaseYellow600: UIColor {
        Colors.baseYellow600.uiColor
    }

    @nonobjc final class var grpBorderPrimary: UIColor {
        Colors.borderPrimary.uiColor
    }

    @nonobjc final class var grpBorderSecondary: UIColor {
        Colors.borderSecondary.uiColor
    }

    @nonobjc final class var grpEventAgentFee: UIColor {
        Colors.eventAgentFee.uiColor
    }

    @nonobjc final class var grpEventDividends: UIColor {
        Colors.eventDividends.uiColor
    }

    @nonobjc final class var grpEventEstimate: UIColor {
        Colors.eventEstimate.uiColor
    }

    @nonobjc final class var grpEventEstimateMuted: UIColor {
        Colors.eventEstimateMuted.uiColor
    }

    @nonobjc final class var grpEventExpense: UIColor {
        Colors.eventExpense.uiColor
    }

    @nonobjc final class var grpEventExpenseMuted: UIColor {
        Colors.eventExpenseMuted.uiColor
    }

    @nonobjc final class var grpEventIncome: UIColor {
        Colors.eventIncome.uiColor
    }

    @nonobjc final class var grpEventMarkup: UIColor {
        Colors.eventMarkup.uiColor
    }

    @nonobjc final class var grpEventPaymentOwn: UIColor {
        Colors.eventPaymentOwn.uiColor
    }

    @nonobjc final class var grpEventPaymentWorking: UIColor {
        Colors.eventPaymentWorking.uiColor
    }

    @nonobjc final class var grpFocusRing: UIColor {
        Colors.focusRing.uiColor
    }

    @nonobjc final class var grpHighlightCalendar: UIColor {
        Colors.highlightCalendar.uiColor
    }

    @nonobjc final class var grpHighlightText: UIColor {
        Colors.highlightText.uiColor
    }

    @nonobjc final class var grpHighlighter: UIColor {
        Colors.highlighter.uiColor
    }

    @nonobjc final class var grpOnAccentPrimary: UIColor {
        Colors.onAccentPrimary.uiColor
    }

    @nonobjc final class var grpOnAccentSecondary: UIColor {
        Colors.onAccentSecondary.uiColor
    }

    @nonobjc final class var grpOnAccentTertiary: UIColor {
        Colors.onAccentTertiary.uiColor
    }

    @nonobjc final class var grpOverlay: UIColor {
        Colors.overlay.uiColor
    }

    @nonobjc final class var grpShadowBase: UIColor {
        Colors.shadowBase.uiColor
    }

    @nonobjc final class var grpShadowStroke: UIColor {
        Colors.shadowStroke.uiColor
    }

    @nonobjc final class var grpShadowStrokeLight: UIColor {
        Colors.shadowStrokeLight.uiColor
    }

    @nonobjc final class var grpStateDisabled: UIColor {
        Colors.stateDisabled.uiColor
    }

    @nonobjc final class var grpStateHover: UIColor {
        Colors.stateHover.uiColor
    }

    @nonobjc final class var grpStateOnAccentHover: UIColor {
        Colors.stateOnAccentHover.uiColor
    }

    @nonobjc final class var grpStateOnAccentPressed: UIColor {
        Colors.stateOnAccentPressed.uiColor
    }

    @nonobjc final class var grpStatePressed: UIColor {
        Colors.statePressed.uiColor
    }

    @nonobjc final class var grpStateSelected: UIColor {
        Colors.stateSelected.uiColor
    }

    @nonobjc final class var grpStaticBlack: UIColor {
        Colors.staticBlack.uiColor
    }

    @nonobjc final class var grpStaticWhite: UIColor {
        Colors.staticWhite.uiColor
    }

    @nonobjc final class var grpStatusError: UIColor {
        Colors.statusError.uiColor
    }

    @nonobjc final class var grpStatusSuccess: UIColor {
        Colors.statusSuccess.uiColor
    }

    @nonobjc final class var grpStatusWarning: UIColor {
        Colors.statusWarning.uiColor
    }

    @nonobjc final class var grpSurface0: UIColor {
        Colors.surface0.uiColor
    }

    @nonobjc final class var grpSurface1: UIColor {
        Colors.surface1.uiColor
    }

    @nonobjc final class var grpSurface2: UIColor {
        Colors.surface2.uiColor
    }

    @nonobjc final class var grpSurface3: UIColor {
        Colors.surface3.uiColor
    }

    @nonobjc final class var grpSurfaceInverse: UIColor {
        Colors.surfaceInverse.uiColor
    }

    @nonobjc final class var grpTextPrimary: UIColor {
        Colors.textPrimary.uiColor
    }

    @nonobjc final class var grpTextQuaternary: UIColor {
        Colors.textQuaternary.uiColor
    }

    @nonobjc final class var grpTextSecondary: UIColor {
        Colors.textSecondary.uiColor
    }

    @nonobjc final class var grpTextTertiary: UIColor {
        Colors.textTertiary.uiColor
    }

    @nonobjc final class var grpToast: UIColor {
        Colors.toast.uiColor
    }
}
#endif
