import type { HomeTranslations } from '#/lib/i18n/locales/types'

export const home: HomeTranslations = {
  dashboard: {
    stats: {
      notes: 'Notes',
      apiKeys: 'API keys',
    },
  },
  apiKeys: {
    createButton: 'Create key',
    table: {
      nameColumn: 'Name',
      keyColumn: 'Key',
      createdColumn: 'Created',
      expiresColumn: 'Expires',
      lastUsedColumn: 'Last used',
      never: 'Never',
      untitledKey: 'Untitled key',
      disabledBadge: 'Disabled',
      deleteTooltip: 'Delete key',
      deleteError: 'Unable to delete API key',
    },
    empty: {
      title: 'No API keys yet',
      description: 'Create a key to access the API programmatically.',
    },
    createForm: {
      title: 'Create an API key',
      nameLabel: 'Name',
      namePlaceholder: 'e.g. CI pipeline',
      nameRequired: 'Name is required',
      expirationLabel: 'Expiration',
      expirationNever: 'Never',
      expiration30Days: '30 days',
      expiration90Days: '90 days',
      expiration1Year: '1 year',
      submit: 'Create key',
      genericError: 'Unable to create API key',
    },
    revealModal: {
      title: 'API key created',
      description: "Copy this key now — you won't be able to see it again.",
      copyTooltip: 'Copy',
      copiedTooltip: 'Copied',
      done: 'Done',
    },
  },
  notes: {
    searchPlaceholder: 'Search by title',
    addButton: 'Add note',
    backToNotes: 'Back to notes',
    notFound: {
      title: 'Note not found',
      description:
        'This note may have been deleted, or the link is no longer valid.',
    },
    form: {
      titleLabel: 'Title',
      titlePlaceholder: 'Note title',
      titleRequired: 'Title is required',
      bodyLabel: 'Body',
      bodyPlaceholder: 'Optional',
    },
    createForm: {
      title: 'Add note',
      submit: 'Create note',
      genericError: 'Unable to create note',
    },
    detailsForm: {
      title: 'Note details',
      subtitle: "Update this note's title and body.",
      updateSuccess: 'Note updated successfully',
      submit: 'Save changes',
      genericError: 'Unable to update note',
    },
    actions: {
      deleteButton: 'Delete',
    },
    bulkActions: {
      deleteButton: 'Delete',
      notesCount: '{{count}} notes',
    },
    table: {
      selectAllAria: 'Select all notes',
      selectRowAria: 'Select {{title}}',
      titleColumn: 'Title',
      createdColumn: 'Created',
      updatedColumn: 'Updated',
      searchEmptyTitle: 'No notes found',
      searchEmptyDescription:
        'Try adjusting your search to find what you are looking for.',
      emptyTitle: 'No notes yet',
      emptyDescription: 'Get started by adding your first note.',
    },
  },
  sidebar: {
    dashboard: 'Dashboard',
    notes: 'Notes',
    analytics: {
      label: 'Analytics',
      reports: 'Reports',
      liveView: 'Live view',
    },
    settings: {
      label: 'Settings',
      general: 'General',
      notifications: 'Notifications',
      security: 'Security',
      members: 'Members',
    },
  },
}
