<script setup lang="ts"></script>

<template>
  <div class="modal-header p-2">
    <slot name="modal-header"></slot>
  </div>
  <div class="modal-body">
    <slot name="modal-body"></slot>
  </div>
</template>

<style scoped></style>
