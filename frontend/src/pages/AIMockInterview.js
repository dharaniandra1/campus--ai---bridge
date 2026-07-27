import React, { useState, useRef } from "react";
import API from "../services/api";

function AIMockInterview() {

  const videoRef = useRef(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [answer, setAnswer] = useState("");
  const [listening, setListening] = useState(false);

  const [question] = useState(
    "What is React Hook?"
  );

  const [evaluation, setEvaluation] =
    useState(null);

  const startCamera = async () => {

    try {

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });

      videoRef.current.srcObject =
        stream;

      await videoRef.current.play();

      setCameraOn(true);

    } catch (error) {

      alert("Camera Access Denied");

    }

  };

  const stopCamera = () => {

    const stream =
      videoRef.current?.srcObject;

    if (stream) {

      stream.getTracks().forEach(
        track => track.stop()
      );

      videoRef.current.srcObject = null;

      setCameraOn(false);

    }

  };

  const startListening = () => {

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

      alert(
        "Speech Recognition Not Supported"
      );

      return;

    }

    const recognition =
      new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.start();

    setListening(true);

    recognition.onresult = (event) => {

      const transcript =
        event.results[0][0].transcript;

      setAnswer(transcript);

      setListening(false);

    };

    recognition.onerror = () => {

      setListening(false);

    };

    recognition.onend = () => {

      setListening(false);

    };

  };

  const evaluateAnswer = async () => {

    try {

      const res = await API.post(
        "/ai/evaluate-answer",
        {
          question,
          answer
        }
      );

      setEvaluation(res.data);

    } catch (error) {

      alert("Evaluation Failed");

    }

  };

  return (
    <div className="container mt-5">

      <h2>AI Mock Interview</h2>

      <div className="alert alert-primary">

        <strong>Question:</strong>

        <br />

        {question}

      </div>

      <button
        className="btn btn-primary me-2"
        onClick={startCamera}
      >
        Start Camera
      </button>

      <button
        className="btn btn-danger me-2"
        onClick={stopCamera}
      >
        Stop Camera
      </button>

      <button
        className="btn btn-success"
        onClick={startListening}
      >
        Start Answer
      </button>

      <br />
      <br />

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        width="500"
        height="350"
        style={{
          border: "2px solid black"
        }}
      />

      {cameraOn && (
        <div className="alert alert-success mt-3">
          Camera Active
        </div>
      )}

      {listening && (
        <div className="alert alert-warning mt-3">
          Listening...
        </div>
      )}

      <h4 className="mt-4">
        Candidate Answer
      </h4>

      <textarea
        className="form-control"
        rows="5"
        value={answer}
        readOnly
      />

      <button
        className="btn btn-dark mt-3"
        onClick={evaluateAnswer}
      >
        Evaluate Answer
      </button>

      {evaluation && (

        <div className="mt-4">

          <h4>Score</h4>

          <div className="alert alert-success">

            {evaluation.score}/10

          </div>

          <h4>Feedback</h4>

          <div className="alert alert-warning">

            {evaluation.feedback}

          </div>

          <h4>Strengths</h4>

          <ul className="list-group mb-3">

            {evaluation.strengths?.map(
              (item, index) => (
                <li
                  key={index}
                  className="list-group-item"
                >
                  {item}
                </li>
              )
            )}

          </ul>

          <h4>Improvements</h4>

          <ul className="list-group">

            {evaluation.improvements?.map(
              (item, index) => (
                <li
                  key={index}
                  className="list-group-item"
                >
                  {item}
                </li>
              )
            )}

          </ul>

        </div>

      )}

    </div>
  );
}

export default AIMockInterview;