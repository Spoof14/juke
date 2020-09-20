import React, { useState } from "react";
//@ts-ignore
import listeA from "./Liste A.mp3";
//@ts-ignore
import listeB from "./Liste B.mp3";

export default function AudioRecorder({
  audioSource,
}: {
  audioSource: string;
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

  const start = () => {
    const ac = new AudioContext();
    const dest = ac.createMediaStreamDestination();
    let audio = new Audio(audioSource === "listeA" ? listeA : listeB);
    let audio2 = new Audio(audioSource === "listeA" ? listeA : listeB);
    const track = ac.createMediaElementSource(audio);
    track.connect(dest);
    audio.play();
    audio2.play();
    audio2.ontimeupdate = (e: any) => {
      setDuration(Math.floor(audio2.duration));
      setCurrTime(Math.floor(audio2.currentTime));
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

  const stop = () => {
    mediaRecorder?.stop();
    setStarted(false);
  };

  const onClick = () => {
    if (ac && dest) {
      let newClickTimes = clickTimes;
      newClickTimes.push(currTime);
      setClickTimes(newClickTimes);
      console.log("click");
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
      {started && <button onClick={() => stop()}>stop</button>}
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
        {formatSecondsAsTime(currTime) + " / " + formatSecondsAsTime(duration)}
      </p>
    </div>
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
