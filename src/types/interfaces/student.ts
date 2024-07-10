import type { Sex } from '../enums/sex'

export interface Student {
  id: number | null
  name: string
  sex: Sex | null
}
