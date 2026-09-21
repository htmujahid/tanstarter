// Single source of truth for every translation namespace's shape. Each
// locale (en/, ur/) only supplies values against these interfaces — add or
// change a key here first, then update every locale's file for that
// namespace; TypeScript will flag any locale left out of sync.

export interface CommonTranslations {
  app: {
    name: string
  }
  actions: {
    getStarted: string
    signOut: string
    signIn: string
    stopImpersonating: string
    save: string
    cancel: string
    delete: string
    edit: string
    create: string
    update: string
    confirm: string
    close: string
    back: string
    next: string
    submit: string
    search: string
    filter: string
    clear: string
    retry: string
    copy: string
    copied: string
    view: string
    viewAll: string
    loading: string
    apply: string
    reset: string
    refresh: string
    download: string
    upload: string
  }
  nav: {
    home: string
    profile: string
    apiKeys: string
    adminPanel: string
  }
  notFound: {
    title: string
    description: string
  }
  // Shown by the root and section-level `errorComponent`s when a loader or
  // render throws; kept generic since the underlying error is unpredictable.
  error: {
    title: string
    description: string
  }
  impersonation: {
    viewingAs: string
  }
  locale: {
    label: string
  }
  table: {
    noResults: string
    rowsSelected: string
    selectAll: string
    clearSelection: string
    page: string
    of: string
    rowsPerPage: string
    previous: string
    nextPage: string
  }
  confirmDelete: {
    title: string
    description: string
  }
  messages: {
    somethingWentWrong: string
    unauthorized: string
    forbidden: string
    requiredField: string
    invalidEmail: string
  }
  // Keyed by the `id` exported from src/lib/features.ts; shown on both the
  // public landing page and the /auth layout's marketing panel.
  features: {
    trust: { title: string; description: string }
    speed: { title: string; description: string }
    design: { title: string; description: string }
  }
  // Chrome shared by the /home and /admin collapsible sidebars.
  sidebar: {
    collapse: string
    expand: string
    close: string
    backToStore: string
  }
  statCard: {
    vsLastPeriod: string
  }
  // Header badge shown when the browser reports it has no network connection.
  offline: {
    label: string
    title: string
    description: string
  }
}

export interface AuthTranslations {
  layout: {
    title: string
    subtitle: string
    copyright: string
  }
  signIn: {
    title: string
    subtitle: string
    identifierLabel: string
    identifierPlaceholder: string
    identifierRequired: string
    passwordLabel: string
    passwordPlaceholder: string
    passwordRequired: string
    submit: string
    genericError: string
  }
  setup: {
    title: string
    subtitle: string
    nameLabel: string
    namePlaceholder: string
    nameRequired: string
    emailLabel: string
    emailPlaceholder: string
    emailRequired: string
    passwordLabel: string
    passwordPlaceholder: string
    passwordTooShort: string
    confirmPasswordLabel: string
    confirmPasswordPlaceholder: string
    confirmPasswordRequired: string
    passwordMismatch: string
    submit: string
    genericError: string
  }
  passkey: {
    divider: string
    submit: string
    genericError: string
  }
}

export interface SiteTranslations {
  landing: {
    badge: string
    heroTitle: string
    heroHighlight: string
    subtitle: string
    getHelp: string
    announcementsLink: string
    contactLink: string
  }
  help: {
    title: string
    subtitle: string
    faqs: Array<{ question: string; answer: string }>
    support: {
      prompt: string
      contactLink: string
      orHeadBack: string
      homeLink: string
      end: string
    }
  }
  contact: {
    title: string
    subtitle: string
    helpPrompt: string
    helpLink: string
    helpEnd: string
    nameLabel: string
    namePlaceholder: string
    nameRequired: string
    emailLabel: string
    emailPlaceholder: string
    emailRequired: string
    messageLabel: string
    messagePlaceholder: string
    messageRequired: string
    submit: string
    genericError: string
    successTitle: string
    successDescription: string
    sendAnother: string
  }
  announcements: {
    title: string
    subtitle: string
    backLink: string
    notFound: {
      title: string
      description: string
    }
    emptyState: {
      title: string
      description: string
    }
  }
  feedback: {
    title: string
    subtitle: string
    sendFeedback: string
    backLink: string
    categoryLabel: string
    categories: {
      bug: string
      feature: string
      general: string
    }
    statuses: {
      new: string
      reviewed: string
      resolved: string
    }
    messageLabel: string
    messagePlaceholder: string
    messageRequired: string
    genericError: string
    submittedAt: string
    notFound: {
      title: string
      description: string
    }
    emptyState: {
      title: string
      description: string
    }
  }
}

export interface HomeTranslations {
  dashboard: {
    revenueCard: {
      title: string
      subtitle: string
    }
    categoryCard: {
      title: string
      subtitle: string
    }
    topProductsCard: {
      title: string
      subtitle: string
    }
    recentOrdersCard: {
      title: string
      subtitle: string
      orderColumn: string
      customerColumn: string
      statusColumn: string
      amountColumn: string
    }
    stats: {
      totalRevenue: string
      orders: string
      newCustomers: string
      conversionRate: string
    }
    orderStatus: {
      fulfilled: string
      processing: string
      pending: string
      refunded: string
    }
  }
  apiKeys: {
    createButton: string
    table: {
      nameColumn: string
      keyColumn: string
      createdColumn: string
      expiresColumn: string
      lastUsedColumn: string
      never: string
      untitledKey: string
      disabledBadge: string
      deleteTooltip: string
      deleteError: string
    }
    empty: {
      title: string
      description: string
    }
    createForm: {
      title: string
      nameLabel: string
      namePlaceholder: string
      nameRequired: string
      expirationLabel: string
      expirationNever: string
      expiration30Days: string
      expiration90Days: string
      expiration1Year: string
      submit: string
      genericError: string
    }
    revealModal: {
      title: string
      description: string
      copyTooltip: string
      copiedTooltip: string
      done: string
    }
  }
  notes: {
    searchPlaceholder: string
    addButton: string
    backToNotes: string
    notFound: {
      title: string
      description: string
    }
    form: {
      titleLabel: string
      titlePlaceholder: string
      titleRequired: string
      bodyLabel: string
      bodyPlaceholder: string
    }
    createForm: {
      title: string
      submit: string
      genericError: string
    }
    detailsForm: {
      title: string
      subtitle: string
      updateSuccess: string
      submit: string
      genericError: string
    }
    actions: {
      deleteButton: string
    }
    bulkActions: {
      deleteButton: string
      notesCount: string
    }
    table: {
      selectAllAria: string
      selectRowAria: string
      titleColumn: string
      createdColumn: string
      updatedColumn: string
      searchEmptyTitle: string
      searchEmptyDescription: string
      emptyTitle: string
      emptyDescription: string
    }
  }
  sidebar: {
    dashboard: string
    notes: string
    orders: {
      label: string
      allOrders: string
      drafts: string
      abandonedCheckouts: string
    }
    products: {
      label: string
      allProducts: string
      collections: string
      inventory: string
      categories: string
    }
    customers: {
      label: string
      allCustomers: string
      segments: string
    }
    marketing: {
      label: string
      discounts: string
      campaigns: string
    }
    analytics: {
      label: string
      reports: string
      liveView: string
    }
    settings: {
      label: string
      general: string
      payments: string
      shipping: string
      teamPermissions: string
      domains: string
    }
  }
}

export interface ProfileTranslations {
  profileForm: {
    title: string
    subtitle: string
    successMessage: string
    genericError: string
    nameLabel: string
    namePlaceholder: string
    nameRequired: string
    usernameLabel: string
    usernameDescription: string
    usernamePlaceholder: string
    usernameRequired: string
    usernameTooShort: string
    usernameTooLong: string
    usernameInvalid: string
    submit: string
  }
  changePasswordForm: {
    title: string
    subtitle: string
    successMessage: string
    genericError: string
    passwordMismatch: string
    currentPasswordLabel: string
    currentPasswordRequired: string
    newPasswordLabel: string
    newPasswordPlaceholder: string
    newPasswordTooShort: string
    confirmPasswordLabel: string
    confirmPasswordPlaceholder: string
    confirmPasswordRequired: string
    revokeOtherSessionsLabel: string
    submit: string
  }
  passkeys: {
    title: string
    subtitle: string
    addButton: string
    addError: string
    deleteError: string
    emptyState: string
    nameColumn: string
    typeColumn: string
    addedColumn: string
    defaultName: string
    synced: string
    deviceOnly: string
    removeTooltip: string
    modalTitle: string
    modalDescription: string
    nameFieldLabel: string
    nameFieldPlaceholder: string
    continue: string
  }
  sessions: {
    title: string
    subtitle: string
    signOutOthers: string
    revokeError: string
    revokeOthersError: string
    emptyState: string
    deviceColumn: string
    ipColumn: string
    expiresColumn: string
    currentSession: string
    unknownIp: string
    revokeTooltip: string
    unknownDevice: string
    unknownBrowser: string
    unknownOs: string
    deviceOn: string
  }
}

export interface AdminTranslations {
  sidebar: {
    brand: string
    overview: string
    users: string
    communications: string
    announcements: string
    feedback: string
    contactSubmissions: string
  }
  overview: {
    statTotalUsers: string
    statAdmins: string
    statBanned: string
    manageUsersTitle: string
    manageUsersDescription: string
    goToUsers: string
  }
  announcements: {
    addAnnouncement: string
    searchPlaceholder: string
    statusFilterPlaceholder: string
    statusPublished: string
    statusDraft: string
    backToList: string
    notFoundTitle: string
    notFoundDescription: string
    fields: {
      titleLabel: string
      titlePlaceholder: string
      titleRequired: string
      bodyLabel: string
      bodyPlaceholder: string
      publishedDescription: string
    }
    table: {
      selectAllAria: string
      selectRowAria: string
      titleColumn: string
      statusColumn: string
      createdColumn: string
      updatedColumn: string
      emptyTitle: string
      emptyTitleFiltered: string
      emptyDescription: string
      emptyDescriptionFiltered: string
      clearFilters: string
    }
    detail: {
      title: string
      description: string
      updateSuccess: string
      updateError: string
      saveButton: string
    }
    createForm: {
      submitButton: string
      createError: string
    }
    deleteModal: {
      title: string
      titleBulk: string
      confirmPrefix: string
      confirmSuffix: string
      itemsCount: string
    }
  }
  contacts: {
    searchPlaceholder: string
    backToList: string
    notFoundTitle: string
    notFoundDescription: string
    table: {
      selectAllAria: string
      selectRowAria: string
      nameColumn: string
      messageColumn: string
      submittedColumn: string
      emptyTitle: string
      emptyTitleFiltered: string
      emptyDescription: string
      emptyDescriptionFiltered: string
      clearFilters: string
    }
    detail: {
      submittedLabel: string
    }
    deleteModal: {
      title: string
      titleBulk: string
      confirmMessage: string
      confirmPrefix: string
      confirmSuffix: string
      itemsCount: string
    }
  }
  feedback: {
    searchPlaceholder: string
    categoryFilterPlaceholder: string
    statusFilterPlaceholder: string
    backToList: string
    notFoundTitle: string
    notFoundDescription: string
    categories: {
      bug: string
      feature: string
      general: string
    }
    statuses: {
      new: string
      reviewed: string
      resolved: string
    }
    table: {
      selectAllAria: string
      selectRowAria: string
      submitterColumn: string
      categoryColumn: string
      messageColumn: string
      statusColumn: string
      submittedColumn: string
      emptyTitle: string
      emptyTitleFiltered: string
      emptyDescription: string
      emptyDescriptionFiltered: string
      clearFilters: string
    }
    detail: {
      title: string
      submittedBy: string
      statusLabel: string
      saveButton: string
      updateSuccess: string
      updateError: string
    }
    deleteModal: {
      title: string
      titleBulk: string
      confirmSingle: string
      confirmBulk: string
    }
  }
  // Admin user-management screens (/admin/users/**) — merged into this
  // namespace rather than a separate `adminUsers` one; it's still just
  // "the admin section" from a translator's point of view.
  users: {
    roles: {
      admin: string
      user: string
    }
    status: {
      banned: string
      active: string
    }
    actions: {
      impersonateButton: string
      banButton: string
      unbanButton: string
    }
    list: {
      searchPlaceholder: string
      roleFilterPlaceholder: string
      addUserButton: string
      emptyState: {
        noResultsTitle: string
        noResultsDescription: string
        noUsersTitle: string
        noUsersDescription: string
        clearFiltersButton: string
      }
      table: {
        userColumn: string
        roleColumn: string
        statusColumn: string
        joinedColumn: string
        selectAllAria: string
        selectRowAria: string
      }
    }
    detail: {
      backLink: string
      notFound: {
        title: string
        description: string
      }
      detailsForm: {
        title: string
        description: string
        nameLabel: string
        nameRequired: string
        emailLabel: string
        emailRequired: string
        usernameLabel: string
        usernamePlaceholder: string
        successMessage: string
        genericError: string
        submitButton: string
      }
      roleForm: {
        title: string
        description: string
        selfNotice: string
        roleLabel: string
        successMessage: string
        genericError: string
      }
      passwordForm: {
        title: string
        description: string
        newPasswordLabel: string
        newPasswordPlaceholder: string
        newPasswordTooShort: string
        confirmPasswordLabel: string
        confirmPasswordRequired: string
        mismatchError: string
        successMessage: string
        genericError: string
        submitButton: string
      }
      sessions: {
        title: string
        description: string
        revokeAllButton: string
        emptyState: string
        deviceColumn: string
        ipColumn: string
        expiresColumn: string
        currentBadge: string
        revokeTooltip: string
        unknownDevice: string
        unknownBrowser: string
        unknownOs: string
        unknownIp: string
        deviceTemplate: string
        genericRevokeError: string
        genericRevokeAllError: string
      }
    }
    banModal: {
      titleSingle: string
      titleMultiple: string
      reasonLabel: string
      reasonPlaceholder: string
      durationLabel: string
      durationDescription: string
      durationPlaceholder: string
      confirmButtonSingle: string
      confirmButtonMultiple: string
      genericError: string
    }
    createForm: {
      title: string
      nameLabel: string
      namePlaceholder: string
      nameRequired: string
      emailLabel: string
      emailPlaceholder: string
      emailRequired: string
      passwordLabel: string
      passwordPlaceholder: string
      passwordTooShort: string
      roleLabel: string
      submitButton: string
      genericError: string
    }
    bulkActions: {
      usersCountLabel: string
    }
  }
}

export interface Translations {
  common: CommonTranslations
  auth: AuthTranslations
  site: SiteTranslations
  home: HomeTranslations
  profile: ProfileTranslations
  admin: AdminTranslations
}
