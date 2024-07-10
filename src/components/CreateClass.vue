<script setup lang="ts">
import { reactive, ref } from 'vue'
import { type Student, Sex } from '@/types'
const className = ref('')

const options = reactive({
  addId: true,
  addSex: true,
})
const students: Student[] = reactive([])

const studentIdSet = new Set()
const editedStudent: Student & { isEditingNow: boolean; arrIdx: number | null } = reactive({
  isEditingNow: false,
  arrIdx: null,
  name: '',
  id: null,
  sex: null,
})
const newStudent: Student & { isAddingNow: boolean } = reactive({
  isAddingNow: false,
  name: '',
  id: null,
  sex: null,
})

function deleteStudent(idx: number, studentId: number | null) {
  if (editedStudent.isEditingNow && editedStudent.arrIdx === idx) {
    cancelEditStudent()
  }
  students.splice(idx, 1)
  studentIdSet.delete(studentId)
}

function startEditStudent(idx: number, studentId: number | null, name: string, sex: Sex | null) {
  editedStudent.isEditingNow = true
  editedStudent.arrIdx = idx
  editedStudent.name = name
  editedStudent.sex = sex
  editedStudent.id = studentId
}

function cancelEditStudent() {
  editedStudent.isEditingNow = false
  editedStudent.arrIdx = null
  editedStudent.name = ''
  editedStudent.sex = null
  editedStudent.id = null
}

function endEditStudent(idx: number, studentId: number | null) {
  const { id, name, sex } = editedStudent
  studentIdSet.delete(studentId)
  if (isStudentValid({ id, name, sex })) {
    students[idx] = { id, name, sex }
    cancelEditStudent()
  } else {
    studentIdSet.add(studentId)
  }
}

/**하나씩 만들 땐 addStudent에서 검사, 엑셀로 한번에 올릴 땐 거기서 순회하면서 따로 검사해야 함 */
function isStudentValid({ id, name, sex }: Student) {
  if (options.addId === (id == null)) {
    alert('student ID should not be null..')
    return false
  } else if (options.addSex === (sex == null)) {
    alert('student sex should not be null..')
    return false
  } else if (name.length > 50 || name.length === 0) {
    alert('student name should not be longer than 50 and not empty')
    return false
  } else if (id != null && studentIdSet.has(id)) {
    alert(`student ID should not be duplicated..`)
    return false
  }
  return true
}

function addStudent() {
  if (newStudent.isAddingNow) {
    const { id, name, sex } = newStudent
    if (isStudentValid({ id, name, sex })) {
      students.push({ id, name, sex })
      studentIdSet.add(id)
      closeNewRow()
    }
  }
}

function openNewRow() {
  newStudent.isAddingNow = true
}
function closeNewRow() {
  newStudent.isAddingNow = false
  newStudent.id = null
  newStudent.sex = null
  newStudent.name = ''
}

function closeStudentInputs() {
  closeNewRow()
  cancelEditStudent()
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
              <input class="form-check-input" type="checkbox" role="switch" id="switchAddId" v-model="options.addId" />
              <label class="form-check-label" for="switchAddId">번호 추가{{ options.addId }}</label>
            </div>
            <div class="form-check form-switch pt-2">
              <input
                class="form-check-input"
                type="checkbox"
                role="switch"
                id="switchAddSex"
                v-model="options.addSex"
              />
              <label class="form-check-label" for="switchAddSex">성별 추가{{ options.addSex }}</label>
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
              <th scope="col" style="width: 15%" v-if="options.addId">번호</th>
              <th scope="col">이름</th>
              <th scope="col" style="width: 20%" v-if="options.addSex">성별</th>
              <th scope="col" style="width: 15%"></th>
            </tr>
          </thead>
          <tbody class="table-group-divider">
            <tr v-if="newStudent.isAddingNow">
              <td v-if="options.addId">
                <label for="inputNewStudentId" hidden></label>
                <input type="number" min="0" class="form-control" id="inputNewStudentId" v-model="newStudent.id" />
              </td>
              <td>
                <label for="inputNewStudentName" hidden></label>
                <input type="text" class="form-control" id="inputNewStudentName" v-model="newStudent.name" />
              </td>
              <td v-if="options.addSex">
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
              <td v-if="editedStudent.isEditingNow && editedStudent.arrIdx === i">
                <label for="inputEditedStudentId" hidden></label>
                <input
                  type="number"
                  min="0"
                  class="form-control"
                  id="inputEditedStudentId"
                  v-model="editedStudent.id"
                />
              </td>
              <td v-else-if="options.addId">{{ id }}</td>

              <td v-if="editedStudent.isEditingNow && editedStudent.arrIdx === i">
                <label for="inputEditedStudentName" hidden></label>
                <input type="text" class="form-control" id="inputEditedStudentName" v-model="editedStudent.name" />
              </td>
              <td v-else>{{ name }}</td>

              <td v-if="editedStudent.isEditingNow && editedStudent.arrIdx === i">
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
              <td v-else-if="options.addSex">{{ sex }}</td>
              <td>
                <button
                  class="btn btn-success"
                  v-if="editedStudent.isEditingNow && editedStudent.arrIdx === i"
                  @click="endEditStudent(i, id)"
                >
                  a
                </button>
                <button class="btn btn-warning" v-else @click="startEditStudent(i, id, name, sex)">e</button>
                <button class="btn btn-danger" @click="deleteStudent(i, id)">d</button>
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
