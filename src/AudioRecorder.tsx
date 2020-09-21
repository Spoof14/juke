import React, { PureComponent, Suspense, useState } from "react";
import { useFirestore, useFirestoreCollection, useStorage } from "reactfire";
//@ts-ignore
import listeA from "./Liste A.mp3";
//@ts-ignore
import listeB from "./Liste B.mp3";
//@ts-ignore
import pretest from "./Pretest.mp3";

export function AudioRecorderFunction({
  audioSource,
  user,
}: {
  audioSource: string;
  user: string;
}) {
  const [clickTimes, setClickTimes] = useState<number[]>([]);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>();
  const [started, setStarted] = useState(false);
  const [ac, setAc] = useState<AudioContext>();
  const [dest, setDest] = useState<MediaStreamAudioDestinationNode>();
  const [audioChunks, setAudioChunks] = useState<any[]>([]);
  const [audioBlob, setAudioBlob] = useState<Blob>();

  const [currTime, setCurrTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [loading, setLoading] = useState(false);
  const storage = useStorage().ref();
  const users = useFirestore().collection("users");
  const timestamps = useFirestore().collection("timestamps");

  const start = () => {
    const ac = new AudioContext();
    const dest = ac.createMediaStreamDestination();
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
    const track = ac.createMediaElementSource(audio);
    track.connect(dest);
    audio.play();
    audio2.play();
    audio2.ontimeupdate = (e: any) => {
      setDuration(Math.floor(audio2.duration));
      setCurrTime(Math.floor(audio2.currentTime));
      if (audio2.duration === audio2.currentTime) stop();
    };

    const mediaRecorder = new MediaRecorder(dest.stream);
    mediaRecorder.start(100);

    mediaRecorder.addEventListener("dataavailable", onDataAvailable);
    mediaRecorder.onstop = (e) => {
      audio2.pause();
      let blob = new Blob(audioChunks);
      setAudioBlob(blob);
    };
    setMediaRecorder(mediaRecorder);
    setStarted(true);
    setDest(dest);
    setAc(ac);
  };

  function stop() {
    mediaRecorder?.stop();
    users.add({ user });
    timestamps.doc(user).set({ timestamps: clickTimes, user });
    let ref = storage.child("clips/" + user + ".mp3");
    setLoading(true);
    ref
      .put(new Blob(audioChunks, { type: "audio/mp3" }))
      .then(() => setLoading(false));
    setStarted(false);
  }

  const onClick = () => {
    if (ac && dest) {
      let newClickTimes = clickTimes;
      newClickTimes.push(currTime);
      setClickTimes(newClickTimes);
      const osc = ac.createOscillator();
      osc.start(0);
      setTimeout(() => {
        osc.stop(0);
      }, 50);
      osc.connect(dest);
    }
  };
  const onDataAvailable = (e: BlobEvent) => {
    console.log("dataAvailable");
    let chunks = audioChunks;
    chunks.push(e.data);
    setAudioChunks(chunks);
  };
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
            onClick={() => start()}
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
            onClick={() => onClick()}
            autoFocus
            tabIndex={0}
            onKeyDown={(e) => console.log("key", e.key)}
          >
            CLICK WHEN YOU HEAR AN ACTION
          </button>
        )}
        <audio src={audioBlob && URL.createObjectURL(audioBlob)} />
        <p style={{ whiteSpace: "nowrap" }}>
          {formatSecondsAsTime(currTime) +
            " / " +
            formatSecondsAsTime(duration)}
        </p>
        {loading && <h1 style={{ color: "red" }}>uploading, please wait</h1>}
      </div>
    </Suspense>
  );
}

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
    let ref = this.props.storage.child("clips/" + this.props.audioSource + '/' + this.props.audioSource + '_' + this.props.user + ".mp3");
    this.setState({ loading: true, started: false });
    ref
      .put(new Blob(audioChunks, { type: "audio/mp3" }))
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
            CLICK WHEN YOU HEAR AN ACTION
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