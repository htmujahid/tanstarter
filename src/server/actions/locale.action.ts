import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'

import { detectLocale } from '#/lib/i18n/detect-locale'

export const getLocaleFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    return detectLocale(getRequest())
  },
)
