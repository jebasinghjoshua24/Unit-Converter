export type Category = 'length'

export type LengthUnitId =
  | 'millimeter'
  | 'centimeter'
  | 'meter'
  | 'kilometer'
  | 'inch'
  | 'foot'
  | 'yard'
  | 'mile'

export type UnitId = LengthUnitId

export interface Unit {
  id: UnitId
  name: string
  symbol: string
  factor: number
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
