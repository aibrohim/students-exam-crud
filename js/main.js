const TOTAL_MARK = 150;
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

const renderStudent = function(student) {
  const { id, name: stName, lastName, mark, markedDate } = student;

  const studentRow = document.createElement("tr");

  const studentId = createElement("td", "py-3 text-center", id)
  const studentName = createElement("td", "py-3 fw-bold", `${stName} ${lastName}`);
  const studentMarkedDate = createElement("td", "py-3", showDate(markedDate));

  const markPercent = Math.round(mark * 100 / TOTAL_MARK);
  const studentMark = createElement("td", "py-3 text-center", markPercent + "%");

  const studentPassStatus = createElement("td", "py-3 text-center");
  const studentPassParagraph = createElement("p", "h5");
  const studentPassBadge = createElement("span", "badge rounded-pill")

  if (markPercent >= PASS_PERCENT) {
    studentPassBadge.textContent = "Pass";
    studentPassBadge.classList.add("bg-success");
  } else {
    studentPassBadge.textContent = "Fail";
    studentPassBadge.classList.add("bg-danger");
  }
  studentPassParagraph.append(studentPassBadge);
  studentPassStatus.append(studentPassParagraph);

  const studentEdit = createElement("td", "py-3 text-center");
  const studentEditBtn = createElement("button", "btn btn-outline-secondary");
  const studentEditIcon = createElement("i", "fa-solid fa-pen");
  studentEditBtn.append(studentEditIcon);
  studentEdit.append(studentEditBtn);

  const studentDel = createElement("td", "py-3 text-center");
  const studentDelBtn = createElement("button", "btn btn-outline-danger");
  const studentDelIcon = createElement("i", "fa-solid fa-trash");
  studentDelBtn.append(studentDelIcon);
  studentDel.append(studentDelBtn);

  appendChildren(studentRow, [studentId, studentName, studentMarkedDate, studentMark, studentPassStatus, studentEdit, studentDel]);

  return studentRow;
}

const studentsTable = document.querySelector("#students-table");
const studentsTableBody = document.querySelector("#students-table-body");


for (let i = 0; i < students.length; i++) {
  const currentStudent = students[i];
  
  const studentRow = renderStudent(currentStudent);

  studentsTableBody.append(studentRow);
}

const addForm = document.querySelector("#add-form");
const addStudentModalEl = document.querySelector("#edit-student-modal");
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

    addForm.reset();
    addStudentModal.hide();

    const studentRow = renderStudent(student);
    studentsTableBody.append(studentRow);
  }
});
