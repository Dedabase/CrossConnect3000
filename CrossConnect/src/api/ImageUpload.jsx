// Importing the necessary Firebase storage functions and configuration
import { storage } from "../firebaseConfig";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { editProfile } from "./FirestoreAPI";

// Function to upload a profile image to Firebase Storage and update user profile
export const uploadImage = (
  file,             // The file object containing the image to be uploaded
  id,               // The user ID to whom the profile image belongs
  setModalOpen,     // Function to control the visibility of a modal, typically for feedback or progress
  setProgress,      // Function to set the upload progress percentage
  setCurrentImage   // Function to set the current image object in the component state
) => {
  const profilePicsRef = ref(storage, `profileImages/${file.name}`); // Creating a reference to the storage location
  const uploadTask = uploadBytesResumable(profilePicsRef, file);     // Starting the upload task

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100 // Calculating the upload progress percentage
      );

      setProgress(progress);  // Updating the progress in the UI
    },
    (error) => {
      console.error(error);  // Logging the error in case of upload failure
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((response) => { // Retrieving the download URL of the uploaded file
        editProfile(id, { imageLink: response });  // Updating the user profile with the new image link
        setModalOpen(false);   // Closing the modal upon successful upload
        setCurrentImage({});   // Resetting the current image in the state
        setProgress(0);        // Resetting the progress to zero
      });
    }
  );
};

// Function to upload an image for a post to Firebase Storage
export const uploadPostImage = (
  file,          // The file object containing the image to be uploaded
  setPostImage,  // Function to set the post image URL in the component state
  setProgress    // Function to set the upload progress percentage
) => {
  const postPicsRef = ref(storage, `postImages/${file.name}`); // Creating a reference to the storage location for post images
  const uploadTask = uploadBytesResumable(postPicsRef, file);  // Starting the upload task

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100 // Calculating the upload progress percentage
      );

      setProgress(progress);  // Updating the progress in the UI
    },
    (error) => {
      console.error(error);  // Logging the error in case of upload failure
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((response) => {
        setPostImage(response);  // Setting the post image URL after successful upload
      });
    }
  );
};
