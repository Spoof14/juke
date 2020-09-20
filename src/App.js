import React, { PureComponent, Suspense } from "react";
import {AudioRecorder, AudioRecorderFunction} from "./AudioRecorder";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import allmight from './allmight.png'
import Button from "./Button";
import { FirebaseAppProvider } from 'reactfire';

export default class App extends PureComponent {
  constructor(props) {
    super(props)
  
    this.state = {
       accepted:false,
       user:''
    }
  }
  
  onAccept = () => {
    this.setState({accepted: true})
  }

  render() {

    const firebaseConfig = {
      /* Paste your config object from Firebase console here */
        apiKey: "AIzaSyCIML-A8XBuWsGp4cx2cNjcdFXEMuTZyD8",
        authDomain: "juke-1ad87.firebaseapp.com",
        databaseURL: "https://juke-1ad87.firebaseio.com",
        projectId: "juke-1ad87",
        storageBucket: "juke-1ad87.appspot.com",
        messagingSenderId: "826491069739",
        appId: "1:826491069739:web:5a2792c9d8a376fd2a916e"
     };

    return (
      <FirebaseAppProvider firebaseConfig={firebaseConfig}>
    <Suspense fallback={<div>loading</div>}>

        <div>
          <Router>
            <Switch>
              <Route path="">
                <div>
                  {this.state.accepted ? (
                    <Switch>
                      <Route path="/listeA">
                        <AudioRecorder audioSource="listeA" user={this.state.user} />
                      </Route>
                      <Route path="/pretest">
                        <AudioRecorder audioSource="pretest" user={this.state.user} />
                      </Route>
                      <Route path="/listeB">
                        <AudioRecorder audioSource="listeB" user={this.state.user} />
                      </Route>
                      <Links />
                    </Switch>
                  ) : (
                    <div style={{ display: "flex", padding: "1rem" }}>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <h1>juke information </h1>
                        <p>
                          <Lorem />
                        </p>
                        <input style={{padding:'1rem'}} placeholder='Input your name here' type='text' value={this.state.user} onChange={(e) => this.setState({user:e.target.value})}/>
                        <Button disabled={!this.state.user} onClick={this.onAccept}>Accept</Button>
                      </div>
                      <img
                        src={allmight}
                        alt={"all might showing thumbsup"}
                        style={{ borderRadius: "50%" }}
                      ></img>
                    </div>
                  )}
                </div>
              </Route>
            </Switch>
          </Router>
        </div>
        </Suspense>
      </FirebaseAppProvider>
    );
  }
}
const Links = () => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Link
        to="listeA"
        style={{
          fontSize: "4rem",
          flex: 1,
          color: "white",
          textDecoration: "none",
          padding: "5%",
          border: "1px solid lightgrey",
          borderRadius: "10px",
        }}
      >
        listeA
      </Link>
      <Link
        to="listeB"
        style={{
          fontSize: "4rem",
          flex: 1,
          color: "white",
          textDecoration: "none",
          padding: "5%",
          border: "1px solid lightgrey",
          borderRadius: "10px",
        }}
      >
        listeB
      </Link>
      <Link
        to="pretest"
        style={{
          fontSize: "4rem",
          flex: 1,
          color: "white",
          textDecoration: "none",
          padding: "5%",
          border: "1px solid lightgrey",
          borderRadius: "10px",
        }}
      >
        pretest
      </Link>
    </div>
  );
}

const Lorem = () => `orem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse nec fermentum elit. Sed elementum, dolor vel blandit porttitor, mauris ligula fringilla risus, sit amet interdum justo dui ut sapien. Integer id odio vitae dolor dictum molestie sed consectetur diam. Donec mattis diam id risus mattis ornare. Donec ultrices tincidunt dolor id rhoncus. In dolor augue, egestas non venenatis nec, vestibulum eget nisi. Morbi enim eros, sodales accumsan dolor sit amet, auctor finibus ipsum. Vestibulum imperdiet tincidunt ante a suscipit. Praesent non commodo urna. Duis eleifend metus eu leo efficitur laoreet. Nulla non mauris lectus. Pellentesque viverra risus id nisi efficitur varius.

Donec sed posuere ex. Phasellus pretium mattis augue, vitae malesuada diam ullamcorper nec. Suspendisse egestas dolor eu accumsan vehicula. Nulla facilisi. Vestibulum consectetur malesuada massa at gravida. Fusce tincidunt lacus sed diam scelerisque euismod. Cras egestas, lorem non faucibus venenatis, neque magna lacinia nulla, eget pellentesque mi justo eget sapien.

Sed aliquet neque volutpat arcu rutrum mollis. Nullam ut felis urna. Cras tristique neque eget facilisis lacinia. Vivamus nec facilisis mi. In ac augue laoreet, aliquam tortor sit amet, pulvinar mauris. Nulla vitae mi ac erat bibendum efficitur malesuada eget velit. Nunc congue magna sed quam maximus, id lobortis dolor luctus. Proin nec mattis est. Mauris augue felis, porta a vestibulum et, sollicitudin ut ex. Donec in ultrices velit.

Duis vehicula nisi a quam luctus rutrum. Praesent interdum feugiat suscipit. Ut sed scelerisque sapien, in suscipit mi. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aenean quis iaculis eros. Sed imperdiet blandit neque, quis congue leo imperdiet id. Nullam venenatis scelerisque tellus, non blandit ipsum varius ut. Morbi et semper urna. Vivamus fringilla metus eu metus rhoncus euismod. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis fringilla orci vitae massa pharetra, ut porttitor massa facilisis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In in sapien enim. Nam quis lectus commodo, dapibus nunc at, bibendum nisi. In condimentum nisl sit amet suscipit suscipit.`;