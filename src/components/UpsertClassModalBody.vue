<script setup lang="ts">
import { ref } from 'vue'
import type { Student, StudentFieldOptions } from '@/types'
import { Sex } from '@/types'

const className = defineModel<string>('className', { required: true })

const fieldOptions = defineModel<StudentFieldOptions>('fieldOptions', { required: true })

const students = defineModel<Student[]>('students', { required: true })

const studentIdSet = defineModel<Set<number | null>>('studentIdSet', { required: true })

const editedStudent = ref<Student & { isEditingNow: boolean; arrIdx: number | null }>({
  isEditingNow: false,
  arrIdx: null,
  name: '',
  id: null,
  sex: null,
})
const newStudent = ref<Student & { isAddingNow: boolean }>({
  isAddingNow: false,
  name: '',
  id: null,
  sex: null,
})

function deleteStudent(idx: number) {
  const { isEditingNow, arrIdx } = editedStudent.value
  if (isEditingNow && arrIdx === idx) {
    cancelEditStudent()
  }
  students.value.splice(idx, 1)
}

function startEditStudent(idx: number, studentId: number | null, name: string, sex: Sex | null) {
  editedStudent.value = {
    isEditingNow: true,
    arrIdx: idx,
    name: name,
    sex: sex,
    id: studentId,
  }
}

function cancelEditStudent() {
  editedStudent.value = {
    isEditingNow: false,
    arrIdx: null,
    name: '',
    sex: null,
    id: null,
  }
}

function endEditStudent(idx: number, studentId: number | null) {
  const { id, name, sex } = editedStudent.value
  const checkIdUnique = id !== studentId
  if (isStudentValid({ id, name, sex }, { checkIdUnique })) {
    students.value[idx] = { id, name, sex }
    cancelEditStudent()
  }
}

/**하나씩 만들 땐 addStudent에서 검사, 엑셀로 한번에 올릴 땐 거기서 순회하면서 따로 검사해야 함 */
function isStudentValid({ id, name, sex }: Student, options?: { checkIdUnique?: boolean }) {
  const { addId, addSex } = fieldOptions.value
  const defaultOptions = {
    checkIdUnique: true,
  }
  const mergedOptions = { ...defaultOptions, ...options }
  if (addId === (id == null)) {
    alert('student ID should not be null..')
    return false
  } else if (addSex === (sex == null)) {
    alert('student sex should not be null..')
    return false
  } else if (name.length > 50 || name.length === 0) {
    alert('student name should not be longer than 50 and not empty')
    return false
  } else if (mergedOptions.checkIdUnique && id != null && studentIdSet.value.has(id)) {
    alert(`student ID should not be duplicated..`)
    return false
  }
  return true
}

function addStudent() {
  if (newStudent.value.isAddingNow) {
    const { id, name, sex } = newStudent.value
    if (isStudentValid({ id, name, sex })) {
      students.value.push({ id, name, sex })
      closeNewRow()
    }
  }
}

function openNewRow() {
  newStudent.value.isAddingNow = true
}
function closeNewRow() {
  newStudent.value = {
    isAddingNow: false,
    id: null,
    sex: null,
    name: '',
  }
}
</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-5 border p-4">
        <div class="row mb-5">
          <label for="inputClassName" class="col-sm-3 col-form-label"><strong>학급 이름</strong></label>
          <div class="col-sm-9">
            <input type="email" class="form-control" id="inputClassName" v-model="className" />
          </div>
        </div>
        <fieldset class="row mb-5">
          <legend class="col-form-label col-sm-3 pt-0"><strong>필드 설정</strong></legend>
          <div class="col-sm-9">
            <div class="form-check form-switch md-5">
              <input
                class="form-check-input"
                type="checkbox"
                role="switch"
                id="switchAddId"
                v-model="fieldOptions.addId"
              />
              <label class="form-check-label" for="switchAddId">번호 추가</label>
            </div>
            <div class="form-check form-switch pt-2">
              <input
                class="form-check-input"
                type="checkbox"
                role="switch"
                id="switchAddSex"
                v-model="fieldOptions.addSex"
              />
              <label class="form-check-label" for="switchAddSex">성별 추가</label>
            </div>
          </div>
        </fieldset>
      </div>
      <div class="col-7 border p-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <strong>학생 등록</strong>
          <button class="btn btn-success" @click="openNewRow">학생 추가</button>
        </div>
        <table class="table table-bordered text-center">
          <thead>
            <tr>
              <th scope="col" style="width: 15%" v-if="fieldOptions.addId">번호</th>
              <th scope="col">이름</th>
              <th scope="col" style="width: 20%" v-if="fieldOptions.addSex">성별</th>
              <th scope="col" style="width: 15%"></th>
            </tr>
          </thead>
          <tbody class="table-group-divider">
            <tr v-if="newStudent.isAddingNow">
              <td v-if="fieldOptions.addId">
                <label for="inputNewStudentId" hidden></label>
                <input type="number" min="0" class="form-control" id="inputNewStudentId" v-model="newStudent.id" />
              </td>
              <td>
                <label for="inputNewStudentName" hidden></label>
                <input type="text" class="form-control" id="inputNewStudentName" v-model="newStudent.name" />
              </td>
              <td v-if="fieldOptions.addSex">
                <div class="form-check form-check-inline">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="radioSexForNew"
                    :value="Sex.M"
                    id="radioMaleForNew"
                    v-model="newStudent.sex"
                  />
                  <label class="form-check-label" for="radioMaleForNew"> 남 </label>
                </div>
                <div class="form-check form-check-inline">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="radioSexForNew"
                    :value="Sex.F"
                    id="radioFemaleForNew"
                    v-model="newStudent.sex"
                  />
                  <label class="form-check-label" for="radioFemaleForNew"> 여 </label>
                </div>
              </td>
              <td>
                <button class="btn btn-success" @click="addStudent">a</button>
                <button class="btn btn-secondary" @click="closeNewRow">c</button>
              </td>
            </tr>
            <tr v-for="({ id, name, sex }, i) in students" :key="i">
              <td v-if="fieldOptions.addId && editedStudent.isEditingNow && editedStudent.arrIdx === i">
                <label for="inputEditedStudentId" hidden></label>
                <input
                  type="number"
                  min="0"
                  class="form-control"
                  id="inputEditedStudentId"
                  v-model="editedStudent.id"
                />
              </td>
              <td v-else-if="fieldOptions.addId">{{ id }}</td>

              <td v-if="editedStudent.isEditingNow && editedStudent.arrIdx === i">
                <label for="inputEditedStudentName" hidden></label>
                <input type="text" class="form-control" id="inputEditedStudentName" v-model="editedStudent.name" />
              </td>
              <td v-else>{{ name }}</td>

              <td v-if="fieldOptions.addSex && editedStudent.isEditingNow && editedStudent.arrIdx === i">
                <div class="form-check form-check-inline">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="radioSexForEdit"
                    :value="Sex.M"
                    id="radioMaleForEdit"
                    v-model="editedStudent.sex"
                  />
                  <label class="form-check-label" for="radioMaleForEdit"> 남 </label>
                </div>
                <div class="form-check form-check-inline">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="radioSexForEdit"
                    :value="Sex.F"
                    id="radioFemaleForEdit"
                    v-model="editedStudent.sex"
                  />
                  <label class="form-check-label" for="radioFemaleForEdit"> 여 </label>
                </div>
              </td>
              <td v-else-if="fieldOptions.addSex">{{ sex }}</td>
              <td>
                <button
                  class="btn btn-success"
                  v-if="editedStudent.isEditingNow && editedStudent.arrIdx === i"
                  @click="endEditStudent(i, id)"
                >
                  a
                </button>
                <button class="btn btn-warning" v-else @click="startEditStudent(i, id, name, sex)">e</button>
                <button class="btn btn-danger" @click="deleteStudent(i)">d</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
table {
  table-layout: fixed;
  width: 100%;
}
td {
  vertical-align: middle;
  overflow-wrap: anywhere;
}
</style>
