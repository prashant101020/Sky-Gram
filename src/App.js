import React ,{useState,useEffect} from 'react';
import './App.css';
import Post from './Post';
import { db ,auth} from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button } from '@material-ui/core';
import {Input} from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';
// import getUserLocale from 'get-user-locale';

function getModalStyle() {
  const top = 50; 
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}


const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


// const locale =() => {
  
//   if (getUserLocale().includes("fr")) {
//     return(true)
//   } else {
//     return(false)
//   }
// }



function App() {
 
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  // const [openImageUpload, setOpenImageUpload] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  // const [lang, setLang] = useState(locale);
  // useEffect ==> run in a specific condition



  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // if user has logged in...
        setUser(authUser);

      } else {
        // if user has logged out... 
        setUser(null);
      }
      
    })

    return () => {
      // perform some cleanup actions
      unsubscribe();
    }
  }, [user, username]);




  useEffect(() => {
    // This is where the code runs .orderBy('timestamp', 'desc')
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot => {
      // every time a new post is added, this code fires up
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
}, []);







const signUp = (event) => {

  // This is to prevent the page from refreshing when we submit the form
  event.preventDefault();
  auth.createUserWithEmailAndPassword(email, password)
  .then((authUser) => {
    return authUser.user.updateProfile({
      displayName: username
    })
  })
  .catch((error) => alert(error.message));

  // Set user so that footer changes accordingly
  

  // Close modal
  setOpen(false);
}





const signIn = (event) => {
  event.preventDefault();
  auth
    .signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message));
  
  // Close modal
  setOpenSignIn(false);
}


  // useEffect

  return (


    <div className="app">
    
      
      <Modal  
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img 
                className="app__headerImage"
                height="40px;"
                src="https://redairplane.design/wp-content/uploads/2019/08/skygram-logo-tagline.png"
                alt=""
              />
            </center>

            <Input 
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            /> 
            <Input 
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input 
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>Sign Up</Button>

          </form>

        </div>
      </Modal>




      <Modal  
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img 
                className="app__headerImage"
                src="https://redairplane.design/wp-content/uploads/2019/08/skygram-logo-tagline.png"
                height="40px;"
                alt=""
              />
            </center>

            <Input 
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input 
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>Sign In</Button>

          </form>

        </div>
      </Modal>




      <div className="app__header">

     <img 
     className="app__headerImage"
     src="https://redairplane.design/wp-content/uploads/2019/08/skygram-logo-tagline.png" 
     height="40px;"
     alt=""
     />
{ user ?  (<Button className="logout" onClick={() => auth.signOut()}>Log Out</Button>)
: 
(
<div className="app__login">
<Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
<Button onClick={() => setOpen(true)}>Sign up</Button>
</div>
)}
      </div>



    <div className="app__posts">

   <div className="app__postLeft">


    {
   posts.map(({id,post}) =>(
     <Post key={post.id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
  ))
 }
    </div>
    <div className="app__postsRight">


 <InstagramEmbed
  url='https://www.instagram.com/p/CNvFP5MnVULTuDaNpueP85FKTH_hO5rIPr7dE40/'
  clientAccessToken='123|456'
  maxWidth={320}
  hideCaption={false}
  containerTagName='div'
  protocol=''
  injectScript
  onLoading={() => {}}
  onSuccess={() => {}}
  onAfterRender={() => {}}
  onFailure={() => {}}
/>
</div>
</div>

  


 

     {/* Header */}
     {/* Posts */}
     {user?.displayName?(
        <ImageUpload username={user.displayName}/>
      ):(
        <h3>Sorry you need to login to upload</h3>
      )}


    </div>

    

 
  );
}

export default App;
