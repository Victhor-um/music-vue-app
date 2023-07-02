import { createI18n } from 'vue-i18n'
import en from '@/locals/en.json'
import ru from '@/locals/ru.json'

export default createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    ru
  },
  numberFormats: {
    en: {
      currency: {
        style: 'currency',
        currency: 'USD'
      }
    },
    ru: {
      currency: {
        style: 'currency',
        currency: 'RUB'
      }
    }
  }
})
