<script setup lang="ts">
import { ClassModalType } from '@/types'
import { inject } from 'vue'

const props = defineProps<{
  classModalType: ClassModalType
}>()
const movePrevPage = inject<() => void>('movePrevPage')

const modalTitle = {
  [ClassModalType.CREATE_CLASS]: 'Create Class',
  [ClassModalType.UPDATE_CLASS]: 'Update Class',
  [ClassModalType.SELECT_CLASS]: 'Select Class',
}

const emits = defineEmits(['saveChanges'])
</script>

<template>
  <div class="container-fluid d-flex justify-content-between align-items-center">
    <h1 class="modal-title fs-5" id="classModalLabel">{{ modalTitle[classModalType] }}</h1>
    <div class="p-2">
      <button type="button" class="btn btn-secondary me-1" @click="movePrevPage">Close</button>
      <button type="button" class="btn btn-primary ms-1" @click="emits('saveChanges')">Save changes</button>
    </div>
  </div>
</template>

<style scoped></style>
