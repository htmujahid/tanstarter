import type { HomeTranslations } from '#/lib/i18n/locales/types'

export const home: HomeTranslations = {
  dashboard: {
    revenueCard: {
      title: 'آمدنی',
      subtitle: 'پچھلے 14 دن',
    },
    categoryCard: {
      title: 'زمرے کے لحاظ سے فروخت',
      subtitle: 'کل آرڈرز کا حصہ',
    },
    topProductsCard: {
      title: 'سرِفہرست مصنوعات',
      subtitle: 'آمدنی کے لحاظ سے، پچھلے 14 دن',
    },
    recentOrdersCard: {
      title: 'حالیہ آرڈرز',
      subtitle: 'آپ کے اسٹور کی تازہ ترین سرگرمی',
      orderColumn: 'آرڈر',
      customerColumn: 'کسٹمر',
      statusColumn: 'حیثیت',
      amountColumn: 'رقم',
    },
    stats: {
      totalRevenue: 'کل آمدنی',
      orders: 'آرڈرز',
      newCustomers: 'نئے کسٹمرز',
      conversionRate: 'تبدیلی کی شرح',
    },
    orderStatus: {
      fulfilled: 'مکمل',
      processing: 'زیر عمل',
      pending: 'زیر التوا',
      refunded: 'رقم واپس',
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
      description: 'ابھی یہ کلید کاپی کر لیں — آپ اسے دوبارہ نہیں دیکھ سکیں گے۔',
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
    orders: {
      label: 'آرڈرز',
      allOrders: 'تمام آرڈرز',
      drafts: 'ڈرافٹس',
      abandonedCheckouts: 'چھوڑے گئے چیک آؤٹس',
    },
    products: {
      label: 'مصنوعات',
      allProducts: 'تمام مصنوعات',
      collections: 'کلیکشنز',
      inventory: 'انوینٹری',
      categories: 'زمرہ جات',
    },
    customers: {
      label: 'کسٹمرز',
      allCustomers: 'تمام کسٹمرز',
      segments: 'سیگمنٹس',
    },
    marketing: {
      label: 'مارکیٹنگ',
      discounts: 'رعایتیں',
      campaigns: 'مہمات',
    },
    analytics: {
      label: 'اینالیٹکس',
      reports: 'رپورٹس',
      liveView: 'لائیو ویو',
    },
    settings: {
      label: 'ترتیبات',
      general: 'عمومی',
      payments: 'ادائیگیاں',
      shipping: 'ترسیل',
      teamPermissions: 'ٹیم اور اجازتیں',
      domains: 'ڈومینز',
    },
  },
}
