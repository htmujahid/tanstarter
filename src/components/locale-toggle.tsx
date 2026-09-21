import { ActionIcon, Menu } from '@mantine/core'
import { IconLanguage } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

import { useLocale } from '#/hooks/use-locale'
import {
  LOCALE_COOKIE_NAME,
  LOCALE_LABELS,
  SUPPORTED_LOCALES,
} from '#/lib/i18n/config'
import type { Locale } from '#/lib/i18n/config'

export function LocaleToggle() {
  const { t } = useTranslation()
  const locale = useLocale()

  function selectLocale(next: Locale) {
    if (next === locale) return

    document.cookie = `${LOCALE_COOKIE_NAME}=${next}; path=/; max-age=31536000; samesite=lax`
    window.location.reload()
  }

  return (
    <Menu position="bottom-end" shadow="md" width={160}>
      <Menu.Target>
        <ActionIcon
          variant="default"
          size="lg"
          radius="xl"
          aria-label={t('locale.label')}
          title={t('locale.label')}
        >
          <IconLanguage size={18} stroke={1.5} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        {SUPPORTED_LOCALES.map((code) => (
          <Menu.Item
            key={code}
            fw={code === locale ? 700 : 400}
            onClick={() => selectLocale(code)}
          >
            {LOCALE_LABELS[code]}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  )
}
