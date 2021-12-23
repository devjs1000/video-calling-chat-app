import React, { useEffect, useState, useRef } from "react";
export default function VideoFrame({ socket }) {
  const [videos, setVideos] = useState([]);
  const [refs, setRefs] = useState([useRef(), useRef(), useRef()]);
  const vidRef = useRef();
  const vidRef2 = useRef();

  useEffect(() => {
    const myPeer = new Peer();
    console.log("effect");

    navigator.mediaDevices
      .getUserMedia({ video: { height: 300, width: 300 } })
      .then((stream) => {
        window.localStream = stream;
        document.getElementById("myVideo").srcObject = stream;

        myPeer.on("call", (call) => {
          call.answer(stream);
          call.on("stream", (userStream) => {
            console.log(vidRef);
            let vv = (
              <video
                src=""
                key={Math.random() * 100}
                autoPlay={true}
                ref={vidRef}
              ></video>
            );
            setVideos([...videos, vv]);
            vidRef.current.srcObject = userStream;

            console.log(videos);
          });
        });
        socket.on("user-joined-meeting", (userId) => {
          const call = myPeer.call(userId, stream);
          call.on("stream", (userStream) => {
            setVideos([
              ...videos,
              <video
                key={Math.random() * 100}
                autoPlay={true}
                ref={ref2}
              ></video>,
            ]);

            ref2.current.srcObject = userStream;
            console.log(videos);
          });
        });
      });

    myPeer.on("open", (id) => {
      socket.emit("meeting", 8777, id);
      console.log("open");
    });
  }, []);

  return (
    <div className="videoCallContainer">
      <video src="" autoPlay={true} muted={true} id="myVideo"></video>
      {videos}
    </div>
  );
}
