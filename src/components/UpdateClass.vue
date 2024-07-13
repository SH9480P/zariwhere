<script setup lang="ts">
import { ClassModalType, type RollBook, type Student } from '@/types'
import ClassModalContent from './ClassModalContent.vue'
import ClassModalHeader from './ClassModalHeader.vue'
import UpsertClassModalBody from './UpsertClassModalBody.vue'
import { computed, inject, onActivated, ref, unref, type ComputedRef } from 'vue'
import { useStudent } from '@/composables'

const { className, fieldOptions, students, studentIdSet, delay, isDataValid, deleteIdAndSex } = useStudent()
const movePrevPage = inject<() => void>('movePrevPage', () => {})
const isFirstPage = inject<ComputedRef<boolean>>('isFirstPage')

const selectedRollBook = defineModel<RollBook | null>('selected', { required: true })
const newRollBook = defineModel<RollBook | null>('created', { required: true })
const updatedRollBook = defineModel<RollBook | null>('updated', { required: true })

async function save() {
  if (isDataValid()) {
    await delay(2000)
    const rollBook = {
      className: unref(className),
      fieldOptions: unref(fieldOptions),
      students: unref(students),
    }
    updatedRollBook.value = rollBook
    movePrevPage()
    deleteIdAndSex()

    return
  }
  alert('cannot update class..')
}

onActivated(() => {
  if (updatedRollBook.value) {
    const urb = unref(updatedRollBook) as RollBook
    className.value = urb.className
    fieldOptions.value = urb.fieldOptions
    students.value = urb.students
  }
})
</script>

<template>
  <ClassModalContent>
    <template #modal-header>
      <ClassModalHeader :class-modal-type="ClassModalType.UPDATE_CLASS" @save-changes="save"></ClassModalHeader>
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
