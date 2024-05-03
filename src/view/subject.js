import { generateId } from "../helpers/idGenerator.js";
import { getAllSubjects, insertSubject, deleteSubject, updateSubject } from "../requests/insertSubject.js";

const tblSubjectBody = document.querySelector('#tblSubject tbody')
const btnSubjectSave = document.getElementById('btnSubjectSave')
const btnSubjectAdd = document.getElementById('btnSubjectAdd')
const btnSubjectClose = document.getElementById('btnSubjectModalClose')
const btnSubjectCloseIcon = document.querySelector('.btn-close')
const txtSubjectName = document.getElementById('txtSubjectName');
let openORedit = false;

export const bindSubjects = async() => {
    const subjectsData = await getAllSubjects();
    createSubjectTable(subjectsData)
}
export const initalizeSubjects = async () => {
    addSubjectEvents()
    await bindSubjects()
}
const addSubjectEvents = () => {
    btnSubjectSave.addEventListener('click',  function(){
        if (openORedit === false) {
            insertSubjectItem()
        }else{
            sendDataToUpdate()
        }
    })
}

const insertSubjectItem = async () => {
    const allSubjects = await getAllSubjects();
    const name = txtSubjectName.value
    const id = generateId(allSubjects)
    const row = {
        id,
        name
    }
    await insertSubject(row)
    bindSubjects()
}

const sendDataToUpdate =async()=>{
    const id = document.getElementById('secondHiddenInput').value;
    const name = txtSubjectName.value
    const row ={
        id,
        name
    }
    await updateSubject(row)
    deleteAllInputs()
    bindSubjects()
    txtSubjectName.value = ''
}
const prepareSubjectUpdateAction =(e)=>{
    openORedit = true
    const id = e.target.querySelector('input').value;
    getAllSubjects().then(x=>x.filter(y=>{
        if (y.id == id) {
            txtSubjectName.value =  y.name
        }})
    )   
}
btnSubjectAdd.addEventListener("click",function () {
    openORedit = false;
})
btnSubjectClose.addEventListener("click",function () {
    if (openORedit===true) {
        deleteAllInputs()
    }}
 )
btnSubjectCloseIcon.addEventListener("click",function () { 
    if (openORedit===true) {
        deleteAllInputs()
    }} 
)
function deleteAllInputs (){
    const deleteInput = document.getElementById("secondHiddenInput")
    document.getElementById('btnSubjectSave').removeChild(deleteInput)
}
const deleteSubjectRow = async(e) => {
    const id = e.target.dataset.rowId;
    await deleteSubject(id)
    await bindSubjects()
}
const createSubjectTable = rows => {
    tblSubjectBody.innerHTML = ''
    rows.forEach(row=>{
        const tr = createRow(row)
        tblSubjectBody.appendChild(tr)
    })
}
const createRow = data => {
    let tr = document.createElement('tr');
    let tdEdit = document.createElement('td');
    let tdRemove = document.createElement('td');
    let tdId = document.createElement('td');
    let tdName = document.createElement('td');
    let hiddenInput = document.createElement('input')
    let secondhiddenInput = document.createElement('input')

    let iconEdit = document.createElement('i');
    iconEdit.className = 'fa-solid operation-icon fa-edit text-warning';

    hiddenInput.setAttribute("type","hidden");
    hiddenInput.value = data.id;
    secondhiddenInput.setAttribute("type","hidden");
    secondhiddenInput.setAttribute("id","secondHiddenInput");
    secondhiddenInput.value = data.id;

    iconEdit.setAttribute('data-bs-toggle', 'modal');
    iconEdit.setAttribute('data-bs-target', '#subjectAddEditModal');
    iconEdit.appendChild(hiddenInput);
    iconEdit.addEventListener('click', 
    function(e){
        prepareSubjectUpdateAction(e);
        btnSubjectSave.appendChild(secondhiddenInput)

    });

    let iconRemove = document.createElement('i');
    iconRemove.className = 'fa-solid operation-icon fa-trash-alt text-warning';
    iconRemove.addEventListener('click', deleteSubjectRow);
    iconRemove.setAttribute('data-row-id', data.id);

    tdEdit.appendChild(iconEdit);
    tdRemove.appendChild(iconRemove);

    tdId.textContent = data.id;
    tdName.textContent = data.name;
  
    tr.appendChild(tdEdit);
    tr.appendChild(tdRemove);
    tr.appendChild(tdId);
    tr.appendChild(tdName);
    return tr;
}