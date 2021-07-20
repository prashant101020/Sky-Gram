import React, {useState,useEffect} from 'react'
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import { db } from './firebase';
import firebase from 'firebase';

function Post({postId,user, username, caption, imageUrl}) {
   const [comments,setComments]= useState([]);
   const [comment,setComment]=useState('');    

   useEffect(() => {
    let unsubscribe;
    if (postId) {
        unsubscribe = db
            .collection("posts")
            .doc(postId)
            .collection("comments")
            .orderBy('timestamp', 'asc')
            .onSnapshot((snapshot) => {
                setComments(snapshot.docs.map((doc) => doc.data()));
            })
    
        }
    return () => {
      unsubscribe();
    }

}, [postId]);

const postComment = (event) => {
    event.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
        text: comment,
        username: user.displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    setComment('');
        
}




   return (
        <div className="post">
            <div className="post__header">

            <Avatar
            className="post__avatar"
            alt="prashant yadav"
            src=""  
            />
            
            <h3>{username}</h3>

                </div> 
          

         {/* Header --> Avatar Userbame    */}
        <img className="post__image" 
        src={imageUrl}
        alt=""/>
        {/* Image */}
        <h3 className="post__text"><strong>{username}</strong> {caption}</h3>
        {/* username +Caption */}

    <div className="post__comments">
        {comments.map((comment)=>(
        <p>
<b>{comment.username}</b>{comment.text}

        </p>
          ) )}
        
        </div>

        <form className="post__commentBox">

       <input
       className="post__input"
       type="text"
       value={comment}
       placeholder="add a comment..."
       onChange={(e) => setComment(e.target.value)}
       />

       <button
       className="post__button"
       disabled={!comment}
       type="submit"
       onClick={postComment}
       >
           post
       </button>

        </form>
        </div>
    )
}

export default Post
