import { SUPPORTED_LANGUAGES } from '../../config'

type NumberScale = { scale: number; symbol: 'M' | 'k'; decimal: number }

export const countFormatter = (value: any, lang?: string) => {
  if (!lang || !SUPPORTED_LANGUAGES.includes(lang)) throw new Error(`Unexpected language: ${lang}`)
  if (typeof value !== 'number')
    throw new Error(`Invalid value object, received: ${JSON.stringify(value)}`)

  const plainNumber = value as number

  const numberScales: NumberScale[] = [
    { scale: 1000000, symbol: 'M', decimal: 2 },
    { scale: 1000, symbol: 'k', decimal: 1 },
  ]

  for (const numberScale of numberScales) {
    const result = plainNumber / numberScale.scale
    const numberFormatter = new Intl.NumberFormat(lang, { maximumFractionDigits: numberScale.decimal })
    if (result >= 1)
      return numberFormatter.format(result) + numberScale.symbol
      // return result.toFixed(numberScale.decimal).replace(/\.?0+$/, '') + numberScale.symbol
  }

  return plainNumber.toString()
}
