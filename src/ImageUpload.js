import React,{useState} from 'react'
import {Button} from "@material-ui/core";
import firebase from "firebase"
import {storage,db} from "./firebase";
import './ImageUpload.css';

function ImageUpload({username}) {
   const [image,setImage]=useState(null);
   const [progress,setProgress]=useState(0);
   const [caption,setCaption] = useState('');

const handleChange=(e) =>{
    if(e.target.files[0]){
        setImage(e.target.files[0]);
    }
};
const handleUpload = () => {
    // This is what uploads the image to Firebase
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    
    uploadTask.on(
        "state_changed",
        (snapshot) => {
            // progress function
            const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(progress)
        },
        (error) => {
            // Error function
            console.log(error);
            alert(error.message);
        },

        () => {
            // complete function ...
            storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then(url => {
                    // Post image URL inside db
                    db.collection("posts").add({
                        // timestamp is used here to figure out the time the image was uploaded, which is gonna determine the order in which we display the posts (latest at the top)
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageUrl: url,
                        username: username,
                        imagename: image.name
                    });

                    // Reset everything once upload process is completed
                    setProgress(0);
                    setCaption("");
                    setImage(null);
                    // closemodal(false);

                    // Scroll back to top and reset other states so that it goes back to default list
                    // document.body.scrollTop = 0; // For Safari
                    // document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
                    // viewwhichuser('');
                    // viewsinglepost(false);
                })
        }
    )
}



    return (
        <div className="imageupload">
            <progress className="imageupload__progress" value={progress} max="100" />
            <input type="text" placeholder="Enter a Caption..." onChange={event => setCaption(event.target.value)} value={caption}/>
            <input type="file" onChange={handleChange}/>
            <Button className="upload__Button" onClick={handleUpload}>
                upload
            </Button>
            
            </div>
         
    )
}

export default ImageUpload
