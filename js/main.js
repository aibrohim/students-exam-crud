const TOTAL_MARK = 150;
const TOTAL_MARK_PERCENT = 100;
const PASS_PERCENT = 40;

const createElement = function(elName, className, textContent) {
  const createdElement = document.createElement(elName);
  createdElement.className = className;

  if (textContent) {
    createdElement.textContent = textContent;
  }

  return createdElement
}

const appendChildren = function(parentElement, children) {
  for (let i = 0; i < children.length; i++) {
    parentElement.append(children[i])
  }
}

const addZero = function(number) {
  return number < 10 ? "0" + number : number
}

const showDate = function(dateString) {
  const date = new Date(dateString);

  return `${addZero(date.getDate())}.${addZero(date.getMonth() + 1)}.${date.getFullYear()} ${addZero(date.getHours())}:${addZero(date.getMinutes())}`;
}

const studentTemplate = document.querySelector("#student-template")

const renderStudent = function(student) {
  const { id, name: stName, lastName, mark, markedDate } = student;

  const studentRow = studentTemplate.content.cloneNode(true);

  // const studentId = studentRow.querySelector(".student-id");
  // studentId.textContent = id;

  studentRow.querySelector(".student-id").textContent = id;
  
  // const studentName = studentRow.querySelector(".student-name");
  // studentName.textContent = `${stName} ${lastName}`

  studentRow.querySelector(".student-name").textContent = `${stName} ${lastName}`;

  // const studentMarkedDate = studentRow.querySelector(".student-marked-date")
  // studentMarkedDate.textContent = showDate(markedDate);

  studentRow.querySelector(".student-marked-date").textContent = showDate(markedDate);

  const markPercent = Math.round(mark * TOTAL_MARK_PERCENT / TOTAL_MARK);
  // const studentMark = studentRow.querySelector(".student-mark");
  // studentMark.textContent = markPercent + "%"
  studentRow.querySelector(".student-mark").textContent = markPercent + "%";


  const studentPassBadge = studentRow.querySelector(".student-pass-status");

  if (markPercent >= PASS_PERCENT) {
    studentPassBadge.textContent = "Pass";
    studentPassBadge.classList.add("bg-success");
  } else {
    studentPassBadge.textContent = "Fail";
    studentPassBadge.classList.add("bg-danger");
  }

  const studentEditBtn = studentRow.querySelector(".student-edit")
  studentEditBtn.setAttribute("data-id", id);

  const studentDeleteBtn = studentRow.querySelector(".student-delete")
  studentDeleteBtn.setAttribute("data-id", id);

  return studentRow;
}

let showingStudents = students.slice();

const studentsTable = document.querySelector("#students-table");
const studentsTableBody = studentsTable.querySelector("#students-table-body");
const elCount = document.querySelector(".count");

const renderStudents = function() {
  studentsTableBody.innerHTML = "";

  elCount.textContent = `Count: ${showingStudents.length}`;
  
  const studentsFragment = document.createDocumentFragment();
  showingStudents.forEach(function(student) {
    const studentRow = renderStudent(student);
    studentsFragment.append(studentRow);
  });

  studentsTableBody.append(studentsFragment)
}

const nameEdit = document.querySelector("#edit-name");
const lastNameEdit = document.querySelector("#edit-lastname");
const markEdit = document.querySelector("#edit-mark");

const editForm = document.querySelector("#edit-form");
const editStudentModalEl = document.querySelector("#edit-student-modal");
const editStudentModal = new bootstrap.Modal(editStudentModalEl);

studentsTable.addEventListener("click", function(evt) {
  if (evt.target.matches(".btn-outline-danger")) {
    const clickedItemId = +evt.target.dataset.id;

    const clickedItemIndex = students.findIndex(function(student) {
      return student.id === clickedItemId
    })

    showingStudents.splice(clickedItemIndex, 1);
    students.splice(clickedItemIndex, 1);

    renderStudents();
  } else if (evt.target.matches(".btn-outline-secondary")) {
    const clickedId = +evt.target.dataset.id;

    const clickedItem = students.find(function(student) {
      return student.id === clickedId
    })

    nameEdit.value = clickedItem.name;
    lastNameEdit.value = clickedItem.lastName;
    markEdit.value = clickedItem.mark;

    editForm.setAttribute("data-editing-id", clickedItem.id)
  }
})

renderStudents();

const addForm = document.querySelector("#add-form");
const addStudentModalEl = document.querySelector("#add-student-modal");
const addStudentModal = new bootstrap.Modal(addStudentModalEl);

addForm.addEventListener("submit", function(evt) {
  evt.preventDefault();

  const elements = evt.target.elements;

  const nameValue = elements.name.value;
  const lastNameValue = elements.lastname.value;
  const markValue = +elements.mark.value;

  if (nameValue.trim() && lastNameValue.trim() && markValue >= 0 && markValue <= TOTAL_MARK) {
    const student = {
      id: Math.floor(Math.random() * 1000),
      name: nameValue,
      lastName: lastNameValue,
      mark: markValue,
      markedDate: new Date().toISOString(),
    }

    students.push(student);
    localStorage.setItem("students", JSON.stringify(students));
    showingStudents.push(student);

    addForm.reset();
    addStudentModal.hide();

    renderStudents();
  }
});


editForm.addEventListener("submit", function(evt) {
  evt.preventDefault();

  const editingId = +evt.target.dataset.editingId;

  const nameValue = nameEdit.value;
  const lastNameValue = lastNameEdit.value;
  const markValue = +markEdit.value;

  if (nameValue.trim() && lastNameValue.trim() && markValue >= 0 && markValue <= TOTAL_MARK) {
    const student = {
      id: editingId,
      name: nameValue,
      lastName: lastNameValue,
      mark: markValue,
      markedDate: new Date().toISOString(),
    }

    const editingItemIndex = students.findIndex(function(student) {
      return student.id === editingId
    });

    const editingShowItemIndex = showingStudents.findIndex(function(student) {
      return student.id === editingId
    });

    students.splice(editingItemIndex, 1, student);
    showingStudents.splice(editingShowItemIndex, 1, student);

    editForm.reset();
    editStudentModal.hide();

    renderStudents();
  }
});

const filterForm = document.querySelector(".filter");

filterForm.addEventListener("submit", function(evt) {
  evt.preventDefault();

  const elements = evt.target.elements;

  const fromValue = elements.from.value;
  const toValue = elements.to.value;
  const searchValue = elements.search.value;
  const sortValue = elements.sortby.value

  // const filtredStudents = students
  //   .filter(function(student) {
  //     const studentMarkPercent = Math.round(student.mark * TOTAL_MARK_PERCENT / TOTAL_MARK)
  //     return studentMarkPercent >= fromValue;
  //   })
  //   .filter(function(student) {
  //     const studentMarkPercent = Math.round(student.mark * TOTAL_MARK_PERCENT / TOTAL_MARK)

  //     return !toValue ? true : studentMarkPercent <= toValue;
  //   })
  //   .filter(function(student) {
  //     const searchRegExp = new RegExp(searchValue, "gi");
  //     const nameLastName = `${student.name} ${student.lastName}`;
  //     // return student.name.toLowerCase().includes(searchValue.toLowerCase())
  //     return nameLastName.match(searchRegExp) || student.lastName.match(searchRegExp);
  //   });

  showingStudents = students
    .sort(function(a, b) {
      switch (sortValue) {
        case "1":
          if (a.name > b.name) {
            return 1
          } else if (a.name < b.name) {
            return -1
          } else {
            return 0
          }
        case "2":
          return b.mark - a.mark
        case "3":
          return a.mark - b.mark
        case "4":
          return new Date(a.markedDate).getTime() - new Date(b.markedDate).getTime();
        default:
          break;
      }
      // if (sortValue === "2") {
      //   return b.mark - a.mark;
      // } else if (sortValue === "3") {
      //   return a.mark - b.mark;
      // }
    })
    .filter(function(student) {
      const studentMarkPercent = Math.round(student.mark * TOTAL_MARK_PERCENT / TOTAL_MARK)

      const searchRegExp = new RegExp(searchValue, "gi");
      const nameLastName = `${student.name} ${student.lastName}`;

      const toMarkCondition = !toValue ? true : studentMarkPercent <= toValue;

      return studentMarkPercent >= fromValue && toMarkCondition && nameLastName.match(searchRegExp)
    })

  renderStudents();
})