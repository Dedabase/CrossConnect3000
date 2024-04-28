// Imports for Firestore operations and for displaying notifications
import { firestore } from "../firebaseConfig";
import {
  addDoc,
  collection,
  onSnapshot,
  doc,
  updateDoc,
  query,
  where,
  setDoc,
  deleteDoc,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { toast } from "react-toastify";

// Reference to different Firestore collections used in the application
let postsRef = collection(firestore, "posts");
let userRef = collection(firestore, "users");
let likeRef = collection(firestore, "likes");
let commentsRef = collection(firestore, "comments");
let connectionRef = collection(firestore, "connections");

// Function to add a new post to the Firestore
export const postStatus = (object) => {
  addDoc(postsRef, object)
    .then(() => {
      toast.success("Post has been added successfully"); // Notify user on successful post addition
    })
    .catch((err) => {
      console.log(err); // Log any errors that occur
    });
};

// Function to retrieve all posts and update UI accordingly
export const getStatus = (setAllStatus) => {
  const q = query(postsRef, orderBy("timeStamp")); // Query to fetch posts ordered by timeStamp
  onSnapshot(q, (response) => {
    setAllStatus(
      response.docs.map((doc) => {
        return { ...doc.data(), id: doc.id }; // Transform each document into an object including its Firestore ID
      })
    );
  });
};

// Function to retrieve all users from Firestore
export const getAllUsers = (setAllUsers) => {
  onSnapshot(userRef, (response) => {
    setAllUsers(
      response.docs.map((doc) => {
        return { ...doc.data(), id: doc.id }; // Map each user document into an object with Firestore ID
      })
    );
  });
};

// Function to retrieve a single post by user ID
export const getSingleStatus = (setAllStatus, id) => {
  const singlePostQuery = query(postsRef, where("userID", "==", id)); // Query for posts by a specific user
  onSnapshot(singlePostQuery, (response) => {
    setAllStatus(
      response.docs.map((doc) => {
        return { ...doc.data(), id: doc.id }; // Map results to objects including their Firestore ID
      })
    );
  });
};

// Function to retrieve a single user by email
export const getSingleUser = (setCurrentUser, email) => {
  const singleUserQuery = query(userRef, where("email", "==", email)); // Query for user by email
  onSnapshot(singleUserQuery, (response) => {
    setCurrentUser(
      response.docs.map((doc) => {
        return { ...doc.data(), id: doc.id }; // Extract the first result as the current user
      })[0]
    );
  });
};

// Function to add a new user to Firestore
export const postUserData = (object) => {
  addDoc(userRef, object)
    .then(() => {})
    .catch((err) => {
      console.log(err); // Log any errors that occur
    });
};

// Function to fetch current user's data from Firestore
export const getCurrentUser = (setCurrentUser) => {
  onSnapshot(userRef, (response) => {
    setCurrentUser(
      response.docs
        .map((doc) => {
          return { ...doc.data(), id: doc.id };
        })
        .filter((item) => {
          return item.email === localStorage.getItem("userEmail"); // Filter for the user's email stored in local storage
        })[0]
    );
  });
};

// Function to edit and update a user's profile
export const editProfile = (userID, payload) => {
  let userToEdit = doc(userRef, userID); // Document reference for the user to edit

  updateDoc(userToEdit, payload)
    .then(() => {
      toast.success("Profile has been updated successfully"); // Notify user on successful update
    })
    .catch((err) => {
      console.log(err); // Log any errors
    });
};

// Function to handle liking or unliking a post
export const likePost = (userId, postId, liked) => {
  try {
    let docToLike = doc(likeRef, `${userId}_${postId}`); // Document reference for the like
    if (liked) {
      deleteDoc(docToLike); // If already liked, remove the like
    } else {
      setDoc(docToLike, { userId, postId }); // If not liked, add a like
    }
  } catch (err) {
    console.log(err); // Log any errors
  }
};

// Function to fetch likes made by a specific user on a specific post and update UI
export const getLikesByUser = (userId, postId, setLiked, setLikesCount) => {
  try {
    let likeQuery = query(likeRef, where("postId", "==", postId)); // Query for likes on a specific post

    onSnapshot(likeQuery, (response) => {
      let likes = response.docs.map((doc) => doc.data());
      let likesCount = likes?.length; // Count of likes

      const isLiked = likes.some((like) => like.userId === userId); // Check if the user has liked the post

      setLikesCount(likesCount);
      setLiked(isLiked);
    });
  } catch (err) {
    console.log(err); // Log any errors
  }
};

// Function to post a comment on a post
export const postComment = (postId, comment, timeStamp, name) => {
  try {
    addDoc(commentsRef, {
      postId,
      comment,
      timeStamp,
      name,
    });
  } catch (err) {
    console.log(err); // Log any errors
  }
};

// Function to retrieve comments for a specific post
export const getComments = (postId, setComments) => {
  try {
    let singlePostQuery = query(commentsRef, where("postId", "==", postId)); // Query for comments on a specific post

    onSnapshot(singlePostQuery, (response) => {
      const comments = response.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(), // Map each comment document into an object including its Firestore ID
        };
      });

      setComments(comments);
    });
  } catch (err) {
    console.log(err); // Log any errors
  }
};

// Function to update a post's content or image
export const updatePost = (id, status, postImage) => {
  let docToUpdate = doc(postsRef, id); // Document reference for the post to update

  try {
    updateDoc(docToUpdate, { status, postImage });
    toast.success("Post has been updated!"); // Notify user on successful update
  } catch (err) {
    console.log(err); // Log any errors
  }
};

// Function to delete a post from Firestore
export const deletePost = (id) => {
  let docToDelete = doc(postsRef, id); // Document reference for the post to delete

  try {
    deleteDoc(docToDelete);
    toast.success("Post has been Deleted!"); // Notify user on successful deletion
  } catch (err) {
    console.log(err); // Log any errors
  }
};

// Function to add a connection between two users
export const addConnection = (userId, targetId) => {
  try {
    let connectionToAdd = doc(connectionRef, `${userId}_${targetId}`); // Document reference for the connection

    setDoc(connectionToAdd, { userId, targetId });

    toast.success("Connection Added!"); // Notify user on successful connection addition
  } catch (err) {
    console.log(err); // Log any errors
  }
};

// Function to check if a connection exists between two users
export const getConnections = (userId, targetId, setIsConnected) => {
  try {
    let connectionsQuery = query(
      connectionRef,
      where("targetId", "==", targetId) // Query for connections to a specific target
    );

    onSnapshot(connectionsQuery, (response) => {
      let connections = response.docs.map((doc) => doc.data());

      const isConnected = connections.some(
        (connection) => connection.userId === userId // Check if the user is connected to the target
      );

      setIsConnected(isConnected);
    });
  } catch (err) {
    console.log(err); // Log any errors
  }
};
