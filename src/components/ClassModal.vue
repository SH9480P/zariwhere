<script setup lang="ts">
import { ClassModalType, type RollBook } from '@/types'
import CreateClass from './CreateClass.vue'
import SelectClass from './SelectClass.vue'
import { computed, ref, watch, provide } from 'vue'
import UpdateClass from './UpdateClass.vue'

const emits = defineEmits(['initFirstPage'])

const props = defineProps<{
  firstPage: ClassModalType.CREATE_CLASS | ClassModalType.SELECT_CLASS | null
  closeModalFunc: () => void
}>()

const pageStack = ref<ClassModalType[]>([])

const getCurPage = computed<ClassModalType | undefined>(() => pageStack.value[pageStack.value.length - 1])
provide('movePrevPage', movePrevPage)
function movePrevPage() {
  pageStack.value.pop()
  if (pageStack.value.length === 0) {
    props.closeModalFunc()
    emits('initFirstPage')
  }
}

const isFirstPage = computed(() => pageStack.value.length === 1)
provide('isFirstPage', isFirstPage)

provide('openNewPage', openNewPage)
function openNewPage(newPage: ClassModalType) {
  pageStack.value.push(newPage)
}

watch(
  () => props.firstPage,
  (newFirstPage) => {
    if (newFirstPage != null) pageStack.value = [newFirstPage]
  }
)

const selectedRollBook = defineModel<RollBook | null>('rollBook', { required: true })
// const selectedRollBook = ref<RollBook | null>(null)

const newRollBook = ref<RollBook | null>(null)

const updatedRollBook = ref<RollBook | null>(null)

const pages = [CreateClass, UpdateClass, SelectClass]
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
      <div class="modal-content" v-if="getCurPage != null">
        <keep-alive>
          <component
            :is="pages[getCurPage]"
            v-model:selected="selectedRollBook"
            v-model:created="newRollBook"
            v-model:updated="updatedRollBook"
          ></component>
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
