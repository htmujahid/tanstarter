import { Link, useMatches } from '@tanstack/react-router'
import { Anchor, Breadcrumbs, Text } from '@mantine/core'

export function HeaderBreadcrumbs() {
  const matches = useMatches()

  const items = matches
    .map((match) => ({
      pathname: match.pathname,
      label: match.staticData.breadcrumb,
    }))
    .filter((item): item is { pathname: string; label: string } =>
      Boolean(item.label),
    )

  if (items.length === 0) return null

  return (
    <Breadcrumbs separator="/">
      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return isLast ? (
          <Text key={item.pathname} size="sm" fw={500}>
            {item.label}
          </Text>
        ) : (
          <Anchor
            key={item.pathname}
            component={Link}
            to={item.pathname}
            size="sm"
            c="dimmed"
          >
            {item.label}
          </Anchor>
        )
      })}
    </Breadcrumbs>
  )
}
