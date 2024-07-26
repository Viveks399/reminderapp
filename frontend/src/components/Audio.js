import React, { useState, useRef } from "react";

const Audio = () => {
  if (
    !("webkitSpeechRecognition" in window) &&
    !("SpeechRecognition" in window)
  ) {
    alert("Sorry, your browser doesn't support speech recognition.");
  }

  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);

  const handleStartRecording = async () => {
    setIsRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      const blob = event.data;
      setAudioBlob(blob);
      const url = URL.createObjectURL(blob);
      setAudioURL(url);
    };

    mediaRecorder.start();
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    mediaRecorderRef.current.stop();
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl mb-4">Audio Recorder</h1>
      <div className="mb-4">
        {isRecording ? (
          <button
            onClick={handleStopRecording}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Stop Recording
          </button>
        ) : (
          <button
            onClick={handleStartRecording}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Start Recording
          </button>
        )}
      </div>
      {audioURL && (
        <div className="mt-4">
          <audio controls src={audioURL} />
        </div>
      )}
    </div>
  );
};

export default Audio;
