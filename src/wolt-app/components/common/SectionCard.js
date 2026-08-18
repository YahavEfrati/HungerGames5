import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../constants/theme';
import { createCheckoutStyles } from '../../styles/checkout.styles';

/**
 * SectionCard Component
 * Reusable container providing a standard section header (title + optional right action)
 * and card wrapper for children content.
 * 
 * @param {Object} props
 * @param {string} [props.title] - Header title for the section.
 * @param {React.ReactNode} [props.rightAction] - Optional action element on the right of the header.
 * @param {React.ReactNode} props.children - Content rendered within the card body.
 * @param {Object} [props.styles] - Optional pre-created style object.
 * @param {Object} [props.containerStyle] - Optional custom container style.
 * @param {Object} [props.cardStyle] - Optional custom card style.
 */
export default function SectionCard({
    title,
    rightAction,
    children,
    styles: customStyles,
    containerStyle,
    cardStyle,
}) {
    const { colors } = useTheme();
    const defaultStyles = createCheckoutStyles(colors);
    const styles = customStyles || defaultStyles;

    return (
        <View style={[styles.section, containerStyle]}>
            {(title || rightAction) && (
                <View style={styles.sectionHeader}>
                    {title ? (
                        <Text style={styles.sectionTitle}>{title}</Text>
                    ) : (
                        <View />
                    )}
                    {rightAction || null}
                </View>
            )}
            <View style={[styles.card, cardStyle]}>
                {children}
            </View>
        </View>
    );
}
