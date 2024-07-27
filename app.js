document.addEventListener('DOMContentLoaded', function() {
  const googleSignInButton = document.getElementById('googleSignIn');
  const signOutButton = document.getElementById('signOut');
  const fileInput = document.getElementById('fileInput');
  const uploadButton = document.getElementById('uploadButton');
  const result = document.getElementById('result');

  // Configura Firebase Authentication
  googleSignInButton.addEventListener('click', function() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then((result) => {
        console.log("User signed in:", result.user);
        googleSignInButton.style.display = 'none';
        signOutButton.style.display = 'block';
        fileInput.style.display = 'block';
        uploadButton.style.display = 'block';
      })
      .catch((error) => {
        console.error("Error signing in:", error);
        result.innerHTML = 'Error al iniciar sesión: ' + error.message;
      });
  });

  signOutButton.addEventListener('click', function() {
    firebase.auth().signOut().then(() => {
      console.log("User signed out");
      googleSignInButton.style.display = 'block';
      signOutButton.style.display = 'none';
      fileInput.style.display = 'none';
      uploadButton.style.display = 'none';
    }).catch((error) => {
      console.error("Error signing out:", error);
      result.innerHTML = 'Error al cerrar sesión: ' + error.message;
    });
  });

  uploadButton.addEventListener('click', function() {
    const file = fileInput.files[0];
    if (file) {
      const storageRef = firebase.storage().ref('photos/' + file.name);
      const uploadTask = storageRef.put(file);

      uploadTask.on('state_changed', function(snapshot) {
        // Mostrar progreso de carga
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        result.innerHTML = 'Cargando: ' + progress.toFixed(2) + '%';
      }, function(error) {
        console.error("Upload failed:", error);
        result.innerHTML = 'Error en la carga del archivo: ' + error.message;
      }, function() {
        // La carga se completó con éxito
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          result.innerHTML = `<p>¡Carga exitosa! <a href="${downloadURL}" target="_blank">Ver Imagen</a></p>`;
        });
      });
    } else {
      result.innerHTML = 'Por favor, selecciona un archivo primero';
    }
  });
});
