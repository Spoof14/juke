import React, { PureComponent, Suspense, useState } from "react";
import { useFirestore, useFirestoreCollection, useStorage } from "reactfire";
//@ts-ignore
import listeA from "./Liste A.mp3";
//@ts-ignore
import listeB from "./Liste B.mp3";
//@ts-ignore
import pretest from "./Pretest.mp3";

function formatSecondsAsTime(secs: number) {
  var hr = Math.floor(secs / 3600);
  var min: number | string = Math.floor((secs - hr * 3600) / 60);
  var sec: number | string = Math.floor(secs - hr * 3600 - min * 60);

  if (min < 10) {
    min = "0" + min;
  }
  if (sec < 10) {
    sec = "0" + sec;
  }

  return min + ":" + sec;
}

interface Props {
  audioSource: string;
  user: string,
  storage: any
  users: any
  timestamps: any
}
interface State {
  audioChunks: any[]
  duration: number
  currentTime: number,
  started: boolean,
  loading: boolean,
  timestamps: number[]
}

export class AudioRecorderClass extends PureComponent<Props, State, any> {
  private mediaRecorder: MediaRecorder;
  private ac: AudioContext;
  private dest: MediaStreamAudioDestinationNode;
  constructor(props: any) {
    super(props)
    this.ac = new AudioContext();
    this.dest = this.ac.createMediaStreamDestination()
    this.mediaRecorder = new MediaRecorder(this.dest.stream)
    this.state = {
       audioChunks: [],
       duration:0,
       currentTime:0,
       started: false,
       loading: false,
       timestamps: []
    }
  }
  
  start = () => {
    const {audioSource} = this.props
    let audio = new Audio(
      audioSource === "listeA"
        ? listeA
        : audioSource === "listeB"
        ? listeB
        : pretest
    );
    let audio2 = new Audio(
      audioSource === "listeA"
        ? listeA
        : audioSource === "listeB"
        ? listeB
        : pretest
    );
    const track = this.ac.createMediaElementSource(audio);
    track.connect(this.dest);
    audio.play();
    audio2.play();
    audio2.ontimeupdate = (e: any) => {
      this.setState({
        duration: audio2.duration,
        currentTime: audio2.currentTime
      })
      if (audio2.duration === audio2.currentTime) this.stop();
    };

    this.mediaRecorder.start(100);

    this.mediaRecorder.addEventListener("dataavailable", this.onDataAvailable);
    this.mediaRecorder.onstop = (e) => {
      audio.pause()
      audio2.pause();
    };
    this.setState({started:true})
  };

  stop() {
    const {
      audioChunks,
      timestamps
    } = this.state;
    this.mediaRecorder?.stop();
    this.props.users.add({ user: this.props.user });
    this.props.timestamps.add({ timestamps, user: this.props.user, audioSource: this.props.audioSource });
    let ref = this.props.storage.child("clips/" + this.props.audioSource + '/' + this.props.audioSource + '_' + this.props.user + ".webm");
    this.setState({ loading: true, started: false });
    ref
      .put(new Blob(audioChunks, {type:'audio/ogg'}))
      .then(() => this.setState({ loading: false }));
  }

  onClick = () => {
    this.setState(state => {
      let newClickTimes = state.timestamps;
      newClickTimes.push(state.currentTime);

      return {timestamps: newClickTimes}
    })
      const osc = this.ac.createOscillator();
      osc.start(0);
      setTimeout(() => {
        osc.stop(0);
      }, 50);
      osc.connect(this.dest);
  };
  onDataAvailable = (e: BlobEvent) => {
    console.log("dataAvailable");

    this.setState(state => { 
      let chunks = state.audioChunks;
      chunks.push(e.data);
      return {audioChunks: chunks}
    });
  };
  

  render() {
    const {currentTime, duration, loading, started } = this.state
    return (
      <Suspense fallback={<div>loading</div>}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "50vh",
          margin: "5rem",
        }}
      >
        {!started && (
          <button
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 40,
              fontSize: "4rem",
            }}
            onClick={() => this.start()}
          >
            start
          </button>
        )}
        {started && (
          <button
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 40,
              fontSize: "4rem",
            }}
            onClick={() => this.onClick()}
            autoFocus
            tabIndex={0}
            onKeyDown={(e) => console.log("key", e.key)}
          >
            CLICK HERE
          </button>
        )}
        <p style={{ whiteSpace: "nowrap" }}>
          {formatSecondsAsTime(currentTime) +
            " / " +
            formatSecondsAsTime(duration)}
        </p>
        {loading && <h1 style={{ color: "red" }}>uploading, please wait</h1>}
      </div>
    </Suspense>
    )
  }
}


export function AudioRecorder({audioSource, user}: Props){
  const storage = useStorage().ref();
  const users = useFirestore().collection("users");
  const timestamps = useFirestore().collection("timestamps");
  return <AudioRecorderClass 
    audioSource={audioSource}
    user={user}
    storage={storage}
    users={users}
    timestamps={timestamps}
  />

}
