import { ActionIcon, useComputedColorScheme, useMantineColorScheme } from '@mantine/core'
import { IconMoon, IconSun, IconSunMoon } from '@tabler/icons-react'

export default function ThemeToggle() {
  const { colorScheme, setColorScheme } = useMantineColorScheme()
  const computedColorScheme = useComputedColorScheme('light')

  function cycleColorScheme() {
    const next =
      colorScheme === 'light' ? 'dark' : colorScheme === 'dark' ? 'auto' : 'light'
    setColorScheme(next)
  }

  const label =
    colorScheme === 'auto'
      ? 'Theme mode: auto (system). Click to switch to light mode.'
      : `Theme mode: ${colorScheme}. Click to switch mode.`

  const Icon =
    colorScheme === 'auto' ? IconSunMoon : computedColorScheme === 'dark' ? IconMoon : IconSun

  return (
    <ActionIcon
      variant="default"
      size="lg"
      radius="xl"
      onClick={cycleColorScheme}
      aria-label={label}
      title={label}
    >
      <Icon size={18} stroke={1.5} />
    </ActionIcon>
  )
}
