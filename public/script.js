let submit = document.getElementById('submit')
let ulList=document.getElementById('ulList')
let editForm= document.getElementById('editForm')
let priSelect= document.getElementById('prior')
let notesList=document.getElementById('notesList')
let notesForm= document.getElementById('notesForm')
var showNotesModal = document.getElementById("myModal")
var showNotesSpan = document.getElementsByClassName("close")[0];
var editModal = document.getElementById("myModal2")
var editSpan = document.getElementsByClassName("close2")[0];
var addNoteModal = document.getElementById("myModal3")
var addNoteSpan = document.getElementsByClassName("close3")[0];

submit.onclick = function() {
  addTodos()
}

//function to get all todos
async function getTodos(){
  var tomorrow = new Date();
  tomorrow.setDate(new Date().getDate()+1);
  var finalDate = tomorrow.toISOString().split('T')[0]
  document.getElementById('due').value=finalDate
  
  const resp =await fetch('/todos',{method:'GET'})
  const todos = await resp.json()
  todos.forEach(element => {
  var todoItem=document.createElement('li')
  todoItem.textContent=" TITLE:  "+ element.title +" , COMPLETED:  "+ element.status 
  +" , PRIORITY:  "+ element.priority +", DUE DATE: "+ element.due
  ulList.appendChild(todoItem)

  var editButton=document.createElement('INPUT')
  editButton.setAttribute('type','submit')
  editButton.setAttribute("value",'Edit Task')
  editButton.setAttribute("id","myEditBtn")
  editButton.setAttribute("onclick","showEditForm("+element.id+")")
  ulList.appendChild(editButton)

  var showNotesButton=document.createElement('INPUT')
  showNotesButton.setAttribute('type','submit')
  showNotesButton.setAttribute("value",'Show Notes')
  showNotesButton.setAttribute("id","myShowBtn")
  showNotesButton.setAttribute("onclick","showNotes("+element.id+")")
  ulList.appendChild(showNotesButton)

  var addNoteButton=document.createElement('INPUT')
  addNoteButton.setAttribute("type","submit")
  addNoteButton.setAttribute("value","Add Note")
  addNoteButton.setAttribute("id","myAddBtn")
  addNoteButton.setAttribute("onclick","showNotesForm("+element.id+")")
  ulList.appendChild(addNoteButton)

});
}

//function to add new todo(or task) in a list
async function addTodos() {
  
  var task = {
    title: document.getElementById('title').value,
    description:document.getElementById('desc').value,
    due: document.getElementById('due').value,
    priority: document.getElementById('priority').value
  }

const resp = await fetch('/todos', { method: 'POST' , body: JSON.stringify(task),
headers: { "Content-type": "application/json; charset=UTF-8"}})
alert("New Task Added")
location.reload();
}

//function to show edit form on clicking of edit button
async function showEditForm(taskId){

  var btn = document.getElementById("myEditBtn")

  const resp =await fetch(`/todos/${taskId}`,{method:'GET'})
  const todos = await resp.json()
 
  var dueDate= document.createElement('INPUT')
  dueDate.setAttribute("type","date")
  dueDate.setAttribute("value",todos.due)
  dueDate.setAttribute("id","newdate")
  editForm.appendChild(dueDate)

  var taskPriority= document.createElement('INPUT')
  taskPriority.setAttribute("type","text")
  taskPriority.setAttribute("value",todos.priority)
  taskPriority.setAttribute("id","newprior")
  editForm.appendChild(taskPriority)

  var taskStatus= document.createElement('INPUT')
  taskStatus.setAttribute("type","text")
  taskStatus.setAttribute("value",todos.status)
  taskStatus.setAttribute("id","newstatus")
  editForm.appendChild(taskStatus)

  var saveButton=document.createElement('INPUT')
  saveButton.setAttribute("type","submit")
  saveButton.setAttribute("value","save")
  saveButton.setAttribute("id","editSave")
  saveButton.setAttribute("onclick","updateTodos("+taskId+")")
  editForm.appendChild(saveButton)

  editModal.style.display= "block";
  editSpan.onclick = function() {
    editModal.style.display = "none";
    location.reload();
  }
  window.onclick = function(event) {
    if (event.target == editModal) {
        editModal.style.display = "none";
      location.reload();
    }
  }
}

//function to update a todo item
async function updateTodos(taskId){

  var task = {
    status: document.getElementById('newstatus').value,
    priority: document.getElementById('newprior').value,
    due:document.getElementById('newdate').value
  }
  alert("Task updated!")
  const resp = await fetch(`/todos/${taskId}`, { method: 'PATCH' , body: JSON.stringify(task),
  headers: { "Content-type": "application/json; charset=UTF-8"}})
}

//function to all show notes of a particular task
async function showNotes(taskId)
{
  showNotesModal.style.display= "block";
  const resp =await fetch(`/todos/${taskId}/notes`,{method:'GET'})
  const shownotes = await resp.json()
  var btn = document.getElementById("myShowBtn")

  console.log(shownotes.notes)
  shownotes.forEach(element=>{
    var notesItem=document.createElement('li')
    notesItem.textContent=element.notes
    notesItem.classList.toggle('newClass')
    notesList.appendChild(notesItem)
  });
  showNotesSpan.onclick = function() {
    showNotesModal.style.display = "none";
    location.reload()

  }
  window.onclick = function(event) {
    if (event.target == showNotesModal) {
        showNotesModal.style.display = "none"
      location.reload()
    }
  }
}

//function to show a form to add new note of a particular task
async function showNotesForm(taskId){
  console.log("...")
  var btn = document.getElementById("myAddBtn")
  addNoteModal.style.display= "block";
  var newNote= document.createElement('INPUT')
  newNote.setAttribute("type","text")
  newNote.setAttribute("id","data")
 
  notesForm.appendChild(newNote)

  var submitNote =document.createElement('INPUT')
  submitNote.setAttribute("type","submit")
  submitNote.setAttribute("value","Submit")
  submitNote.setAttribute("id","saveNote")
  submitNote.setAttribute("onclick","addNote("+taskId+")")

  notesForm.appendChild(submitNote)

  
  addNoteSpan.onclick = function() {
    addNoteModal.style.display = "none";
    location.reload();
  }
  window.onclick = function(event) {
    if (event.target == addNoteModal) {
        addNoteModal.style.display = "none";
      location.reload();
    }
  }
}

//function to add new note on a database after clicking on add button
async function addNote(taskId)
{
  var noteData={
    notesId:taskId,
    notes:document.getElementById('data').value
  }
  console.log(noteData.notes)
  alert("New Note added!")
  const resp = await fetch(`/todos/${taskId}/notes`, { method: 'POST' , body: JSON.stringify(noteData),
headers: { "Content-type": "application/json; charset=UTF-8"}})
}
