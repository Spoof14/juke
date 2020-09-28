import React, { PureComponent, Suspense, useEffect, useState } from "react";
import { AudioRecorder, AudioRecorderFunction } from "./AudioRecorder";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import allmight from "./allmight.png";
import Button from "./Button";
import { FirebaseAppProvider, useFirestore, useStorage } from "reactfire";

export default class App extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      accepted: false,
      user: "",
    };
  }

  onAccept = () => {
    this.setState({ accepted: true });
  };

  render() {
    const firebaseConfig = {
      /* Paste your config object from Firebase console here */
      apiKey: "AIzaSyCIML-A8XBuWsGp4cx2cNjcdFXEMuTZyD8",
      authDomain: "juke-1ad87.firebaseapp.com",
      databaseURL: "https://juke-1ad87.firebaseio.com",
      projectId: "juke-1ad87",
      storageBucket: "juke-1ad87.appspot.com",
      messagingSenderId: "826491069739",
      appId: "1:826491069739:web:5a2792c9d8a376fd2a916e",
    };

    return (
      <FirebaseAppProvider firebaseConfig={firebaseConfig}>
        <Suspense fallback={<div>loading</div>}>
          <div>
            <Router>
              <Switch>
                <Route path="/juke">
                  <Juke></Juke>
                </Route>
                <Route path="">
                  <div>
                    {this.state.accepted ? (
                      <Switch>
                        <Route path="/listeA">
                          <AudioRecorder
                            audioSource="listeA"
                            user={this.state.user}
                          />
                        </Route>
                        <Route path="/pretest">
                          <AudioRecorder
                            audioSource="pretest"
                            user={this.state.user}
                          />
                        </Route>
                        <Route path="/listeB">
                          <AudioRecorder
                            audioSource="listeB"
                            user={this.state.user}
                          />
                        </Route>
                        <Links />
                      </Switch>
                    ) : (
                      <div style={{ display: "flex", padding: "1rem" }}>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <h1>Note from Zhu</h1>
                          <p>你好，首先感谢你参与这次实验<span role="img" aria-label="smile">😊</span>!</p>
                          <p>
                            这是一个关于注意力的小测试，也可以说是一个小游戏。在接下来的测试中，你将听到小明的两周日记。小明是一个10岁的小男孩，他每天都会写日记，
                            记下一些有意义，或者无意义的事情，大部分内容都像是简单的流水账，比如吃饭、写作业、睡觉等日常行为。
                          </p>
                          <p>
                            两周的日记一共包含了14篇小日记，每篇日记平均有6到7句话，持续45秒左右，每篇日记间隔5秒，两周之间间隔10秒，整个注意力测试时间约为12分钟。日记中除了小明自己，还会出现他的家人，比如爸爸妈妈、朋友小宇以及其他一些不重要的人或物。日记是第一人称视角，小明即为故事中的“我”。
                          </p>
                          <p style={{ fontWeight: "bold" }}>
                            你的任务是：仔细听小明做了什么，并以一件事为单位，在听到小明做了一件事的时候，用鼠标点击一下按钮。
                          </p>
                          <p>
                            *注意：其他人做了什么并不重要，注意力请放在小明上。
                          </p>
                          <p>
                            在进入正式测试前，请先输入ID，并做一个约为45秒的pretest，以确保你明白了测试的内容及任务。
                          </p>
                          <p>
                            友情提示：测试结束后，请耐心等待数据上传，不要马上关掉网页哦。
                          </p>

                          <input
                            style={{ padding: "1rem" }}
                            placeholder="Input ID here"
                            type="text"
                            value={this.state.user}
                            onChange={(e) =>
                              this.setState({ user: e.target.value })
                            }
                          />
                          <Button
                            disabled={!this.state.user}
                            onClick={this.onAccept}
                          >
                            Accept
                          </Button>
                        </div>
                        <img
                          src={allmight}
                          alt={"all might showing thumbsup"}
                          style={{ borderRadius: "50%", maxHeight: "90vh" }}
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
      <Link
        to="juke"
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
        For Juke
      </Link>
    </div>
  );
};

function getDownloadURL(timestamps){
  let downloadUrl = "data:text/csv;charset=utf-8,sep=,\r\n\n" + timestamps?.
    map(t => [t.user, ...t.timestamps.map(num => Math.floor(num))].join(",")).
    join("\n")
  return downloadUrl
}

const Juke = () => {
  const [items, setItems] = useState(); 
  const [timestamps, setTimestamps] = useState(); 
  const storage = useStorage().ref();
  const timestampsRef = useFirestore().collection("timestamps");

  useEffect(() => {
    async function getItems() {
      const listeA = await storage.child("clips/listeA").listAll();
      const listeB = await storage.child("clips/listeB").listAll();
      const pretest = await storage.child("clips/pretest").listAll();
      const timestampItems = await (await timestampsRef.get()).docs.map(doc => doc.data())
      let newTimeStamps = {}
      timestampItems.forEach(ts => {
        if(!newTimeStamps[ts.audioSource]) newTimeStamps[ts.audioSource] = []
        newTimeStamps[ts.audioSource].push(ts)
      })
      setTimestamps(newTimeStamps)
      setItems({ listeA, listeB, pretest });
    }
    getItems();
  }, []);
  console.log("items", items);
  console.log("timestamps", timestamps);
  //let downloadUrl = "data:text/csv;charset=utf-8," + timestamps?.map(t => [t.user, ...t.timestamps.map(num => Math.floor(num))].join(",")).join("\n")
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 2, display: "flex", justifyContent: "space-evenly" }}>
        {items &&
          Object.keys(items).map((list, i) => (
            <div>
              <h1>{list}</h1>
              <a
                href={getDownloadURL(timestamps[list])}
                download={list + "timestamps.csv"}
              >
                Download timestamps
              </a>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {items[list].items.map((item) => (
                  <ListItem item={item} />
                ))}
              </div>
            </div>
          ))}
      </div>
      <div style={{ flex: 1, overflowY: "auto", maxHeight: 600 }}>
        {timestamps && Object.keys(timestamps).map((key) =>
          timestamps[key].map((t) => (
            <div style={{margin:'8px 8px', padding:4, background:'#333', borderRadius:4}}>
              <div>ID: {t.user}</div>
              <div>Audio: {t.audioSource}</div>
              <div>Clicks:{t.timestamps.length}</div>
              {`${t.timestamps.map(
                (num) => " " + Math.floor(num)
              )}`}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

function ListItem({item}) {
  const [link, setLink] = useState("");

  useEffect(() => {
    item.getDownloadURL().then(url => setLink(url))
    // .then((url) => {
    //   var xhr = new XMLHttpRequest();
    //   xhr.responseType = 'blob';
    //   xhr.onload = function(event) {
    //     var blob = xhr.response;
    //     setLink(blob)
    //   };
    //   xhr.open('GET', url);
    //   xhr.send();
    // })

  }, []);
  const onClick = () => {
    var xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = function(event) {
        var blob = xhr.response;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        // the filename you want
        a.download = item.name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      };
      xhr.open('GET', link);
      xhr.send();
  }
  return <Button onClick={onClick}>Download {item.name}</Button>
  //return <a href={link ? URL.createObjectURL(link) : ''} download={item.name}>{!link ? 'loading' : item.name}</a>;
}

const Lorem = () => `orem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse nec fermentum elit. Sed elementum, dolor vel blandit porttitor, mauris ligula fringilla risus, sit amet interdum justo dui ut sapien. Integer id odio vitae dolor dictum molestie sed consectetur diam. Donec mattis diam id risus mattis ornare. Donec ultrices tincidunt dolor id rhoncus. In dolor augue, egestas non venenatis nec, vestibulum eget nisi. Morbi enim eros, sodales accumsan dolor sit amet, auctor finibus ipsum. Vestibulum imperdiet tincidunt ante a suscipit. Praesent non commodo urna. Duis eleifend metus eu leo efficitur laoreet. Nulla non mauris lectus. Pellentesque viverra risus id nisi efficitur varius.

Donec sed posuere ex. Phasellus pretium mattis augue, vitae malesuada diam ullamcorper nec. Suspendisse egestas dolor eu accumsan vehicula. Nulla facilisi. Vestibulum consectetur malesuada massa at gravida. Fusce tincidunt lacus sed diam scelerisque euismod. Cras egestas, lorem non faucibus venenatis, neque magna lacinia nulla, eget pellentesque mi justo eget sapien.

Sed aliquet neque volutpat arcu rutrum mollis. Nullam ut felis urna. Cras tristique neque eget facilisis lacinia. Vivamus nec facilisis mi. In ac augue laoreet, aliquam tortor sit amet, pulvinar mauris. Nulla vitae mi ac erat bibendum efficitur malesuada eget velit. Nunc congue magna sed quam maximus, id lobortis dolor luctus. Proin nec mattis est. Mauris augue felis, porta a vestibulum et, sollicitudin ut ex. Donec in ultrices velit.

Duis vehicula nisi a quam luctus rutrum. Praesent interdum feugiat suscipit. Ut sed scelerisque sapien, in suscipit mi. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aenean quis iaculis eros. Sed imperdiet blandit neque, quis congue leo imperdiet id. Nullam venenatis scelerisque tellus, non blandit ipsum varius ut. Morbi et semper urna. Vivamus fringilla metus eu metus rhoncus euismod. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis fringilla orci vitae massa pharetra, ut porttitor massa facilisis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In in sapien enim. Nam quis lectus commodo, dapibus nunc at, bibendum nisi. In condimentum nisl sit amet suscipit suscipit.`;
