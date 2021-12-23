import { useState, useEffect } from "react";
import VideoFrame from "./VideoFrame";
const socket = io("http://localhost:8000");
function App() {
  const [chats, setChats] = useState([]);
  const [myName, setMyName] = useState("");
  const [txt, setTxt] = useState("");
  const [chat, setChat] = useState("");
  const [users, setUsers] = useState([]);
  const [myFile, setMyFile] = useState("");
  const [emo, setEmo] = useState(false);
  const [vidility, setVidility] = useState(false);
  const emojis = [
    "✌",
    "😂",
    "😝",
    "😁",
    "😱",
    "👉",
    "🙌",
    "🍻",
    "🔥",
    "🌈",
    "☀",
    "🎈",
    "🌹",
    "💄",
    "🎀",
    "⚽",
    "🎾",
    "🏁",
    "😡",
    "👿",
    "🐻",
    "🐶",
    "🐬",
    "🐟",
    "🍀",
    "👀",
    "🚗",
    "🍎",
    "💝",
    "💙",
    "👌",
    "❤",
    "😍",
    "😉",
    "😓",
    "😳",
    "💪",
    "💩",
    "🍸",
    "🔑",
    "💖",
    "🌟",
    "🎉",
    "🌺",
    "🎶",
    "👠",
    "🏈",
    "⚾",
    "🏆",
    "👽",
    "💀",
    "🐵",
    "🐮",
    "🐩",
    "🐎",
    "💣",
    "👃",
    "👂",
    "🍓",
    "💘",
    "💜",
    "👊",
    "💋",
    "😘",
    "😜",
    "😵",
    "🙏",
    "👋",
    "🚽",
    "💃",
    "💎",
    "🚀",
    "🌙",
    "🎁",
    "⛄",
    "🌊",
    "⛵",
    "🏀",
    "🎱",
    "💰",
    "👶",
    "👸",
    "🐰",
    "🐷",
    "🐍",
    "🐫",
    "🔫",
    "👄",
    "🚲",
    "🍉",
    "💛",
    "💚",
  ];
  const join = (e) => {
    if (e.keyCode == 13) {
      socket.emit("join", e.target.value);
      setMyName(e.target.value);
      setChats([
        ...chats,
        {
          type: "text",
          msg: "joined the chat",
          loc: "center",
          action: "light text-success shadow",
          name: "you",
        },
      ]);
    }
  };

  socket.on("new", (name) => {
    setChats([
      ...chats,
      {
        type: "text",
        msg: `joined the chat`,
        loc: "center",
        action: "light text-success shadow",
        name: name,
      },
    ]);

    setUsers([...users, name]);
  });
  socket.on("left", (name) => {
    if (name !== null) {
      setChats([
        ...chats,
        {
          type: "text",
          msg: `left the chat`,
          loc: "center",
          action: "light  text-danger shadow",
          name: name,
        },
      ]);
      let usr = users;
      for (let i = 0; i < usr.length; i++) {
        usr.splice(i, 1);
      }
      setUsers(usr);
    }
  });
  socket.on("message", (data) => {
    if (data.type == "text") {
      setChats([
        ...chats,
        {
          type: "text",
          msg: `${data.message}`,
          loc: "left",
          action: "dark",
          name: data.name,
        },
      ]);
    }
    if (data.type == "file") {
      setChats([
        ...chats,
        {
          type: "file",
          loc: "left",
          name: data.name,
          url: data.url,
        },
      ]);
    }
  });
  const word = (sen, num) => {
    return sen.trim().split(" ")[num];
  };
  const uniSend = () => {
    let cmd = word(chat, 0) == "cmd";
    if (cmd) {
      console.log(cmd);
      if (word(chat, 1) == "clear") {
        setChats([]);
      }
      if (word(chat, 1) == "lorem") {
        const lorem =
          "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ratione neque aut et possimus, dolorem quam, praesentium quis nisi ut enim labore perspiciatis saepe quisquam aliquid, corrupti nobis repellendus omnis itaque!";
        setChats([
          ...chats,
          {
            type: "text",
            msg: `${lorem}`,
            name: "you",
            action: "dark",
            loc: "right",
          },
        ]);
        socket.emit("send", { type: "text", msg: lorem });
      }
    } else {
      setChats([
        ...chats,
        {
          type: "text",
          msg: `${chat}`,
          name: "you",
          action: "dark",
          loc: "right",
        },
      ]);
      socket.emit("send", { type: "text", msg: chat });
    }

    setChat("");
  };
  const send = (e) => {
    if (myName == undefined) {
      window.location.reload();
    }
    if (e.keyCode == 13 && chat !== "") {
      uniSend();
    }
  };

  const btnSend = () => {
    if (myName == undefined) {
      window.location.reload();
    }
    if (chat !== "") {
      uniSend();
    }
  };
  const linkify = (data) => {
    let arr = data.split(" ");
    function isValidURL(str) {
      var res = str.match(
        /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
      );
      let stmnt = res !== null;
      if (stmnt) {
        return (
          <a href={str} key={str + Math.random() * 1000} target="_blank">
            {str}
          </a>
        );
      } else {
        return str;
      }
    }
    let alldata = arr.map((a) => {
      return isValidURL(a);
    });
    return alldata;
  };
  const handleFile = (e) => {
    let el = e.target;
    function loadAsUrl() {
      var selected = e.target.files;
      var fileToLoad = selected[0];
      var fileReader = new FileReader();
      fileReader.onload = function (fle) {
        let dataUrl = fle.target.result;
        setChats([
          ...chats,
          { type: "file", url: dataUrl, name: "you", loc: "right" },
        ]);
        socket.emit("send", { type: "file", url: dataUrl });
      };
      fileReader.readAsDataURL(fileToLoad);
    }
    loadAsUrl();
  };
  const mention = (e) => {
    setChat(chat + " @" + e.target.textContent + " ");
    document.querySelector("#chatbox").focus();
  };
  const emoShow = (e) => {
    let x = e.clientX;
    let y = e.clientY;
    if (emo) {
      setEmo(false);
    } else if (myName !== "") {
      setEmo(true);

      // let myel = document.querySelector("#emos");
      // console.log(myel);
      // myel.style = `position:fixed; top:${y}px; left:${x}px; overflow:auto;max-height:15rem;max-width:15rem;`;
    }
  };
  return (
    <div className="App">
      <div className="shadow p-2 mb-4 d-flex justify-content-between">
        <h1>
          <img
            src="../logo.png"
            alt="cmd app logo"
            style={{ height: "4rem" }}
            draggable="false"
          />
        </h1>
        <div className="d-flex justify-content-space-between">
          <div
            className="shadow p-2 d-flex bg-white justify-content-center align-items-center rounded-circle"
            style={{
              position: "absolute",
              right: "6rem",
              width: "3rem",
              height: "3rem",
            }}
            onClick={() => {
              if (vidility) {
                setVidility(false);
                localStream.getVideoTracks()[0].stop();
              } else {
                setVidility(true);
              }
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2V5zm11.5 5.175 3.5 1.556V4.269l-3.5 1.556v4.35zM2 4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H2z"
              />
            </svg>
          </div>
          {vidility ? <VideoFrame socket={socket} /> : ""}

          <div
            className="shadow p-3 user-select-none"
            style={{
              position: "fixed",
              right: 0,
              height: "5rem",
              width: "5rem",
              overflowY: "auto",
            }}
          >
            {users.map((el) => {
              return (
                <div
                  className="pl-1 text-truncate text-wrap"
                  onClick={mention}
                  key={Math.random() * 10000}
                  style={{ cursor: "pointer" }}
                >
                  {el}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div onDoubleClick={emoShow}>
        {chats.map((data) => {
          return data.type == "text" ? (
            <div
              key={Math.random() * 1000}
              className={`my-2`}
              style={{ textAlign: data.loc }}
            >
              <div
                className={`d-inline-block shadow bg-dark text-white user-select-none rounded-top px-4 mx-1 btn-${data.action}`}
                style={{
                  width: "clamp(50vw, 60vw, 80vw)",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setChat(` @${data.name} `);
                  document.querySelector("#chatbox").focus();
                }}
              >
                {data.name}
              </div>
              <div
                className={`d-inline-block  py-2 rounded-bottom px-4 mx-1 btn-${data.action}`}
                style={{
                  width: "clamp(50vw, 60vw, 80vw)",
                }}
              >
                {linkify(data.msg).map((nr) => {
                  if (typeof nr == "string") {
                    return ` ${nr} `;
                  } else {
                    return nr;
                  }
                })}
              </div>
            </div>
          ) : (
            <div
              key={Math.random() * 1000}
              className={`my-2 shadow`}
              style={{ textAlign: data.loc }}
            >
              <div
                className="d-inline-block px-3 mx-2 rounded-top btn-dark py-1 shadow"
                style={{ width: "15rem" }}
              >
                {data.name}
              </div>
              <br />
              <img
                style={{ width: "15rem" }}
                className="mx-2 rounded-bottom"
                src={data.url}
                alt="image"
              />
            </div>
          );
        })}
      </div>
      <br />
      <br />
      <br />
      {myName == "" ? (
        <div
          className="d-flex justify-content-center align-items-center bg-white fixed-top "
          style={{ height: "90vh" }}
        >
          <input
            type="text"
            value={txt}
            onChange={(e) => {
              setTxt(e.target.value);
            }}
            onKeyUp={join}
            className="shadow py-1 px-2"
            style={{
              border: "none",
              outline: "none",
              borderRadius: "10px",
              fontSize: "1.4rem",
            }}
            placeholder="enter your name to join"
          />
        </div>
      ) : (
        <div
          className="p-3 fixed-bottom d-flex bg-light"
          style={{ boxShadow: "0 0 10px rgba(0,0,0,.1)" }}
        >
          <input
            type="text"
            placeholder="chat.."
            value={chat}
            className="card py-1 px-2 shadow"
            style={{
              outline: "none",
              width: "50vw",
            }}
            onChange={(e) => {
              setChat(e.target.value);
            }}
            onKeyUp={send}
            id="chatbox"
          />
          <button className="btn mx-1 shadow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z" />
              <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0v5zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3z" />
            </svg>
          </button>

          <label htmlFor="file" className="btn btn-link mx-1 shadow text-link">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
              <path d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5A2 2 0 0 1 2 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-1.998 2zM14 2H4a1 1 0 0 0-1 1h9.002a2 2 0 0 1 2 2v7A1 1 0 0 0 15 11V3a1 1 0 0 0-1-1zM2.002 4a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1h-10z" />
            </svg>
          </label>
          <input
            type="file"
            id="file"
            className="d-none"
            onChange={handleFile}
            accept="image/*"
          />

          {emo ? (
            <div
              className="bg-white shadow p-2 rounded user-select-none"
              style={{
                position: "fixed",
                bottom: "5rem",
                width: "20rem",
                heigth: "30rem",
                right: "5rem",
              }}
              id="emos"
            >
              {emojis.map((data) => {
                return (
                  <span
                    className="d-inline-block m-1"
                    style={{ cursor: "pointer" }}
                    key={data}
                    onClick={(e) => {
                      setChat(chat + e.target.innerText);
                      document.querySelector("#chatbox").focus();
                    }}
                  >
                    {data}
                  </span>
                );
              })}
            </div>
          ) : (
            <div></div>
          )}

          <button
            className="btn shadow"
            onClick={() => {
              emo ? setEmo(false) : setEmo(true);
              document.querySelector("#chatbox").focus();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0-1a8 8 0 1 1 0 16A8 8 0 0 1 8 0z" />
              <path d="M4.285 6.433a.5.5 0 0 0 .683-.183A3.498 3.498 0 0 1 8 4.5c1.295 0 2.426.703 3.032 1.75a.5.5 0 0 0 .866-.5A4.498 4.498 0 0 0 8 3.5a4.5 4.5 0 0 0-3.898 2.25.5.5 0 0 0 .183.683zM7 9.5C7 8.672 6.552 8 6 8s-1 .672-1 1.5.448 1.5 1 1.5 1-.672 1-1.5zm4 0c0-.828-.448-1.5-1-1.5s-1 .672-1 1.5.448 1.5 1 1.5 1-.672 1-1.5z" />
            </svg>
          </button>
          <button
            className="btn btn-white text-success mx-1 shadow"
            onClick={btnSend}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89.471-1.178-1.178.471L5.93 9.363l.338.215a.5.5 0 0 1 .154.154l.215.338 7.494-7.494Z"
              />
            </svg>
          </button>
          <button className="btn shadow">setting</button>
        </div>
      )}
    </div>
  );
}

export default App;
