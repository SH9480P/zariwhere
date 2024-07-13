import type { Student } from '@/types'
import { computed, ref } from 'vue'

export function useStudent() {
  const className = ref('')
  const fieldOptions = ref({
    addId: true,
    addSex: true,
  })
  const students = ref<Student[]>([])
  const studentIdSet = computed(() => new Set(students.value.map(({ id }) => id)))

  function delay(ms: number) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), ms)
    })
  }
  function isDataValid() {
    let result = className.value.length > 0
    if (fieldOptions.value.addId) {
      result &&= students.value.every(({ id }) => id != null)
    }
    if (fieldOptions.value.addSex) {
      result &&= students.value.every(({ sex }) => sex != null)
    }
    return result
  }
  function deleteIdAndSex() {
    for (let student of students.value) {
      if (!fieldOptions.value.addId) {
        student.id = null
      }
      if (!fieldOptions.value.addSex) {
        student.sex = null
      }
    }
  }

  return {
    className,
    fieldOptions,
    students,
    studentIdSet,
    delay,
    isDataValid,
    deleteIdAndSex,
  }
}
