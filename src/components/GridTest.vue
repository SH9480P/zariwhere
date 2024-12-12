<script setup lang="ts">
import { reactive, ref } from 'vue'

const layout = ref([
  { x: 0, y: 0, w: 2, h: 2, i: '0', static: false },
  { x: 2, y: 0, w: 2, h: 4, i: '1', static: false },
  { x: 4, y: 0, w: 2, h: 5, i: '2', static: false },
  { x: 6, y: 0, w: 2, h: 3, i: '3', static: false },
  { x: 8, y: 0, w: 2, h: 3, i: '4', static: false },
])
</script>

<template>
  <GridLayout
    v-model:layout="layout"
    :row-height="20"
    :col-num="40"
    :margin="[6, 6]"
    :is-bounded="true"
    :vertical-compact="false"
    :restore-on-drag="false"
    :auto-size="false"
    :prevent-collision="true"
  >
    <template #item="{ item }">
      <span class="text">{{ `${item.i}${item.static ? '- Static' : ''}` }}</span>
    </template>
  </GridLayout>
</template>

<style scoped>
.vgl-layout {
  background-color: #eee;
  height: 100%;
}

.vgl-layout::before {
  position: absolute;
  width: calc(100% - 3px);
  height: calc(100% - 3px);
  margin: 3px;
  content: '';
  background-image: linear-gradient(to right, lightgrey 1px, transparent 1px),
    linear-gradient(to bottom, lightgrey 1px, transparent 1px);
  background-repeat: repeat;
  background-size: calc(calc(100% - 3px) / 40) 26px;
}

:deep(.vgl-item:not(.vgl-item--placeholder)) {
  background-color: #ccc;
  border: 1px solid black;
}

:deep(.vgl-item--resizing) {
  opacity: 90%;
}

:deep(.vgl-item--static) {
  background-color: #cce;
}

.text {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: auto;
  font-size: 24px;
  text-align: center;
}
</style>
