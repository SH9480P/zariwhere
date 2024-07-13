<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ClassModal from './components/ClassModal.vue'
import { classModalId } from './constants'
import { ClassModalType, type RollBook } from './types'
import { Modal } from 'bootstrap'

let firstClassModalType = ref<ClassModalType.CREATE_CLASS | ClassModalType.SELECT_CLASS | null>(null)
function initFirstClassModalType() {
  firstClassModalType.value = null
}

const modal = ref<Modal | null>(null)
onMounted(() => {
  modal.value = new Modal(`#${classModalId}`)
})

function closeModal() {
  modal.value?.hide()
}
function openModal() {
  modal.value?.show()
}

const rollBook = ref<RollBook | null>(null)
</script>

<template>
  <button
    type="button"
    @click="(firstClassModalType = ClassModalType.CREATE_CLASS), openModal()"
    class="btn btn-primary"
  >
    create class
  </button>
  <button
    type="button"
    @click="(firstClassModalType = ClassModalType.SELECT_CLASS), openModal()"
    class="btn btn-primary"
  >
    select class
  </button>
  <ClassModal
    :first-page="firstClassModalType"
    @init-first-page="initFirstClassModalType"
    :close-modal-func="closeModal"
    v-model:roll-book="rollBook"
  ></ClassModal>
  <div>
    {{ rollBook }}
  </div>
</template>

<style>
body {
  margin: 0;
}

div {
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100vw;
  height: 100vh;
}
</style>
./constants
