<script setup lang="ts">
import { ClassModalType, type Student } from '@/types'
import ClassModalContent from './ClassModalContent.vue'
import ClassModalHeader from './ClassModalHeader.vue'
import UpsertClassModalBody from './UpsertClassModalBody.vue'
import { computed, inject, ref } from 'vue'

const className = ref('')
const fieldOptions = ref({
  addId: true,
  addSex: true,
})
const students = ref<Student[]>([])
const studentIdSet = computed(() => new Set(students.value.map(({ id }) => id)))

const movePrevPage = inject<() => void>('movePrevPage', () => {})
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
async function save() {
  if (isDataValid()) {
    await delay(2000)
    movePrevPage()
    deleteIdAndSex()
    return
  }
  alert('cannot create class..')
}
</script>

<template>
  <ClassModalContent>
    <template #modal-header>
      <ClassModalHeader :class-modal-type="ClassModalType.CREATE_CLASS" @save-changes="save"></ClassModalHeader>
    </template>
    <template #modal-body>
      <UpsertClassModalBody
        v-model:class-name="className"
        v-model:field-options="fieldOptions"
        v-model:students="students"
        v-model:student-id-set="studentIdSet"
      ></UpsertClassModalBody>
    </template>
  </ClassModalContent>
</template>

<style scoped></style>
