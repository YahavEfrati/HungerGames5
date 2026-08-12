import { StyleSheet } from 'react-native';

export const createStyles = (colors) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  textContainer: {
    flex: 1,
    paddingRight: 12,
    justifyContent: 'center',
  },
  restaurantNameContainer: {
    marginBottom: 4,
  },
  offeredByText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  restaurantNameText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.background, // fallback background
  },
  productImage: {
    width: '100%',
    height: '100%',
  }
});
