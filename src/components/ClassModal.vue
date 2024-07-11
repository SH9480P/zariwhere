<script setup lang="ts">
import { ClassModalType } from '@/types'
import CreateClass from './CreateClass.vue'
import { computed, ref, watch, provide } from 'vue'

const emits = defineEmits(['initFirstPage'])

const props = defineProps<{
  firstPage: ClassModalType.CREATE_CLASS | ClassModalType.SELECT_CLASS | null
  closeModalFunc: () => void
}>()

const pageStack = ref<ClassModalType[]>([])

const curPage = computed<ClassModalType | undefined>(() => pageStack.value[pageStack.value.length - 1])
provide('movePrevPage', movePrevPage)

function movePrevPage() {
  pageStack.value.pop()
  if (pageStack.value.length === 0) {
    props.closeModalFunc()
    emits('initFirstPage')
  }
}

watch(
  () => props.firstPage,
  (newFirstPage) => {
    if (newFirstPage != null) pageStack.value = [newFirstPage]
  }
)
</script>

<template>
  <div
    class="modal fade"
    id="classModal"
    tabindex="-1"
    aria-labelledby="classModalLabel"
    aria-hidden="true"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
  >
    <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content" v-if="curPage === ClassModalType.CREATE_CLASS">
        <CreateClass></CreateClass>
      </div>
      <div class="modal-content" v-else-if="curPage === ClassModalType.UPDATE_CLASS">
        <CreateClass></CreateClass>
      </div>
      <div class="modal-content" v-else-if="curPage === ClassModalType.SELECT_CLASS">
        <CreateClass></CreateClass>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
