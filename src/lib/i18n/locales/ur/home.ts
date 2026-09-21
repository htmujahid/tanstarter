import type { HomeTranslations } from '#/lib/i18n/locales/types'

export const home: HomeTranslations = {
  dashboard: {
    stats: {
      notes: 'نوٹس',
      apiKeys: 'اے پی آئی کیز',
    },
  },
  apiKeys: {
    createButton: 'کلید بنائیں',
    table: {
      nameColumn: 'نام',
      keyColumn: 'کلید',
      createdColumn: 'تخلیق',
      expiresColumn: 'میعاد ختم',
      lastUsedColumn: 'آخری استعمال',
      never: 'کبھی نہیں',
      untitledKey: 'بلا عنوان کلید',
      disabledBadge: 'غیر فعال',
      deleteTooltip: 'کلید حذف کریں',
      deleteError: 'API کلید حذف نہیں ہو سکی',
    },
    empty: {
      title: 'ابھی تک کوئی API کلید نہیں',
      description: 'پروگرام کے ذریعے API تک رسائی کے لیے ایک کلید بنائیں۔',
    },
    createForm: {
      title: 'API کلید بنائیں',
      nameLabel: 'نام',
      namePlaceholder: 'مثال کے طور پر CI pipeline',
      nameRequired: 'نام درکار ہے',
      expirationLabel: 'میعاد',
      expirationNever: 'کبھی نہیں',
      expiration30Days: '30 دن',
      expiration90Days: '90 دن',
      expiration1Year: '1 سال',
      submit: 'کلید بنائیں',
      genericError: 'API کلید نہیں بن سکی',
    },
    revealModal: {
      title: 'API کلید بن گئی',
      description:
        'ابھی یہ کلید کاپی کر لیں — آپ اسے دوبارہ نہیں دیکھ سکیں گے۔',
      copyTooltip: 'کاپی کریں',
      copiedTooltip: 'کاپی ہو گئی',
      done: 'مکمل',
    },
  },
  notes: {
    searchPlaceholder: 'عنوان سے تلاش کریں',
    addButton: 'نوٹ شامل کریں',
    backToNotes: 'نوٹس پر واپس جائیں',
    notFound: {
      title: 'نوٹ نہیں ملا',
      description: 'یہ نوٹ حذف کر دیا گیا ہو گا، یا لنک اب درست نہیں ہے۔',
    },
    form: {
      titleLabel: 'عنوان',
      titlePlaceholder: 'نوٹ کا عنوان',
      titleRequired: 'عنوان درکار ہے',
      bodyLabel: 'تفصیل',
      bodyPlaceholder: 'اختیاری',
    },
    createForm: {
      title: 'نوٹ شامل کریں',
      submit: 'نوٹ بنائیں',
      genericError: 'نوٹ نہیں بن سکا',
    },
    detailsForm: {
      title: 'نوٹ کی تفصیلات',
      subtitle: 'اس نوٹ کا عنوان اور تفصیل اپ ڈیٹ کریں۔',
      updateSuccess: 'نوٹ کامیابی سے اپ ڈیٹ ہو گیا',
      submit: 'تبدیلیاں محفوظ کریں',
      genericError: 'نوٹ اپ ڈیٹ نہیں ہو سکا',
    },
    actions: {
      deleteButton: 'حذف کریں',
    },
    bulkActions: {
      deleteButton: 'حذف کریں',
      notesCount: '{{count}} نوٹس',
    },
    table: {
      selectAllAria: 'تمام نوٹس منتخب کریں',
      selectRowAria: '{{title}} منتخب کریں',
      titleColumn: 'عنوان',
      createdColumn: 'تخلیق',
      updatedColumn: 'تازہ کاری',
      searchEmptyTitle: 'کوئی نوٹ نہیں ملا',
      searchEmptyDescription:
        'جو آپ تلاش کر رہے ہیں اسے ڈھونڈنے کے لیے اپنی تلاش میں تبدیلی کریں۔',
      emptyTitle: 'ابھی تک کوئی نوٹ نہیں',
      emptyDescription: 'اپنا پہلا نوٹ شامل کر کے آغاز کریں۔',
    },
  },
  sidebar: {
    dashboard: 'ڈیش بورڈ',
    notes: 'نوٹس',
    analytics: {
      label: 'اینالیٹکس',
      reports: 'رپورٹس',
      liveView: 'لائیو ویو',
    },
    settings: {
      label: 'ترتیبات',
      general: 'عمومی',
      notifications: 'اطلاعات',
      security: 'سیکیورٹی',
      members: 'اراکین',
    },
  },
}
