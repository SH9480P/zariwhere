<script setup lang="ts">
import { ClassModalType } from '@/types'
import CreateClass from './CreateClass.vue'
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  initPage: ClassModalType.CREATE_CLASS | ClassModalType.SELECT_CLASS | null
}>()

const modalTitle = ['Create Class', 'Update Class', 'Select Class']

const pageStack = ref<ClassModalType[]>([])

const curPage = computed<ClassModalType | undefined>(() => pageStack.value[pageStack.value.length - 1])
const isFirstPage = computed(() => pageStack.value.length === 1)

function movePrevPage() {
  if (!isFirstPage.value) {
    pageStack.value.pop()
  }
}

function closeModal() {
  switch (curPage.value) {
    case ClassModalType.CREATE_CLASS:
      break
    case ClassModalType.UPDATE_CLASS:
      break
    case ClassModalType.SELECT_CLASS:
      break
    default:
      break
  }
  movePrevPage()
}

watch(
  () => props.initPage,
  (newInitPage) => {
    if (newInitPage != null) pageStack.value = [newInitPage]
  }
)
</script>

<template>
  <div class="modal fade" id="classModal" tabindex="-1" aria-labelledby="classModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content" v-if="curPage != null">
        <div class="modal-header p-2">
          <div class="container-fluid d-flex justify-content-between align-items-center">
            <h1 class="modal-title fs-5" id="classModalLabel">{{ modalTitle[curPage] }}</h1>
            <div class="p-2">
              <button
                type="button"
                class="btn btn-secondary me-1"
                :data-bs-dismiss="isFirstPage ? 'modal' : ''"
                @click="closeModal"
              >
                Close
              </button>
              <button type="button" class="btn btn-primary ms-1">Save changes</button>
            </div>
          </div>
        </div>
        <div class="modal-body">
          <CreateClass v-if="curPage === ClassModalType.CREATE_CLASS"></CreateClass>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
