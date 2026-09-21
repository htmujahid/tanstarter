import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const scriptsDir = fileURLToPath(new URL('.', import.meta.url))
const publicDir = fileURLToPath(new URL('../public', import.meta.url))

async function render(svgPath, outPath, size) {
  const svg = await readFile(svgPath)
  await sharp(svg).resize(size, size).png().toFile(outPath)
}

const icon = `${scriptsDir}icon-source.svg`
const maskable = `${scriptsDir}icon-maskable-source.svg`

await Promise.all([
  writeFile(`${publicDir}/favicon.svg`, await readFile(icon)),
  render(icon, `${publicDir}/favicon-16x16.png`, 16),
  render(icon, `${publicDir}/favicon-32x32.png`, 32),
  render(icon, `${publicDir}/apple-touch-icon.png`, 180),
  render(icon, `${publicDir}/icon-192.png`, 192),
  render(icon, `${publicDir}/icon-512.png`, 512),
  render(maskable, `${publicDir}/icon-512-maskable.png`, 512),
])

console.log('Generated PWA icons in public/')
