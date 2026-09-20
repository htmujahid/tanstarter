import type { CommonTranslations } from '#/lib/i18n/locales/types'

export const common: CommonTranslations = {
  app: {
    name: 'Commerce',
  },
  actions: {
    getStarted: 'Get started',
    signOut: 'Sign out',
    signIn: 'Sign in',
    stopImpersonating: 'Stop impersonating',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    update: 'Update',
    confirm: 'Confirm',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    submit: 'Submit',
    search: 'Search',
    filter: 'Filter',
    clear: 'Clear',
    retry: 'Retry',
    copy: 'Copy',
    copied: 'Copied',
    view: 'View',
    viewAll: 'View all',
    loading: 'Loading...',
    apply: 'Apply',
    reset: 'Reset',
    refresh: 'Refresh',
    download: 'Download',
    upload: 'Upload',
  },
  nav: {
    home: 'Home',
    profile: 'Profile',
    apiKeys: 'API Keys',
    adminPanel: 'Admin panel',
  },
  notFound: {
    title: '404 - Page Not Found',
    description: "The page you're looking for doesn't exist.",
  },
  impersonation: {
    viewingAs: 'Viewing as {{name}}',
  },
  locale: {
    label: 'Language',
  },
  table: {
    noResults: 'No results found.',
    rowsSelected: '{{count}} selected',
    selectAll: 'Select all',
    clearSelection: 'Clear selection',
    page: 'Page',
    of: 'of',
    rowsPerPage: 'Rows per page',
    previous: 'Previous',
    nextPage: 'Next',
  },
  confirmDelete: {
    title: 'Delete {{item}}?',
    description: 'This action cannot be undone.',
  },
  messages: {
    somethingWentWrong: 'Something went wrong. Please try again.',
    unauthorized: "You don't have permission to do that.",
    forbidden: 'This action is forbidden.',
    requiredField: 'This field is required',
    invalidEmail: 'Enter a valid email address',
  },
  features: {
    trust: {
      title: 'Trusted by customers',
      description: 'Secure sign-in and protected accounts for every shopper.',
    },
    speed: {
      title: 'Blazing fast, everywhere',
      description: 'Pages load instantly for every customer, on any device.',
    },
    design: {
      title: 'Looks great, day or night',
      description: 'A clean storefront that adapts to light and dark mode.',
    },
  },
  sidebar: {
    collapse: 'Collapse sidebar',
    expand: 'Expand sidebar',
    close: 'Close sidebar',
    backToStore: 'Back to store',
  },
  statCard: {
    vsLastPeriod: 'vs last period',
  },
}
