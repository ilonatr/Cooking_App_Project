'use strict';
const url = 'http://localhost:3000'; // change url when uploading to server

// select existing html elements
const loginWrapper = document.querySelector('#login-wrapper');
const userInfo = document.querySelector('#user-info');
const logOut = document.querySelector('#log-out');
const main = document.querySelector('main');
const loginForm = document.querySelector('#login-form');
const addUserForm = document.querySelector('#addUserForm');
const addForm = document.querySelector('#add-photo-form');
const ediForm = document.querySelector('#edit-photo-form');
const ul = document.querySelector('ul');
const userLists = document.querySelectorAll('.add-owner');
const imageModal = document.querySelector('#image-modal');
const modalImage = document.querySelector('#image-modal img');
const close = document.querySelector('#image-modal a');

// create photo cards
const createPhotoCards = (photos) => {
  // clear ul
  ul.innerHTML = '';
  photos.forEach((photo) => {
    // create li with DOM methods

    console.log(photo);

    const img = document.createElement('img');
    //img.src = url + '/thumbnails/' + photo.filename;
    img.src = url + '/' + photo.filename;
    img.alt = photo.id;
    img.classList.add('resp');

    // open large image when clicking image
    img.addEventListener('click', () => {
      modalImage.src = url + '/' + photo.filename;
      imageModal.alt = photo.id;
      imageModal.classList.toggle('hide');
      try {
        const coords = JSON.parse(photo.coords);
        // console.log(coords);
        addMarker(coords);
      }
      catch (e) {
      }
    });

    const figure = document.createElement('figure').appendChild(img);
    

    /*const h2 = document.createElement('h2');
    h2.innerHTML = cat.name;
     */

    const p1 = document.createElement('p');
    p1.innerHTML = `From: ${photo.ownername}`;

    const p2 = document.createElement('p');
    p2.innerHTML = `${photo.caption}`;

      // add selected photo's values to modify form
    const editButton = document.createElement('button');
    editButton.className = 'light-border';
    editButton.innerHTML = 'Edit';
    editButton.addEventListener('click', () => {
      const inputs = ediForm.querySelector('input');
      const texarea = ediForm.querySelector('textarea');
      texarea.value = photo.caption;
      inputs.value = photo.id;
      scrollToTop();
    });

    // delete selected photo
    const delButton = document.createElement('button');
    delButton.className = 'light-border';
    delButton.innerHTML = 'Delete';
    delButton.addEventListener('click', async () => {
      const fetchOptions = {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        },
      };
      try {
        const response = await fetch(url + '/photo/' + photo.id, fetchOptions);
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
    if (photo.editable) {
    li.appendChild(editButton);
    li.appendChild(delButton);
    }
    ul.appendChild(li);
  });
};

// progress bar as a hr
    /*let bar = document.querySelector('.progress-bar');
    window.addEventListener('scroll', () => {
        let max = document.body.scrollHeight - innerHeight;
        bar.style.width = `${(pageYOffset / max) * 100}%`;
    });*/

    const mybutton = document.getElementById('top-button');

    //appears to the bottom if scrolled down to 500px 
    const scrollFunc = () => {
      if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
        mybutton.style.display = 'block';
      } else {
        mybutton.style.display = 'none';
      }
    };
    
    window.addEventListener('scroll', scrollFunc);
    
    const scrollToTop = () => {

      const c = document.documentElement.scrollTop || document.body.scrollTop;
      if (c > 0) {
        window.requestAnimationFrame(scrollToTop);
        // scrollTotop takes x and a y coordinates
        // increases the '10' value to get a smoother scroll
        window.scrollTo(0, c - c / 10);
      }
    };
    
    //when the button is clicked, runs scrollToTop function
    mybutton.onclick = function(e) {
      e.preventDefault();
      scrollToTop();
    }    


// close modal
close.addEventListener('click', (evt) => {
  evt.preventDefault();
  imageModal.classList.toggle('hide');
});

// AJAX call

const getPhoto = async () => {
  console.log('getPhoto token ', sessionStorage.getItem('token'));
  try {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/photo', options);
    const photos = await response.json();
    createPhotoCards(photos);
  }
  catch (e) {
    console.log(e.message);
  }
};

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
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/user', options);
    const users = await response.json();
    createUserOptions(users);
  }
  catch (e) {
    console.log(e.message);
  }
};

// submit add photo form
addForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const fd = new FormData(addForm);
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
    },
    body: fd,
  };
  const response = await fetch(url + '/photo', fetchOptions);
  const json = await response.json();
  console.log('add response', json);
  getPhoto();
});

// submit modify form
ediForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();

  const data = serializeJson(ediForm);
  const fetchOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
    },
    body: JSON.stringify(data),
  };

  console.log(fetchOptions);
  const response = await fetch(url + '/photo', fetchOptions);
  const json = await response.json();
  console.log('modify response', json);
  getPhoto();
});

// login
loginForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const data = serializeJson(loginForm);
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  const response = await fetch(url + '/auth/login', fetchOptions);
  const json = await response.json();
  console.log('login response', json);
  if (!json.user) {
    alert(json.message);
  } else {
    // save token
    sessionStorage.setItem('token', json.token);
    sessionStorage.setItem('user', JSON.stringify(json.user));
    // show/hide forms + photos
    loginWrapper.style.display = 'none';
    logOut.style.display = 'block';
    main.style.display = 'block';
    setUser();
    getPhoto();
    getUsers();
  }
});

const setUser = () => {
  try {
    const user = JSON.parse(sessionStorage.getItem('user'));
    userInfo.innerHTML = `${user.name} <img src="${url}/${user.avatar}">`;

  } catch(e) {

  }

};

setUser();

// logout
logOut.addEventListener('click', async (evt) => {
  evt.preventDefault();
  try {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/auth/logout', options);
    const json = await response.json();
    console.log(json);
    // remove token
    sessionStorage.removeItem('token');
    alert('You have logged out');
    // show/hide forms + photos
    loginWrapper.style.display = 'flex';
    logOut.style.display = 'none';
    main.style.display = 'none';
  }
  catch (e) {
    console.log(e.message);
  }
});

// submit register form
addUserForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const data = new FormData(addUserForm);
  const fetchOptions = {
    method: 'POST',
    body: data,
  };
  const response = await fetch(url + '/auth/register', fetchOptions);
  const json = await response.json();
  console.log('user add response', json);
  //mitä haluan että tapahtuu rekisteröinnin jälkeen
  alert('Rekisteröinti ok');
});

// when app starts, check if token exists and hide login form, show logout button and main content, get cats and users
if (sessionStorage.getItem('token')) {
  loginWrapper.style.display = 'none';
  logOut.style.display = 'block';
  main.style.display = 'block';
  getPhoto();
  getUsers();
}