export type Category =
  | 'length'
  | 'mass'
  | 'temperature'
  | 'area'
  | 'volume'
  | 'time'
  | 'speed'
  | 'energy'
  | 'pressure'
  | 'currency'

export type LengthUnitId =
  | 'millimeter'
  | 'centimeter'
  | 'meter'
  | 'kilometer'
  | 'inch'
  | 'foot'
  | 'yard'
  | 'mile'

export type MassUnitId =
  | 'milligram'
  | 'gram'
  | 'kilogram'
  | 'tonne'
  | 'ounce'
  | 'pound'
  | 'stone'

export type TemperatureUnitId = 'celsius' | 'fahrenheit' | 'kelvin'

export type AreaUnitId =
  | 'square-millimeter'
  | 'square-centimeter'
  | 'square-meter'
  | 'square-kilometer'
  | 'square-inch'
  | 'square-foot'
  | 'square-yard'
  | 'acre'
  | 'square-mile'

export type VolumeUnitId =
  | 'milliliter'
  | 'liter'
  | 'cubic-meter'
  | 'cubic-foot'
  | 'cubic-inch'
  | 'gallon'
  | 'quart'
  | 'pint'
  | 'fluid-ounce'

export type TimeUnitId =
  | 'millisecond'
  | 'second'
  | 'minute'
  | 'hour'
  | 'day'
  | 'week'

export type SpeedUnitId = 'ms' | 'kmh' | 'mph' | 'fts' | 'knot'

export type EnergyUnitId =
  | 'joule'
  | 'kilojoule'
  | 'calorie'
  | 'kilocalorie'
  | 'wh'
  | 'kwh'

export type PressureUnitId = 'pascal' | 'kilopascal' | 'bar' | 'atmosphere' | 'mmhg' | 'psi'

export type CurrencyUnitId =
  | 'usd'
  | 'eur'
  | 'gbp'
  | 'jpy'
  | 'inr'
  | 'cad'
  | 'aud'
  | 'chf'

export type UnitId =
  | LengthUnitId
  | MassUnitId
  | TemperatureUnitId
  | AreaUnitId
  | VolumeUnitId
  | TimeUnitId
  | SpeedUnitId
  | EnergyUnitId
  | PressureUnitId
  | CurrencyUnitId

export interface Unit {
  id: UnitId
  name: string
  symbol: string
  factor: number
  offset?: number
}

export interface ConvertRequest {
  value: number
  from: UnitId
  to: UnitId
}

export interface ConvertResult {
  value: number
  from: UnitId
  to: UnitId
  unit: string
}
