function searchTask() {
    const url = new URL('http://localhost:8080/searchTaskByName/')
    const searchTaskView = document.querySelector('#searchTaskByName')
    const paramsObj = {
      nameSearch : searchTaskView.querySelector('input[name="nameSearch"]').value,
    }
    const searchParams = new URLSearchParams(paramsObj);
    const nameSearch = searchParams.get("nameSearch");

  fetch(url + nameSearch, {
  }).then(res => res.json()
  ).then(
    result => {
        if (result.hasError){
            addAlert(searchTaskView, "alert alert-danger", "Oops, something went wrong!")
        } else {
            if(result.tasks.length == 0) {
                const message = `No task with the name <i><strong>"${nameSearch}"</strong></i> found!`
                addAlert(searchTaskView, "alert alert-warning", message)
            } else {
                showTasks(searchTaskView, result.tasks)
            }
        }
        showNewSearchButton()
    }
  );
}

function showTasks(parentElement, tasks) {
    parentElement.innerHTML = ""
    const tableStructure = createTableStructure()
    parentElement.appendChild(tableStructure)
    const tableBody = document.querySelector("#taskViewTableBody")

    tasks.map((task, index) => {
        populateTaskTable(index, tableBody, task)
    })
}

function populateTaskTable(index, tableBody, task) {
    const row = document.createElement("tr");
    row.setAttribute("itemid", task.id)
    
    const head = document.createElement("th");
    head.scope = "row";
    head.innerHTML = parseInt(index) + 1;
    
    const nameColumn = document.createElement("td");
    nameColumn.className = "text-center";
    nameColumn.innerHTML = task.name
    
    const descriptionColumn = document.createElement("td");
    descriptionColumn.className = "text-center";
    descriptionColumn.innerHTML = task.description
    
    const totalDurationColumn = document.createElement("td");
    totalDurationColumn.className = "text-center";
    totalDurationColumn.innerHTML = task.totalDuration
    
    const editButtonColumn = document.createElement("td");
    editButtonColumn.className = "text-center";
    const editButton = document.createElement("button")
    editButton.className = "btn btn-link"
    editButton.setAttribute("id", `editButton_"${task.id}"`)
    editButton.setAttribute("data-bs-toggle", "modal")
    editButton.setAttribute("data-bs-target", "#editModal")
    editButton.setAttribute("onclick", "fillEditModal(this)")
    editButton.type = "button"
    editButton.innerHTML = "Edit"
    editButtonColumn.appendChild(editButton)
          
    const deleteButtonColumn = document.createElement("td");
    deleteButtonColumn.className = "text-center";
   const deleteButton = document.createElement("button")
    deleteButton.className = "btn btn-link"
    deleteButton.setAttribute("id", `deleteButton_"${task.id}"`)
    deleteButton.setAttribute("data-bs-toggle", "modal")
    deleteButton.setAttribute("data-bs-target", "#deleteConfirmationModal")
    deleteButton.setAttribute("onclick", "fillDeleteModal(this)")
    deleteButton.type = "button"
    deleteButton.innerHTML = "Delete"
    deleteButtonColumn.appendChild(deleteButton)

    row.appendChild(head)
    row.appendChild(nameColumn)
    row.appendChild(descriptionColumn)
    row.appendChild(totalDurationColumn)
    row.appendChild(editButtonColumn)
    row.appendChild(deleteButtonColumn)

    tableBody.appendChild(row)

}

function createTaskOnClick(e) {
    const currentRow = e.parentElement.parentElement
    const taskId = currentRow.getAttribute('itemid')
    const rowCells = currentRow.getElementsByTagName('td')
    const task = {
        id: taskId,
        name: rowCells[0].innerHTML,
        description: parseInt(rowCells[1].innerHTML),
        totalDuration: parseInt(rowCells[2].innerHTML),
    };

    return task
}

function fillEditModal(e) {
    const task = createTaskOnClick(e)
    setModalValuesForEdit(task)
}

function fillDeleteModal(e) {
     const task = createTaskOnClick(e)
     prepareForRemoval(task)
}

function createTableStructure() {
  const responsiveTableContainer = document.createElement("div")
  responsiveTableContainer.className = "table-responsive"
  const table = document.createElement("table");
  table.className = "table table-striped"
  const tableHead = document.createElement("thead")
  const tableBody = document.createElement("tbody")
  tableBody.id = "taskViewTableBody"

  const row = document.createElement("tr");
  const headId = document.createElement("th");
  headId.scope = "col";
  headId.className = "text-center"
  headId.innerHTML = "#";
  
  const headName = document.createElement("th");
  headName.scope = "col";
  headName.className = "text-center"
  headName.innerHTML = "Name";

  const headDescription = document.createElement("th");
  headDescription.scope = "col";
  headDescription.className = "text-center"
  headDescription.innerHTML = "Description";

  const headTotalDuration = document.createElement("th");
  headTotalDuration.scope = "col";
  headTotalDuration.className = "text-center"
  headTotalDuration.innerHTML = "Total Distribution"

  const headEditButton = document.createElement("th");
  headTotalDuration.scope = "col";
  headTotalDuration.className = "text-center"
  
  const headDeleteButton = document.createElement("th");
  headDeleteButton.scope = "col";
  headDeleteButton.className = "text-center"

  row.appendChild(headId)
  row.appendChild(headName)
  row.appendChild(headDescription)
  row.appendChild(headTotalDuration)
  row.appendChild(headEditButton)
  row.appendChild(headDeleteButton)

  tableHead.appendChild(row)
  table.appendChild(tableHead)
  table.appendChild(tableBody)
  responsiveTableContainer.appendChild(table)

  return responsiveTableContainer
}

function setModalValuesForEdit(task) {
    document.querySelector('#editTaskForm').setAttribute("itemid", task.id)
    const editModalName = document.querySelector('#editModalName')
    editModalName.value = task.name
    const editModalDescription = document.querySelector('#editModalDescription')
    editModalDescription.value = task.description
    const editModalTotalDuration = document.querySelector('#editModalTotalDuration')
    editModalTotalDuration.value = task.totalDuration

    editModalName.addEventListener('input', handleEditButton.bind(event, task));
    editModalDescription.addEventListener('input', handleEditButton.bind(event, task));
    editModalTotalDuration.addEventListener('input', handleEditButton.bind(event, task));
}

function prepareForRemoval(task) {
    const deleteModalBody = document.querySelector('#deleteModalBody')
    deleteModalBody.setAttribute("itemid", task.id)
    deleteModalBody.innerHTML = `Do you want to delete task <i><strong>"${task.name}"</strong></i>?`
}

function showNewSearchButton() {
    const searchTaskButton = document.querySelector('#searchTaskButton')
    searchTaskButton.innerHTML = "Start New Search"
    searchTaskButton.className = "btn btn-link mt-4"
    searchTaskButton.onclick = function () {
        location.href = "/searchTask.html";
    }
}

async function editTask() {
    const editTaskForm = document.querySelector('#editTaskForm')
    const editButton = document.querySelector('#editTaskButton')
    const searchTaskByName = document.querySelector('#searchTaskByName')
    data = {
      id : editTaskForm.getAttribute("itemid"),
      name : editTaskForm.querySelector('input[name="name"]').value,
      description : editTaskForm.querySelector('input[name="description"]').value,
      totalDuration : editTaskForm.querySelector('input[name="totalDuration"]').value,
    }

    await fetch('http://localhost:8080/editTask', {
        method: 'POST',
        mode: 'cors',
        cache: 'reload',
        credentials: 'same-origin',
        headers: {'Content-Type': 'application/json'},
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data)
    }).then(res => res.json())
    .then( result => {
        if(result.isSuccessful) {
            addAlert(searchTaskByName, "alert alert-success", "Task has been successfully updated!")
        } else {
            addAlert(searchTaskByName, "alert alert-danger", "There was an error. Try again!")
        }
    });
}

function handleEditButton(task) {
    const editFormData = new FormData(document.querySelector('#editTaskForm'))
    const editButton = document.querySelector('#editTaskButton')

    if (isTaskEqualToFormData(task, editFormData) || hasEmptyField(editFormData)) {
        editButton.disabled = true;
    } else {
        editButton.disabled = false;
    }
}

function hasEmptyField(formData) {
    return formData.get("name") === "" || formData.get("description") === "" || formData.get("totalDuration") === ""
}

function isTaskEqualToFormData(task, formData) {
    return task.name === formData.get("name") &&
        task.description === parseInt(formData.get("description")) &&
        task.totalDuration === parseInt(formData.get("totalDuration"));
}

window.onload = function() {
    document.querySelector('#nameSearch').addEventListener('input', success.bind(event, "searchTaskButton"));
}
