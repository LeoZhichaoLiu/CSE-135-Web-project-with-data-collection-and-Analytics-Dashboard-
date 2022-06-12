window.onload = loadHandler;

function loadHandler() {
  if(usersRaw) {
    let users = JSON.parse(usersRaw);
    
    users.forEach(element => {
      delete element.salt;
    });
    
    document.querySelector('zing-grid').data = users;
    
    const grid = document.querySelector('zing-grid');
    grid.addEventListener('data:record:delete', (e) => { 
      deleteUser(e.detail.ZGData.data.email);
    });
    grid.addEventListener('data:record:insert', (e) => { 
      createUser(e.detail.ZGData.data.email, e.detail.ZGData.data.username, e.detail.ZGData.data.password, e.detail.ZGData.data.type);
    });
    grid.addEventListener('data:record:change', (e) => { 
      updateUser(e.detail.ZGData.oldData.email, e.detail.ZGData.data.email, e.detail.ZGData.data.username, e.detail.ZGData.data.password, e.detail.ZGData.data.type);
    });
  }
}

function createUser(email, username, password, type) {
  let request = new XMLHttpRequest();
  request.addEventListener("load", () => {});
  request.open("POST", "https://reporting.cse135-chadjunleo.site/hw4/users-edit.php");
  request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  request.send(`email=${email}&username=${username}&password=${password}&type=${type}`);
}

function updateUser(oldEmail, email, username, password, type) {
  let request = new XMLHttpRequest();
  request.addEventListener("load", () => {});
  request.open("PUT", "https://reporting.cse135-chadjunleo.site/hw4/users-edit.php");
  request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  request.send(`old_email=${oldEmail}&email=${email}&username=${username}&password=${password}&type=${type}`);
}

function deleteUser(email) {
  let request = new XMLHttpRequest();
  request.addEventListener("load", () => {});
  request.open("DELETE", "https://reporting.cse135-chadjunleo.site/hw4/users-edit.php");
  request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  request.send(`email=${email}`);
}