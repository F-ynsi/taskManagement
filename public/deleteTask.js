async function deleteTask() {
    const deleteTaskBody = document.querySelector('#deleteModalBody')
    const searchTaskByName = document.querySelector('#searchTaskByName')

    data = {
      id : deleteTaskBody.getAttribute("itemid"),
    }

    await fetch('http://localhost:8080/deleteTask', {
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
            addAlert(searchTaskByName, "alert alert-success", "Task has been successfully deleted!")
        } else {
            addAlert(searchTaskByName, "alert alert-danger", "There was an error. Try again!")
        }
    });
}