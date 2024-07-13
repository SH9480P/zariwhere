import type { Student } from './student'

export interface RollBook {
  className: string
  fieldOptions: {
    addId: boolean
    addSex: boolean
  }
  students: Student[]
}
