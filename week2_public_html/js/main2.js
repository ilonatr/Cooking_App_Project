'use strict';
const url = 'http://localhost:3000'; // change url when uploading to server

// select existing html elements
const addForm = document.querySelector('#addPhotoForm');
const modForm = document.querySelector('#modPhotoForm');
const ul = document.querySelector('ul');
const userLists = document.querySelectorAll('.add-owner');

// create photo cards
const createPhotoCards = (photos) => {

  // clear ul
  ul.innerHTML = '';
  photos.forEach((photo) => {
    // create li with DOM methods
    const img = document.createElement('img');
    img.src = url + '/' + photo.filename;
    img.alt = photo.id;
    img.classList.add('resp');

    const figure = document.createElement('figure').appendChild(img);

    /*const h2 = document.createElement('h2');
    h2.innerHTML = photo.ownername;
     */

    const p1 = document.createElement('p');
    p1.innerHTML = `User: ${photo.ownername}`;

    const p2 = document.createElement('p');
    p2.innerHTML = `Caption: ${photo.caption}`;

    /*const p3 = document.createElement('p');
    p3.innerHTML = `${photo.timestamp}`;
*/



    // add selected photo's values to modify form
    const modButton = document.createElement('button');
    modButton.innerHTML = 'Modify';
    modButton.addEventListener('click', () => {
      const inputs = modForm.querySelectorAll('input');
      inputs[0].value = photo.ownername;
      inputs[1].value = user.id;
      inputs[2].value = photo.caption;
      //inputs[3].value = photo.id;
      modForm.querySelector('select').value = photo.owner;
    });

    // delete selected photo
    const delButton = document.createElement('button');
    delButton.innerHTML = 'Delete';
    delButton.addEventListener('click', async () => {
      const fetchOptions = {
        method: 'DELETE',
      };
      try {
        const response = await fetch(url + '/photo/' + photos.id, fetchOptions);
        const json = await response.json();
        console.log('delete response', json);
        getPhoto();
      }
      catch (e) {
        console.log(e.message);
      }
    });

    const li = document.createElement('li');
    li.classList.add('light-border');

    //li.appendChild(h2);
    li.appendChild(figure);
    li.appendChild(p1);
    li.appendChild(p2);
    //li.appendChild(p3);
    //li.appendChild(modButton);
    //li.appendChild(delButton);
    ul.appendChild(li);
  });
};

// AJAX call
const getPhoto = async () => {
  try {
    const response = await fetch(url + '/photo');
    const photos = await response.json();
    createPhotoCards(photos);
  }
  catch (e) {
    console.log(e.message);
  }
};
getPhoto();

// create user options to <select>
const createUserOptions = (users) => {
  userLists.forEach((list) => {
    // clear user list
    list.innerHTML = '';
    users.forEach((user) => {
      // create options with DOM methods
      const option = document.createElement('option');
      option.value = user.id;
      option.innerHTML = user.name;
      option.classList.add('light-border');
      list.appendChild(option);
    });
  });
};

// get users to form options
const getUsers = async () => {
  try {
    const response = await fetch(url + '/user');
    const users = await response.json();
    createUserOptions(users);
  }
  catch (e) {
    console.log(e.message);
  }
};
getUsers();

// submit add photo form
addForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const fd = new FormData(addForm);
  const fetchOptions = {
    method: 'POST',
    body: fd,
  };
  const response = await fetch(url + '/photo', fetchOptions);
  const json = await response.json();
  console.log('add response', json);
  getPhoto();
});

// submit modify form
modForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const data = serializeJson(modForm);
  const fetchOptions = {
    method: 'PUT', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer', // no-referrer, *client
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  };

  console.log(fetchOptions);
  const response = await fetch(url + '/photo', fetchOptions);
  const json = await response.json();
  console.log('modify response', json);
  getPhoto();
});