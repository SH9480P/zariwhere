<script setup lang="ts">
import { ClassModalType, Sex, type RollBook } from '@/types'
import ClassModalHeader from './ClassModalHeader.vue'
import ClassModalContent from './ClassModalContent.vue'
import { inject, onActivated, onMounted, ref, unref, type ComputedRef } from 'vue'
// STUB
async function getClassName_stub() {
  return ['6-1', '5-2', '우리반']
}
const rollBookList = ref<{ [key: string]: RollBook }>({
  '6-1': {
    className: '6-1',
    fieldOptions: {
      addId: true,
      addSex: true,
    },
    students: [
      {
        id: 1,
        name: '세환',
        sex: Sex.M,
      },
      {
        id: 2,
        name: 'judy',
        sex: Sex.F,
      },
    ],
  },
  '5-2': {
    className: '5-2',
    fieldOptions: {
      addId: false,
      addSex: true,
    },
    students: [
      {
        id: null,
        name: '세환',
        sex: Sex.M,
      },
      {
        id: null,
        name: 'judy',
        sex: Sex.F,
      },
    ],
  },
  우리반: {
    className: '우리반',
    fieldOptions: {
      addId: false,
      addSex: false,
    },
    students: [
      {
        id: null,
        name: '세환',
        sex: null,
      },
      {
        id: null,
        name: 'judy',
        sex: null,
      },
    ],
  },
})

const emits = defineEmits(['dataFromSelectToApp', 'dataFromSelectToUpdate'])
const movePrevPage = inject<() => void>('movePrevPage', () => {})
function save() {
  if (curClass.value) {
    selectedRollBook.value = unref(curClass)
    movePrevPage()
  } else {
    alert('Please Choose Class..')
  }
}

const curClass = ref<RollBook | null>(null)
const curClassIdx = ref(-1)
async function clickClassName(idx: number, className: string) {
  curClassIdx.value = idx
  if (rollBookList.value[className]) {
    curClass.value = unref(rollBookList)[className]
  } else {
    // curClass.value = await getClass_stub(className)
  }
}

const classNameList = ref<string[]>([])
const selectedRollBook = defineModel<RollBook | null>('selected', { required: true })
const newRollBook = defineModel<RollBook | null>('created', { required: true })
const updatedRollBook = defineModel<RollBook | null>('updated', { required: true })

const openNewPage = inject<(newPage: ClassModalType) => void>('openNewPage', () => {})
function openCreatePage() {
  openNewPage(ClassModalType.CREATE_CLASS)
}
function openUpdatePage() {
  updatedRollBook.value = unref(curClass)
  openNewPage(ClassModalType.UPDATE_CLASS)
}

onMounted(async () => {
  classNameList.value = await getClassName_stub()
})
onActivated(() => {
  const nrb = unref(newRollBook)
  if (nrb != null) {
    classNameList.value.push(nrb.className)
    rollBookList.value[nrb.className] = nrb
    newRollBook.value = null
    clickClassName(classNameList.value.length - 1, nrb.className)
  }
  const urb = unref(updatedRollBook)
  if (urb != null) {
    delete rollBookList.value[classNameList.value[curClassIdx.value]]
    rollBookList.value[urb.className] = urb
    classNameList.value[curClassIdx.value] = urb.className
    updatedRollBook.value = null
    clickClassName(curClassIdx.value, urb.className)
  }
})
</script>

<template>
  <ClassModalContent>
    <template #modal-header>
      <ClassModalHeader :class-modal-type="ClassModalType.SELECT_CLASS" @save-changes="save"></ClassModalHeader>
    </template>
    <template #modal-body>
      <div class="row">
        <div class="col-3 border p-3">
          <button class="btn btn-primary mx-auto d-block mb-2" @click="openCreatePage">new class</button>
          <div class="list-group list-group-flush" id="classNameList">
            <button
              type="button"
              class="list-group-item list-group-item-action"
              style="overflow-wrap: anywhere"
              v-for="(className, i) in classNameList"
              :key="i"
              :class="curClassIdx === i ? 'active' : ''"
              @click="clickClassName(i, className)"
            >
              {{ className }}
            </button>
          </div>
        </div>
        <div class="col-9 border p-4 text-center">
          <div id="studentList" v-if="curClass != null">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <strong>{{ curClass.className }}</strong>
              <button class="btn btn-warning" @click="openUpdatePage">학급 수정</button>
            </div>
            <div class="border border-4"></div>
            <div class="row row-cols-2 g-0 border border-5">
              <div class="col border-start border-end border-5 fw-bold" v-for="_ in 2">
                <div class="row g-0 border-bottom border-black border-3">
                  <div class="col-2" v-show="curClass.fieldOptions.addId">번호</div>
                  <div class="col">이름</div>
                  <div class="col-3" v-show="curClass.fieldOptions.addSex">성별</div>
                </div>
              </div>
              <div class="col border-start border-end border-5" v-for="(student, i) in curClass.students" :key="i">
                <div class="row g-0 border-bottom">
                  <div class="col-2" v-show="curClass.fieldOptions.addId">{{ student.id }}</div>
                  <div class="col">{{ student.name }}</div>
                  <div class="col-3" v-show="curClass.fieldOptions.addSex">{{ student.sex }}</div>
                </div>
              </div>
            </div>
            <div class="border border-3"></div>
          </div>
          <div v-else class="text-center">좌측 리스트에서 학급을 선택해보세요!</div>
        </div>
      </div>
    </template>
  </ClassModalContent>
</template>

<style scoped>
#classNameList,
#studentList {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}
</style>
