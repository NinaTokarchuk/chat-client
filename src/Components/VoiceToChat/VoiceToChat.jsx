import React, { useEffect, useRef, useState } from "react";

const VoiceToChat = (options) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const recognitionRef = useRef(null);
    useEffect(() => {
        if (!('webkitSpeechRecognition' in window)) {
            console.error("Web speech api is not supported");
            return;
        }
        var recognition = new window.webkitSpeechRecognition();
        recognitionRef.current = recognition;
        recognition.interimResults = false;
        recognition.lang = "uk";
        recognition.continuous = true;

        if ("webkitSpeechGrammarList" in window) {
            const grammar = "#JSGF V1.0 grammar punctuation; public <punc> = . | , | ? | ! | ; | : ;"
            const speechRecognitionList = new window.webkitSpeechGrammarList();
            speechRecognitionList.addFromString(grammar, 1);
            recognition.grammars = speechRecognitionList;
        }

        recognition.onresult = (event) => {
            let text = "";
            for (let i = 0; i < event.results.length; i++) {
                text += event.results[i][0].transcript;
            }

            setTranscript(text);
        }

        recognition.onerror = (event) => {
            console.error("Speech recognition error: ", event.error);
        }

        recognition.onend = () => {
            console.log("ON END!!!!!!!!!!!!!!!!!!!!")
            recognition.start();
        }

        return () => {
            recognition.stop();
        }
    }, [])

    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            recognitionRef.current.start();
            setIsListening(true);
        }
    }

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
            setTranscript("");
        }
    }

    return {
        isListening,
        transcript,
        startListening,
        stopListening
    }
}

export default VoiceToChat;