<script setup lang="ts">
import { ref } from 'vue'
import ClassModal from './components/ClassModal.vue'
import { classModalId } from './constants'
import { ClassModalType } from './types'

let classModalInitType = ref<ClassModalType.CREATE_CLASS | ClassModalType.SELECT_CLASS | null>(null)
</script>

<template>
  <button
    type="button"
    @click="classModalInitType = ClassModalType.CREATE_CLASS"
    class="btn btn-primary"
    data-bs-toggle="modal"
    :data-bs-target="`#${classModalId}`"
  >
    create class
  </button>
  <button
    type="button"
    @click="classModalInitType = ClassModalType.SELECT_CLASS"
    class="btn btn-primary"
    data-bs-toggle="modal"
    :data-bs-target="`#${classModalId}`"
  >
    select class
  </button>
  <ClassModal :init-page="classModalInitType"></ClassModal>
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
