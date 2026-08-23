export type Category = 'length' | 'mass' | 'temperature'

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

export type UnitId = LengthUnitId | MassUnitId | TemperatureUnitId

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
