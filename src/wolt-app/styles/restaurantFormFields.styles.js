import { StyleSheet } from 'react-native';

export const createStyles = (colors) =>
    StyleSheet.create({
        container: {
            gap: 16,
            paddingVertical: 8,
        },
        fieldGroup: {
            gap: 6,
        },
        label: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.text,
        },
        requiredStar: {
            color: colors.error,
        },
        input: {
            backgroundColor: colors.inputBg,
            color: colors.inputText,
            borderRadius: 12,
            paddingHorizontal: 14,
            paddingVertical: 12,
            fontSize: 15,
            borderWidth: 1,
            borderColor: colors.inputBorder,
        },
        multilineInput: {
            minHeight: 80,
            textAlignVertical: 'top',
        },
        row: {
            flexDirection: 'row',
            gap: 12,
        },
        flex1: {
            flex: 1,
        },
        imagePickerBox: {
            height: 150,
            borderRadius: 14,
            backgroundColor: colors.inputBg,
            borderWidth: 1.5,
            borderColor: colors.inputBorder,
            borderStyle: 'dashed',
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 4,
        },
        imagePreview: {
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
        },
        placeholderContent: {
            alignItems: 'center',
            gap: 6,
        },
        placeholderIcon: {
            fontSize: 32,
        },
        placeholderText: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.primary,
        },
        changeOverlay: {
            position: 'absolute',
            bottom: 8,
            right: 8,
            backgroundColor: 'rgba(0,0,0,0.65)',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 14,
        },
        changeOverlayText: {
            color: '#ffffff',
            fontSize: 12,
            fontWeight: '600',
        },
        switchRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: colors.inputBg,
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.inputBorder,
        },
        switchLabelContainer: {
            flex: 1,
            paddingRight: 12,
        },
        switchSublabel: {
            fontSize: 12,
            color: colors.textSecondary,
            marginTop: 2,
        },
        categoriesContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
            marginTop: 6,
        },
        categoryChip: {
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 20,
            backgroundColor: colors.inputBg,
            borderWidth: 1,
            borderColor: colors.inputBorder,
        },
        categoryChipSelected: {
            backgroundColor: colors.primary,
            borderColor: colors.primary,
        },
        categoryText: {
            fontSize: 13,
            fontWeight: '600',
            color: colors.textSecondary,
        },
        categoryTextSelected: {
            color: '#ffffff',
        },
        loadingText: {
            fontSize: 13,
            color: colors.textSecondary,
            fontStyle: 'italic',
        },
    });
