import { locales, type Locale } from '@/i18n';

export function getTranslatedField<T extends Record<string, any>>(
  item: T,
  fieldName: keyof T,
  locale: string
): string {
  // First try to get from translations object
  const translationsField = `${String(fieldName)}Translations` as keyof T;
  if (item[translationsField]) {
    const translations = item[translationsField] as any;
    if (translations[locale]) {
      return translations[locale];
    }
  }
  
  // Fall back to main field
  return item[fieldName] as string || '';
}

export function getLocalizedProduct(product: any, locale: string) {
  return {
    ...product,
    name: getTranslatedField(product, 'name', locale),
    description: getTranslatedField(product, 'description', locale),
  };
}

export function getLocalizedCategory(category: any, locale: string) {
  return {
    ...category,
    name: getTranslatedField(category, 'name', locale),
    description: getTranslatedField(category, 'description', locale),
  };
}

export function getLocalizedSubcategory(subcategory: any, locale: string) {
  return {
    ...subcategory,
    name: getTranslatedField(subcategory, 'name', locale),
  };
}