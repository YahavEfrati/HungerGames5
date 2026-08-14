import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../constants/theme';
import LargeRestaurantCard from './LargeRestaurantCard';
import { createStyles } from '../styles/ownerRestaurantCard.styles';

/**
 * Mobile Owner Restaurant Card component.
 * Wraps and reuses the LargeRestaurantCard component and appends owner management controls.
 */
export default function OwnerRestaurantCard({ restaurant, onEditPress }) {
    const { colors } = useTheme();
    const styles = createStyles(colors);

    const { phone, working_hours, kosher } = restaurant;

    return (
        <View style={styles.container}>
            {/* Kosher Badge Overlay */}
            {kosher && (
                <View style={styles.badgeRow}>
                    <View style={styles.kosherBadge}>
                        <Text style={styles.kosherText}>Kosher</Text>
                    </View>
                </View>
            )}

            {/* Base Reused LargeRestaurantCard */}
            <LargeRestaurantCard {...restaurant} />

            {/* Owner Metadata & Edit Action Controls */}
            <View style={styles.ownerControls}>
                <View style={styles.infoRow}>
                    {phone ? <Text style={styles.infoText}>📞 {phone}</Text> : null}
                    {working_hours ? <Text style={styles.infoText}>🕒 {working_hours}</Text> : null}
                </View>

                <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => onEditPress(restaurant)}
                    activeOpacity={0.8}
                >
                    <Text style={styles.editBtnText}>✏️ Edit Restaurant Details</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
