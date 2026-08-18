import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

const TIP_OPTIONS = [
    { label: '₪0', value: 0 },
    { label: '₪5', value: 5 },
    { label: '₪10', value: 10 },
    { label: '₪15', value: 15 },
];

/**
 * CourierTipCard Component (Body content for Courier tip SectionCard)
 */
export default function CourierTipCard({
    tip,
    isCustomTipMode,
    onTipSelect,
    onEnableCustomTip,
    onCustomTipChange,
    onIncrementTip,
    onDecrementTip,
    styles,
}) {
    return (
        <View>
            <Text style={styles.tipDescription}>
                The courier will receive 100% of your tip directly.
            </Text>
            <View style={styles.tipOptionsRow}>
                {TIP_OPTIONS.map((opt) => (
                    <TouchableOpacity
                        key={opt.value}
                        style={[
                            styles.tipPill,
                            tip === opt.value && !isCustomTipMode
                                ? styles.tipPillActive
                                : null,
                        ]}
                        onPress={() => onTipSelect(opt.value)}
                        activeOpacity={0.7}
                    >
                        <Text
                            style={[
                                styles.tipPillText,
                                tip === opt.value && !isCustomTipMode
                                    ? styles.tipPillTextActive
                                    : null,
                            ]}
                        >
                            {opt.label}
                        </Text>
                    </TouchableOpacity>
                ))}
                <TouchableOpacity
                    style={[
                        styles.tipPill,
                        isCustomTipMode ? styles.tipPillActive : null,
                    ]}
                    onPress={onEnableCustomTip}
                    activeOpacity={0.7}
                >
                    <Text
                        style={[
                            styles.tipPillText,
                            isCustomTipMode ? styles.tipPillTextActive : null,
                        ]}
                    >
                        Other
                    </Text>
                </TouchableOpacity>
            </View>

            {isCustomTipMode && (
                <View style={styles.customTipBar}>
                    <TouchableOpacity
                        style={styles.customTipBtn}
                        onPress={onDecrementTip}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.customTipBtnText}>−</Text>
                    </TouchableOpacity>
                    <View style={styles.customTipInputWrapper}>
                        <TextInput
                            style={styles.customTipInput}
                            value={String(tip)}
                            onChangeText={onCustomTipChange}
                            keyboardType="numeric"
                            selectTextOnFocus
                        />
                        <Text style={styles.currencySymbol}>₪</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.customTipBtn}
                        onPress={onIncrementTip}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.customTipBtnText}>+</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}
