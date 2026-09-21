import type { CommonTranslations } from '#/lib/i18n/locales/types'

export const common: CommonTranslations = {
  app: {
    name: 'Starter Kit',
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
  error: {
    title: 'Something went wrong',
    description: 'An unexpected error occurred. Please try again.',
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
      title: 'Secure by default',
      description:
        'Secure sign-in and protected accounts, with role-based permissions out of the box.',
    },
    speed: {
      title: 'Blazing fast, everywhere',
      description: 'Pages load instantly for every user, on any device.',
    },
    design: {
      title: 'Looks great, day or night',
      description: 'A clean interface that adapts to light and dark mode.',
    },
  },
  sidebar: {
    collapse: 'Collapse sidebar',
    expand: 'Expand sidebar',
    close: 'Close sidebar',
    backToHome: 'Back to home',
  },
  statCard: {
    vsLastPeriod: 'vs last period',
  },
  offline: {
    label: 'Offline',
    title: "You're offline",
    description:
      "This page hasn't been loaded before, so it isn't available offline. Reconnect and try again.",
  },
}
