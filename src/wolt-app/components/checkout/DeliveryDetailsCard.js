import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

/**
 * DeliveryDetailsCard Component (Body content for Delivery details SectionCard)
 */
export default function DeliveryDetailsCard({
    deliveryX,
    deliveryY,
    formattedX,
    formattedY,
    coordErrors,
    isEditingAddress,
    hasCoordinateErrors,
    onLatitudeChange,
    onLongitudeChange,
    onConfirmAddress,
    colors,
    styles,
}) {
    if (!isEditingAddress) {
        return (
            <View style={styles.coordinatesRow}>
                <View>
                    <Text style={styles.coordinateLabel}>Coordinates</Text>
                    <Text style={styles.coordinateValue}>
                        Latitude (X): {formattedX}, Longitude (Y): {formattedY}
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.editAddressContainer}>
            <View style={styles.inputsRow}>
                <View style={styles.inputColumn}>
                    <Text style={styles.inputLabel}>Latitude (-90 to 90)</Text>
                    <TextInput
                        style={[
                            styles.input,
                            coordErrors.x ? styles.inputError : null,
                        ]}
                        value={deliveryX}
                        onChangeText={onLatitudeChange}
                        keyboardType="numeric"
                        placeholder="32.0853"
                        placeholderTextColor={colors.inputPlaceholder}
                    />
                    {coordErrors.x ? (
                        <Text style={styles.fieldErrorText}>{coordErrors.x}</Text>
                    ) : null}
                </View>
                <View style={styles.inputColumn}>
                    <Text style={styles.inputLabel}>Longitude (-180 to 180)</Text>
                    <TextInput
                        style={[
                            styles.input,
                            coordErrors.y ? styles.inputError : null,
                        ]}
                        value={deliveryY}
                        onChangeText={onLongitudeChange}
                        keyboardType="numeric"
                        placeholder="34.7818"
                        placeholderTextColor={colors.inputPlaceholder}
                    />
                    {coordErrors.y ? (
                        <Text style={styles.fieldErrorText}>{coordErrors.y}</Text>
                    ) : null}
                </View>
            </View>
            <TouchableOpacity
                style={[
                    styles.confirmAddressBtn,
                    hasCoordinateErrors ? styles.confirmAddressBtnDisabled : null,
                ]}
                onPress={onConfirmAddress}
                disabled={hasCoordinateErrors}
                activeOpacity={0.8}
            >
                <Text style={styles.confirmAddressBtnText}>Confirm Coordinates</Text>
            </TouchableOpacity>
        </View>
    );
}
