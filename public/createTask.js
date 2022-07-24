async function createTask() {
    const createTaskForm = document.querySelector('#createTaskForm')
    const createTaskView = document.querySelector('#createTaskView')
    data = {
      name : createTaskForm.querySelector('input[name="name"]').value,
      description : createTaskForm.querySelector('input[name="description"]').value,
      totalDuration : createTaskForm.querySelector('input[name="totalDuration"]').value,
    }

  await fetch('http://localhost:8080/createTask', {
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
        addAlert(createTaskView, "alert alert-success", "Task has been successfully created!")
    } else {
        addAlert(createTaskView, "alert alert-danger", 'A task with this name exists!')
    }
  })
  .catch(error => {
    console.log(error)
    addAlert(createTaskView, "alert alert-danger", "There was an error. Try again!")
  })
  .finally(() =>
    showCreateAnotherTaskButton()
  );
}

function showCreateAnotherTaskButton() {
    const createTaskButton = document.getElementById('createTaskButton')
    createTaskButton.innerHTML = "Create Another Task"
    createTaskButton.className = "btn btn-link mt-4"
    createTaskButton.onclick = function () {
        location.href = "/createTask.html";
    }
}
