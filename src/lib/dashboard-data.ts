// Deterministic pseudo-random fake data for the dashboard demo widgets.
// A seeded RNG keeps server and client output identical, avoiding hydration mismatches.
function mulberry32(seed: number) {
  let state = seed
  return function random() {
    state |= 0
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const random = mulberry32(20260919)

function randomInt(min: number, max: number) {
  return Math.floor(random() * (max - min + 1)) + min
}

function randomFloat(min: number, max: number, decimals = 1) {
  return Number((random() * (max - min) + min).toFixed(decimals))
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

const DAY_MS = 24 * 60 * 60 * 1000

function formatDay(date: Date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export const revenueSeries = Array.from({ length: 14 }, (_, index) => {
  const date = new Date(Date.now() - (13 - index) * DAY_MS)
  return {
    date: formatDay(date),
    revenue: randomInt(900, 4200),
    orders: randomInt(8, 46),
  }
})

const totalRevenue = revenueSeries.reduce((sum, day) => sum + day.revenue, 0)
const totalOrdersThisPeriod = revenueSeries.reduce(
  (sum, day) => sum + day.orders,
  0,
)

export const stats = [
  {
    label: 'Total revenue',
    value: formatCurrency(totalRevenue),
    change: randomFloat(-6, 22),
    icon: 'revenue' as const,
  },
  {
    label: 'Orders',
    value: totalOrdersThisPeriod.toLocaleString(),
    change: randomFloat(-4, 18),
    icon: 'orders' as const,
  },
  {
    label: 'New customers',
    value: randomInt(60, 320).toLocaleString(),
    change: randomFloat(-10, 28),
    icon: 'customers' as const,
  },
  {
    label: 'Conversion rate',
    value: `${randomFloat(1.4, 4.6)}%`,
    change: randomFloat(-5, 9),
    icon: 'conversion' as const,
  },
]

const categories = [
  'Apparel',
  'Electronics',
  'Home & Garden',
  'Beauty',
  'Sports',
] as const
const categoryColors = [
  'blue.6',
  'teal.6',
  'grape.6',
  'orange.6',
  'yellow.6',
] as const

export const salesByCategory = categories.map((name, index) => ({
  name,
  value: randomInt(10, 46),
  color: categoryColors[index],
}))

const productNames = [
  'Wireless Earbuds',
  'Canvas Tote Bag',
  'Ceramic Mug Set',
  'Yoga Mat',
  'Desk Lamp',
]

export const topProducts = productNames
  .map((name) => ({ name, value: randomInt(1200, 9800) }))
  .sort((a, b) => b.value - a.value)

const customerNames = [
  'Ava Thompson',
  'Liam Rodriguez',
  'Sophia Chen',
  'Noah Patel',
  'Mia Johansson',
  'Ethan Wright',
]

const orderStatuses = [
  'Fulfilled',
  'Processing',
  'Pending',
  'Refunded',
] as const

export type OrderStatus = (typeof orderStatuses)[number]

export const recentOrders = customerNames.map((customer, index) => {
  const date = new Date(Date.now() - randomInt(0, 6) * DAY_MS)
  return {
    id: `#${3050 + index}`,
    customer,
    amount: randomInt(24, 480),
    status: orderStatuses[randomInt(0, orderStatuses.length - 1)],
    date: formatDay(date),
  }
})

export { formatCurrency }
