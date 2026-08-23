import type { Category, Unit } from '../../types/conversion'

const LENGTH_BASE_UNIT = 'meter'
const MASS_BASE_UNIT = 'kilogram'
const TEMPERATURE_BASE_UNIT = 'celsius'
const AREA_BASE_UNIT = 'square-meter'
const VOLUME_BASE_UNIT = 'liter'
const TIME_BASE_UNIT = 'second'
const SPEED_BASE_UNIT = 'ms'
const ENERGY_BASE_UNIT = 'joule'
const PRESSURE_BASE_UNIT = 'pascal'
const CURRENCY_BASE_UNIT = 'usd'

export const lengthUnits: Unit[] = [
  { id: 'millimeter', name: 'Millimeter', symbol: 'mm', factor: 0.001 },
  { id: 'centimeter', name: 'Centimeter', symbol: 'cm', factor: 0.01 },
  { id: 'meter', name: 'Meter', symbol: 'm', factor: 1 },
  { id: 'kilometer', name: 'Kilometer', symbol: 'km', factor: 1000 },
  { id: 'inch', name: 'Inch', symbol: 'in', factor: 0.0254 },
  { id: 'foot', name: 'Foot', symbol: 'ft', factor: 0.3048 },
  { id: 'yard', name: 'Yard', symbol: 'yd', factor: 0.9144 },
  { id: 'mile', name: 'Mile', symbol: 'mi', factor: 1609.344 },
]

export const massUnits: Unit[] = [
  { id: 'milligram', name: 'Milligram', symbol: 'mg', factor: 0.000001 },
  { id: 'gram', name: 'Gram', symbol: 'g', factor: 0.001 },
  { id: 'kilogram', name: 'Kilogram', symbol: 'kg', factor: 1 },
  { id: 'tonne', name: 'Tonne', symbol: 't', factor: 1000 },
  { id: 'ounce', name: 'Ounce', symbol: 'oz', factor: 0.028349523125 },
  { id: 'pound', name: 'Pound', symbol: 'lb', factor: 0.45359237 },
  { id: 'stone', name: 'Stone', symbol: 'st', factor: 6.35029318 },
]

export const temperatureUnits: Unit[] = [
  { id: 'celsius', name: 'Celsius', symbol: '°C', factor: 1, offset: 0 },
  { id: 'fahrenheit', name: 'Fahrenheit', symbol: '°F', factor: 5 / 9, offset: -160 / 9 },
  { id: 'kelvin', name: 'Kelvin', symbol: 'K', factor: 1, offset: -273.15 },
]

export const areaUnits: Unit[] = [
  { id: 'square-millimeter', name: 'Square Millimeter', symbol: 'mm²', factor: 0.000001 },
  { id: 'square-centimeter', name: 'Square Centimeter', symbol: 'cm²', factor: 0.0001 },
  { id: 'square-meter', name: 'Square Meter', symbol: 'm²', factor: 1 },
  { id: 'square-kilometer', name: 'Square Kilometer', symbol: 'km²', factor: 1000000 },
  { id: 'square-inch', name: 'Square Inch', symbol: 'in²', factor: 0.00064516 },
  { id: 'square-foot', name: 'Square Foot', symbol: 'ft²', factor: 0.09290304 },
  { id: 'square-yard', name: 'Square Yard', symbol: 'yd²', factor: 0.83612736 },
  { id: 'acre', name: 'Acre', symbol: 'ac', factor: 4046.8564224 },
  { id: 'square-mile', name: 'Square Mile', symbol: 'mi²', factor: 2589988.110336 },
]

export const volumeUnits: Unit[] = [
  { id: 'milliliter', name: 'Milliliter', symbol: 'mL', factor: 0.001 },
  { id: 'liter', name: 'Liter', symbol: 'L', factor: 1 },
  { id: 'cubic-meter', name: 'Cubic Meter', symbol: 'm³', factor: 1000 },
  { id: 'cubic-foot', name: 'Cubic Foot', symbol: 'ft³', factor: 28.316846592 },
  { id: 'cubic-inch', name: 'Cubic Inch', symbol: 'in³', factor: 0.016387064 },
  { id: 'gallon', name: 'Gallon (US)', symbol: 'gal', factor: 3.785411784 },
  { id: 'quart', name: 'Quart (US)', symbol: 'qt', factor: 0.946352946 },
  { id: 'pint', name: 'Pint (US)', symbol: 'pt', factor: 0.473176473 },
  { id: 'fluid-ounce', name: 'Fluid Ounce', symbol: 'fl oz', factor: 0.0295735295625 },
]

export const timeUnits: Unit[] = [
  { id: 'millisecond', name: 'Millisecond', symbol: 'ms', factor: 0.001 },
  { id: 'second', name: 'Second', symbol: 's', factor: 1 },
  { id: 'minute', name: 'Minute', symbol: 'min', factor: 60 },
  { id: 'hour', name: 'Hour', symbol: 'h', factor: 3600 },
  { id: 'day', name: 'Day', symbol: 'd', factor: 86400 },
  { id: 'week', name: 'Week', symbol: 'wk', factor: 604800 },
]

export const speedUnits: Unit[] = [
  { id: 'ms', name: 'Meter per Second', symbol: 'm/s', factor: 1 },
  { id: 'kmh', name: 'Kilometer per Hour', symbol: 'km/h', factor: 0.277778 },
  { id: 'mph', name: 'Mile per Hour', symbol: 'mph', factor: 0.44704 },
  { id: 'fts', name: 'Foot per Second', symbol: 'ft/s', factor: 0.3048 },
  { id: 'knot', name: 'Knot', symbol: 'kn', factor: 0.514444 },
]

export const energyUnits: Unit[] = [
  { id: 'joule', name: 'Joule', symbol: 'J', factor: 1 },
  { id: 'kilojoule', name: 'Kilojoule', symbol: 'kJ', factor: 1000 },
  { id: 'calorie', name: 'Calorie', symbol: 'cal', factor: 4.184 },
  { id: 'kilocalorie', name: 'Kilocalorie', symbol: 'kcal', factor: 4184 },
  { id: 'wh', name: 'Watt-hour', symbol: 'Wh', factor: 3600 },
  { id: 'kwh', name: 'Kilowatt-hour', symbol: 'kWh', factor: 3600000 },
]

export const pressureUnits: Unit[] = [
  { id: 'pascal', name: 'Pascal', symbol: 'Pa', factor: 1 },
  { id: 'kilopascal', name: 'Kilopascal', symbol: 'kPa', factor: 1000 },
  { id: 'bar', name: 'Bar', symbol: 'bar', factor: 100000 },
  { id: 'atmosphere', name: 'Atmosphere', symbol: 'atm', factor: 101325 },
  { id: 'mmhg', name: 'Millimeter of Mercury', symbol: 'mmHg', factor: 133.322 },
  { id: 'psi', name: 'Pound per Square Inch', symbol: 'psi', factor: 6894.757 },
]

// Currency metadata only — factors are placeholders. Live rates come from the DB
// (see lib/conversion/currency.ts). Static convert() refuses currency units.
export const currencyUnits: Unit[] = [
  { id: 'usd', name: 'US Dollar', symbol: 'USD', factor: 1 },
  { id: 'eur', name: 'Euro', symbol: 'EUR', factor: 1 },
  { id: 'gbp', name: 'British Pound', symbol: 'GBP', factor: 1 },
  { id: 'jpy', name: 'Japanese Yen', symbol: 'JPY', factor: 1 },
  { id: 'inr', name: 'Indian Rupee', symbol: 'INR', factor: 1 },
  { id: 'cad', name: 'Canadian Dollar', symbol: 'CAD', factor: 1 },
  { id: 'aud', name: 'Australian Dollar', symbol: 'AUD', factor: 1 },
  { id: 'chf', name: 'Swiss Franc', symbol: 'CHF', factor: 1 },
]

export const registry: Record<Category, Unit[]> = {
  length: lengthUnits,
  mass: massUnits,
  temperature: temperatureUnits,
  area: areaUnits,
  volume: volumeUnits,
  time: timeUnits,
  speed: speedUnits,
  energy: energyUnits,
  pressure: pressureUnits,
  currency: currencyUnits,
}

export function getBaseUnit(category: Category): string {
  if (category === 'length') {
    return LENGTH_BASE_UNIT
  }
  if (category === 'mass') {
    return MASS_BASE_UNIT
  }
  if (category === 'temperature') {
    return TEMPERATURE_BASE_UNIT
  }
  if (category === 'area') {
    return AREA_BASE_UNIT
  }
  if (category === 'volume') {
    return VOLUME_BASE_UNIT
  }
  if (category === 'time') {
    return TIME_BASE_UNIT
  }
  if (category === 'speed') {
    return SPEED_BASE_UNIT
  }
  if (category === 'energy') {
    return ENERGY_BASE_UNIT
  }
  if (category === 'pressure') {
    return PRESSURE_BASE_UNIT
  }
  if (category === 'currency') {
    return CURRENCY_BASE_UNIT
  }
  throw new Error(`Unknown category: ${category}`)
}
