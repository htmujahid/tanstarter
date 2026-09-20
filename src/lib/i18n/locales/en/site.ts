import type { SiteTranslations } from '#/lib/i18n/locales/types'

export const site: SiteTranslations = {
  landing: {
    badge: 'Built for modern storefronts',
    heroTitle: 'Sell online without',
    heroHighlight: 'the overhead',
    subtitle:
      'Launch a fast, secure storefront your customers will love. Built to get out of your way, so you can focus on selling.',
    getHelp: 'Get help',
    announcementsLink: 'Announcements',
    contactLink: 'Contact us',
  },
  help: {
    title: 'Help & FAQ',
    subtitle:
      'Answers to common questions about running your store from this dashboard.',
    faqs: [
      {
        question: 'How do I add a new product?',
        answer:
          'Go to Products and click "Add product". Enter the name, price, images, and stock details, then publish it to make it visible in your store.',
      },
      {
        question: 'How do I manage and fulfill orders?',
        answer:
          'Open the Orders section to see every order as it comes in. Click into an order to update its status, print a packing slip, or issue a refund.',
      },
      {
        question: 'How do I keep track of inventory?',
        answer:
          "Each product's stock count is shown right in Products, and you'll get a low-stock alert automatically so you never oversell an item.",
      },
      {
        question: 'Can I invite my team to help manage the store?',
        answer:
          'Yes — invite teammates from the Team section and assign them a role, like Admin or Staff, to control what they can see and do.',
      },
      {
        question: 'How do I see how my store is performing?',
        answer:
          'The Dashboard gives you a quick view of sales, orders, and top-selling products, so you can track how your store is doing at a glance.',
      },
      {
        question: 'How do I update my store settings?',
        answer:
          'Head to Settings to update your store name, currency, shipping options, and payment methods at any time.',
      },
    ],
    support: {
      prompt: 'Still need help?',
      contactLink: 'Contact our support team',
      orHeadBack: ', or head',
      homeLink: 'back to home',
      end: '.',
    },
  },
  contact: {
    title: 'Contact us',
    subtitle:
      "Have a question or need help? Send us a message and we'll get back to you.",
    helpPrompt: 'Looking for answers first? Check our',
    helpLink: 'help & FAQ',
    helpEnd: '.',
    nameLabel: 'Name',
    namePlaceholder: 'Your name',
    nameRequired: 'Name is required',
    emailLabel: 'Email',
    emailPlaceholder: 'you@example.com',
    emailRequired: 'Email is required',
    messageLabel: 'Message',
    messagePlaceholder: 'How can we help?',
    messageRequired: 'Message is required',
    submit: 'Send message',
    genericError: 'Unable to send message',
    successTitle: 'Message sent',
    successDescription:
      "Thanks for reaching out — we'll get back to you soon.",
    sendAnother: 'Send another message',
  },
  announcements: {
    title: 'Announcements',
    subtitle: 'Product updates and news, open to everyone.',
    backLink: 'Back to announcements',
    notFound: {
      title: 'Announcement not found',
      description:
        'This announcement may have been removed, or the link is no longer valid.',
    },
    emptyState: {
      title: 'No announcements yet',
      description: 'Check back later for updates.',
    },
  },
  feedback: {
    title: 'Feedback',
    subtitle: 'Your past submissions, and a place to send a new one.',
    sendFeedback: 'Send feedback',
    backLink: 'Back to feedback',
    categoryLabel: 'Category',
    categories: {
      bug: 'Bug',
      feature: 'Feature',
      general: 'General',
    },
    statuses: {
      new: 'New',
      reviewed: 'Reviewed',
      resolved: 'Resolved',
    },
    messageLabel: 'Message',
    messagePlaceholder: "Tell us what's on your mind",
    messageRequired: 'Message is required',
    genericError: 'Unable to send feedback',
    submittedAt: 'Submitted {{date}}',
    notFound: {
      title: 'Feedback not found',
      description:
        'This feedback may have been removed, or the link is no longer valid.',
    },
    emptyState: {
      title: 'No feedback sent yet',
      description:
        'Have a bug report, feature request, or comment? Let us know.',
    },
  },
}
