import { generateId } from "../helpers/idGenerator.js";
import {
  getAllQuestions,
  insertQuestions,
  deleteQuestions,
  updateQuestions,
} from "../requests/questionRequest.js";

const tblQuestionBody = document.querySelector("#tblQuestionBody tbody");
const btnQuestionSave = document.getElementById("btnQuestionSave");
const btnQuestionAdd = document.getElementById("btnQuestionAdd");
const btnQuestionModalClose = document.getElementById("btnQuestionModalClose");
const btnQuestionCloseIcon = document.querySelector(".btn-close");
const txtQuestionName = document.getElementById("txtQuestionName");
let openORedit = false;

export const bindQuestion = async () => {
  const questionData = await getAllQuestions();
  createQuestionTable(questionData);
};

export const initalizeQuestion = async () => {
  addQuestionEvents();
  await bindQuestion();
};

const addQuestionEvents = () => {
  btnQuestionSave.addEventListener("click", function () {
    if (openORedit === false) {
      insertQuestionItem();
    } else {
      sendDataToUpdate();
    }
  });
};

const insertQuestionItem = async () => {
  const allQuestions = await getAllQuestions();
  const question = txtQuestionName.value;
  const id = generateId(allQuestions);
  const row = {
    id,
    question,
  };
  await insertQuestions(row);
  bindQuestion();
};

const sendDataToUpdate = async () => {
  const id = document.getElementById("secondQuestionHiddenInput").value;
  const question = txtQuestionName.value;
  const row = {
    id,
    question,
  };
  await updateQuestions(row);
  deleteAllInputs();
  bindQuestion();
  txtQuestionName.value = "";
};

const prepareQuestionUpdateAction = async (e) => {
  openORedit = true;
  const id = e.target.querySelector("input").value;
  await getAllQuestions().then((x) =>
    x.filter((y) => {
      if (y.id == id) {
        txtQuestionName.value = y.question;
      }
    })
  );
};

btnQuestionAdd.addEventListener("click", function () {
  openORedit = false;
});

btnQuestionModalClose.addEventListener("click", function () {
  if (openORedit === true) {
    deleteAllInputs();
  }
});
btnQuestionCloseIcon.addEventListener("click", function () {
  if (openORedit === true) {
    deleteAllInputs();
  }
});
function deleteAllInputs() {
  const deleteInput = document.getElementById("secondQuestionHiddenInput");
  document.getElementById("btnQuestionSave").removeChild(deleteInput);
}
const deleteQuestionRow = async (e) => {
  const id = e.target.dataset.rowId;
  console.log(id);
  await deleteQuestions(id);
  await bindQuestion().createQuestionTable;
};
const createQuestionTable = (rows, e) => {
  tblQuestionBody.innerHTML = "";
  rows.forEach((row) => {
    const tr = createRow(row);
    tblQuestionBody.appendChild(tr);
  });
};

const createRow = (data) => {
  let tr = document.createElement("tr");
  let tdEdit = document.createElement("td");
  let tdRemove = document.createElement("td");
  let tdId = document.createElement("td");
  let tdName = document.createElement("td");
  let hiddenQuestionInput = document.createElement("input");
  let secondQuestionhiddenInput = document.createElement("input");
  let iconEdit = document.createElement("i");
  iconEdit.className = "fa-solid operation-icon fa-edit text-warning";
  hiddenQuestionInput.setAttribute("type", "hidden");
  hiddenQuestionInput.value = data.id;

  secondQuestionhiddenInput.setAttribute("type", "hidden");
  secondQuestionhiddenInput.setAttribute("id", "secondQuestionHiddenInput");
  secondQuestionhiddenInput.value = data.id;
  iconEdit.setAttribute("data-bs-toggle", "modal");
  iconEdit.setAttribute("data-bs-target", "#questionAddEditModal");
  iconEdit.appendChild(hiddenQuestionInput);
  iconEdit.addEventListener("click", function (e) {
    prepareQuestionUpdateAction(e);
    btnQuestionSave.appendChild(secondQuestionhiddenInput);
  });
  let iconRemove = document.createElement("i");
  iconRemove.className = "fa-solid operation-icon fa-trash-alt text-warning";
  iconRemove.addEventListener("click", deleteQuestionRow);
  iconRemove.setAttribute("data-row-id", data.id);

  tdEdit.appendChild(iconEdit);
  tdRemove.appendChild(iconRemove);

  tdId.textContent = data.id;
  tdName.textContent = data.question;

  tr.appendChild(tdEdit);
  tr.appendChild(tdRemove);
  tr.appendChild(tdId);
  tr.appendChild(tdName);

  return tr;
};
