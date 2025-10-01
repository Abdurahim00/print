import { getRequestConfig } from 'next-intl/server';
import { locales } from './config';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    locale = 'en'; // Default to English if locale is not valid
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});