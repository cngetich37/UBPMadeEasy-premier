import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  FiSend,
  FiMic,
  FiPlus,
  FiTrash,
  FiChevronDown,
  FiHelpCircle,
  FiSmile,
  FiThumbsUp,
} from "react-icons/fi";
import { MdOutlineChat } from "react-icons/md";
import { GiSpeaker } from "react-icons/gi";
import { Helmet } from "react-helmet";

const normalizeWord = (word) => {
  // Convert to lowercase for consistent comparison
  word = word.toLowerCase();

  // Handle exceptions explicitly
  const exceptions = {
    barbershop: "barbershop", // Ensure "barbershop" stays as "barbershop"
    bars: "bars", // Ensure "bars" stays as "bars"
  };

  if (exceptions[word]) return exceptions[word];

  // General pluralization rules
  if (word.endsWith("ies")) {
    return word.slice(0, -3) + "y"; // Convert "butcheries" -> "butchery"
  } else if (
    word.endsWith("es") &&
    !word.endsWith("ss") &&
    !word.endsWith("us")
  ) {
    return word.slice(0, -2); // Convert "watches" -> "watch", "boxes" -> "box"
  } else if (
    word.endsWith("s") &&
    word.length > 1 &&
    !word.endsWith("ss") &&
    !word.endsWith("rs") // Prevents "bars" from becoming "bar"
  ) {
    return word.slice(0, -1); // Convert "cars" -> "car"
  }

  return word; // Return the word as is if no rules apply
};

const numberWords = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
  twenty: 20,
  thirty: 30,
  forty: 40,
  fifty: 50,
  sixty: 60,
  seventy: 70,
  eighty: 80,
  ninety: 90,
  hundred: 100,
  thousand: 1000,
};

const wordsToNumber = (words) => {
  let num = 0;
  let temp = 0;

  words.split(/[\s-]+/).forEach((word) => {
    if (numberWords[word] !== undefined) {
      temp += numberWords[word];
    } else if (word === "hundred") {
      temp *= 100;
    } else if (word === "thousand") {
      temp *= 1000;
      num += temp;
      temp = 0;
    }
  });

  return num + temp;
};

const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const UBPAi = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [sessions, setSessions] = useState(() => {
    return (
      JSON.parse(localStorage.getItem("ubpai_sessions")) || { "Chat 1": [] }
    );
  });
  const [currentSession, setCurrentSession] = useState(
    localStorage.getItem("ubpai_currentSession") || "Chat 1"
  );
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [typing, setTyping] = useState("");
  const [businessData, setBusinessData] = useState([]);
  const [showPrompts, setShowPrompts] = useState(false); // State to toggle example prompts
  const [showHelp, setShowHelp] = useState(false); // State to toggle help section
  const chatContainerRef = useRef(null);

  const examplePrompts = [
    "Business charges for MPESA with 5 outlets?",
    "What is the business activity code for betting shop?",
    "Charges for a barbershop with 3 employees?",
    "Food storage with 1000 sq.m?",
  ];

  const greetings = [
    "hello",
    "hi",
    "hey",
    "good morning",
    "good afternoon",
    "good evening",
    "howdy",
    "greetings",
    "salutations",
    "hi there",
    "hello there",
    "hey there",
    "good day",
    "good to see you",
    "nice to see you",
    "how are you",
    "what's up",
    "how's it going",
    "how are things",
    "how's everything",
    "how's life",
  ];

  useEffect(() => {
    localStorage.setItem("ubpai_sessions", JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem("ubpai_currentSession", currentSession);
  }, [currentSession]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [sessions, typing]);

  useEffect(() => {
    if (!businessData.length) {
      fetch("https://ubpace-backend.cnetechafrica.org/api/naics/")
        .then((res) => res.json())
        .then((data) => {
          setBusinessData(data);
          localStorage.setItem("ubpai_businessData", JSON.stringify(data));
        })
        .catch((err) =>
          console.error(
            "Sorry, I did not understand you. Please try again",
            err
          )
        );
    }
  }, [businessData.length]);

  useEffect(() => {
    // Add a welcome message when the chat is opened for the first time
    if (isOpen && sessions[currentSession]?.length === 0) {
      const greeting = getTimeBasedGreeting();
      const welcomeMessage = {
        role: "assistant",
        text: `${greeting}! I'm Collo, your UBP assistant! Need help finding business activities? I'm here to assist you!`,
      };
      setSessions((prev) => ({
        ...prev,
        [currentSession]: [...(prev[currentSession] || []), welcomeMessage],
      }));
      handleReadText(welcomeMessage.text);
    }
  }, [isOpen, currentSession, sessions]);

  const simulateTyping = (text, callback) => {
    let index = 0;
    setTyping("");
    const interval = setInterval(() => {
      if (index < text.length) {
        setTyping((prev) => prev + text[index]);
        index++;
      } else {
        clearInterval(interval);
        callback();
        setTyping("");
      }
    }, 50);
  };

  const extractNumbers = (text) => {
    const words = text.split(/\s+/);
    const numbers = words
      .map((word) => (numberWords[word] ? wordsToNumber(word) : parseInt(word)))
      .filter((num) => !isNaN(num));
    return numbers;
  };

  const handleSendMessage = async (prompt = input) => {
    if (!prompt.trim()) return;

    // Convert textual numbers to numeric values
    const normalizedPrompt = normalizeWord(prompt.toLowerCase());
    const convertedPrompt = normalizedPrompt
      .split(" ")
      .map((word) => (numberWords[word] ? wordsToNumber(word) : word))
      .join(" ");

    const userMessage = { role: "user", text: convertedPrompt };
    setSessions((prev) => ({
      ...prev,
      [currentSession]: [...(prev[currentSession] || []), userMessage],
    }));
    setInput("");

    let responseText = "I'm analyzing your request...";

    // Improved greeting detection logic
    const wordsInPrompt = normalizedPrompt.split(/\s+/); // Split input into words
    const isGreeting = wordsInPrompt.some((word) =>
      greetings.includes(word.toLowerCase())
    );

    if (isGreeting) {
      const greeting = getTimeBasedGreeting();
      responseText = `${greeting}! How can I assist you today?`;
    } else {
      const numbers = extractNumbers(prompt);
      if (numbers.length > 0) {
        responseText = `I detected the numbers: ${numbers.join(
          ", "
        )}. Let me find relevant business data.`;
      }

      const bestMatch = businessData.find((item) =>
        normalizedPrompt.includes(
          normalizeWord(item.commonBusinessActivity.toLowerCase())
        )
      );

      if (!bestMatch) {
        responseText = `I'm sorry, I didn't understand your question. Could you please rephrase it or try one of these examples?\n\n`;
        responseText += examplePrompts
          .map((prompt, index) => `${index + 1}. ${prompt}`)
          .join("\n");
      } else {
        try {
          const response = await fetch(
            `https://ubpace-backend.cnetechafrica.org/api/naics/businessactivities/${bestMatch.businessActivity}`
          );
          const businessDetails = await response.json();

          if (!businessDetails.financeActs) {
            throw new Error("Invalid business details response");
          }

          const requestedNumbers = prompt
            .split(" ")
            .map((word) =>
              numberWords[word] ? wordsToNumber(word) : parseInt(word)
            )
            .filter((num) => !isNaN(num));
          const sizeMatch = prompt.match(/(\d+)\s*(sq\.?m|square meters?|m²)/i);
          const requestedSize = sizeMatch ? parseInt(sizeMatch[1]) : null;

          let selectedCategory = null;

          if (requestedNumbers.length > 0) {
            selectedCategory = businessDetails.financeActs.find((item) => {
              const numbersInDescription =
                item.businessDescription.match(/\d+/g)?.map(Number) || [];

              return requestedNumbers.some((num) => {
                if (numbersInDescription.length === 2) {
                  return (
                    num >= numbersInDescription[0] &&
                    num <= numbersInDescription[1]
                  );
                } else if (numbersInDescription.length === 1) {
                  return num > numbersInDescription[0];
                }
                return false;
              });
            });
          }

          if (requestedSize) {
            selectedCategory = businessDetails.financeActs.find((item) => {
              const desc = item.businessDescription.toLowerCase();

              if (/up to|upto/.test(desc)) {
                const match = item.businessDescription.match(
                  /\b(up to|upto)\s+(\d+)/i
                );
                if (match) return requestedSize <= parseInt(match[2], 10);
              }

              if (/less than/.test(desc)) {
                const match = item.businessDescription.match(
                  /\bless\s+than\s+(\d+)/i
                );
                if (match) return requestedSize < parseInt(match[1], 10);
              }

              if (/\b(\d+)\s*-\s*(\d+)/.test(item.businessDescription)) {
                const match =
                  item.businessDescription.match(/\b(\d+)\s*-\s*(\d+)/);
                if (match) {
                  const minSize = parseInt(match[1]);
                  const maxSize = parseInt(match[2]);
                  return requestedSize >= minSize && requestedSize <= maxSize;
                }
              }

              if (/over/.test(desc)) {
                const match = item.businessDescription.match(/\bover\s+(\d+)/);
                if (match) return requestedSize > parseInt(match[1], 10);
              }

              return false;
            });
          }

          if (!selectedCategory) {
            selectedCategory =
              businessDetails.financeActs.find(
                (item) => !/\d+/.test(item.businessDescription)
              ) ||
              businessDetails.financeActs[
                businessDetails.financeActs.length - 1
              ];
          }

          if (selectedCategory) {
            const parseCharge = (value) => (value === "-" ? 0 : Number(value));

            const tradeLicence = parseCharge(selectedCategory.tradeLicence);
            const fireClearance = parseCharge(selectedCategory.fireClearance);
            const foodHygiene = parseCharge(selectedCategory.foodHygiene);
            const healthCertificate = parseCharge(
              selectedCategory.healthCertificate
            );
            const pestControl = parseCharge(selectedCategory.pestControl);

            const totalCharges =
              tradeLicence +
              fireClearance +
              foodHygiene +
              healthCertificate +
              pestControl;

            responseText = `For a ${selectedCategory.businessDescription}, the charges are:\n\n`;
            responseText += `Trade License: ${tradeLicence}\n`;
            responseText += `Fire Clearance: ${fireClearance}\n`;
            responseText += `Food Hygiene:  ${foodHygiene}\n`;
            responseText += `Health Certificate: ${healthCertificate}\n`;
            responseText += `Pest Control: ${pestControl}\n\n`;
            responseText += `Total Charges: ${totalCharges}\n\n`;

            responseText += `This is the business activity information for ${bestMatch.commonBusinessActivity}:\n\n`;
            responseText += `Industry: ${bestMatch.industry}\n`;
            responseText += `Business Category: ${bestMatch.businessCategory}\n`;
            responseText += `Business Subcategory: ${bestMatch.businessSubCategory}\n`;
            responseText += `Business Activity: ${bestMatch.businessActivity}\n`;
          } else {
            responseText = `I found the business "${bestMatch.commonBusinessActivity}", but I couldn't find specific charges based on your criteria.`;
          }
        } catch (error) {
          console.error("Error fetching business charges:", error);
          responseText =
            "There was an issue retrieving the requested information. Please try again later.";
        }
      }
    }

    simulateTyping(responseText, () => {
      setSessions((prev) => ({
        ...prev,
        [currentSession]: [
          ...(prev[currentSession] || []),
          { role: "assistant", text: responseText },
        ],
      }));
      handleReadText(responseText);
    });
  };

  const handleVoiceInput = () => {
    setIsListening(true);
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.lang = "en-UK";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      const convertedSpeech = speechResult
        .split(" ")
        .map((word) => (numberWords[word] ? wordsToNumber(word) : word))
        .join(" ");
      setInput(convertedSpeech);
      handleSendMessage(convertedSpeech);
    };

    recognition.onspeechend = () => {
      recognition.stop();
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.start();
  };

  const handleReadText = (text) => {
    if ("speechSynthesis" in window) {
      // Modify the relevant parts of the response text
      const modifiedText = text.replace(
        /(Trade License:.*?)(\d+)\n|(Fire Clearance:.*?)(\d+)\n|(Food Hygiene:.*?)(\d+)\n|(Health Certificate:.*?)(\d+)\n|(Pest Control:.*?)(\d+)\n|(Total Charges:.*?)(\d+)\n/g,
        (
          match,
          tradeLabel,
          tradeNum,
          fireLabel,
          fireNum,
          foodLabel,
          foodNum,
          healthLabel,
          healthNum,
          pestLabel,
          pestNum,
          totalLabel,
          totalNum
        ) => {
          if (tradeLabel) return `${tradeLabel}${tradeNum} Kenya Shillings\n`;
          if (fireLabel) return `${fireLabel}${fireNum} Kenya Shillings\n`;
          if (foodLabel) return `${foodLabel}${foodNum} Kenya Shillings\n`;
          if (healthLabel)
            return `${healthLabel}${healthNum} Kenya Shillings\n`;
          if (pestLabel) return `${pestLabel}${pestNum} Kenya Shillings\n`;
          if (totalLabel) return `${totalLabel}${totalNum} Kenya Shillings\n`;
          return match;
        }
      );

      const utterance = new SpeechSynthesisUtterance(modifiedText);
      utterance.lang = "en-US";

      // Get the list of available voices
      const voices = window.speechSynthesis.getVoices();

      // Find a male voice (e.g., "Google US English Male" or "Microsoft David")
      const maleVoice = voices.find(
        (voice) =>
          voice.name.includes("Male") || // Generic male voices
          voice.name.includes("David") || // Microsoft David (male voice)
          voice.name.includes("Google US English Male") // Google male voice
      );

      // Set the voice if found, otherwise use the default voice
      if (maleVoice) {
        utterance.voice = maleVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Sorry, text-to-speech is not supported in your browser.");
    }
  };

  const handleDeleteSession = (session) => {
    const updatedSessions = { ...sessions };
    delete updatedSessions[session];
    setSessions(updatedSessions);
    if (currentSession === session) {
      const nextSession = Object.keys(updatedSessions)[0] || "Chat 1";
      setCurrentSession(nextSession);
    }
  };

  const handleClearChat = () => {
    setSessions((prev) => ({
      ...prev,
      [currentSession]: [], // Clear messages for the current session
    }));
  };

  return (
    <>
      <div className="fixed bottom-16 sm:bottom-20 md:bottom-20 lg:bottom-26 right-5 sm:right-10">
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="p-3 bg-[#FBCC1A] text-[#065A38] rounded-full shadow-lg"
          onClick={() => setIsOpen(!isOpen)}
        >
          <MdOutlineChat size={20} />
        </motion.button>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="w-80 md:w-96 max-w-sm md:max-w-md lg:max-w-lg h-96 max-h-[100vh] bg-white shadow-lg rounded-lg flex flex-col p-4 md:p-6"
          >
            {/* Clear Chat Icon */}
            <div className="flex justify-end">
              <button
                className="p-1 text-[#065A38] hover:text-red-500"
                onClick={handleClearChat}
              >
                <FiTrash />
              </button>
            </div>
            <div className="flex-1 overflow-auto" ref={chatContainerRef}>
              {sessions[currentSession]?.map((msg, idx) => (
                <div
                  key={idx}
                  className={`chat ${
                    msg.role === "user" ? "chat-end" : "chat-start"
                  }`}
                >
                  <div
                    className={`chat-bubble ${
                      msg.role === "user"
                        ? "bg-[#FBCC1A] text-[#065A38] text-sm"
                        : "bg-[#065A38] text-[#FBCC1A] text-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="chat chat-start">
                  <div className="chat-bubble bg-[#065A38] text-sm text-[#FBCC1A]">
                    {typing}
                  </div>
                </div>
              )}
            </div>
            {/* Session Dropdown */}
            <div className="flex flex-col sm:flex-row items-center gap-2 mt-2 w-full">
              <div className="flex w-full sm:flex-1">
                <input
                  type="text"
                  className="flex-1 p-2 border rounded-l w-full"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter prompt..."
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button
                  className="p-2 bg-[#065A38] text-white rounded-r"
                  onClick={() => {
                    if (input.trim()) {
                      handleSendMessage(input);
                      setInput("");
                    }
                  }}
                >
                  <FiSend />
                </button>
              </div>
              <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-start">
                <button
                  className={`p-2 ${
                    isListening ? "bg-red-500" : "bg-[#FBCC1A]"
                  } text-[#065A38] rounded-md`}
                  onClick={handleVoiceInput}
                >
                  <FiMic />
                </button>
                <button
                  className="p-2 bg-[#065A38] text-[#FBCC1A] rounded-md"
                  onClick={() =>
                    sessions[currentSession]?.length
                      ? handleReadText(
                          sessions[currentSession].slice(-1)[0].text
                        )
                      : null
                  }
                >
                  <GiSpeaker />
                </button>
              </div>
            </div>

            {/* View Prompts Button */}
            <div className="mt-2">
              <button
                className="flex items-center justify-center w-full p-2 bg-[#065A38] text-white rounded-md"
                onClick={() => setShowPrompts(!showPrompts)}
              >
                <FiChevronDown className="mr-2" />
                {showPrompts ? "Hide Prompts" : "View Prompts"}
              </button>
              {showPrompts && (
                <div className="mt-2 grid grid-cols-1 gap-2">
                  {examplePrompts.map((prompt, index) => (
                    <button
                      key={index}
                      className="p-2 bg-[#FBCC1A] text-[#065A38] rounded-md text-sm text-left"
                      onClick={() => handleSendMessage(prompt)}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Help Section */}
            <div className="mt-2">
              <button
                className="flex items-center justify-center w-full p-2 bg-[#065A38] text-white rounded-md"
                onClick={() => setShowHelp(!showHelp)}
              >
                <FiHelpCircle className="mr-2" />
                {showHelp ? "Hide Help" : "Help"}
              </button>
              {showHelp && (
                <div className="mt-2 p-2 bg-[#FBCC1A] text-[#065A38] rounded-md text-sm">
                  <p>Here are some tips to get the most out of Collo:</p>
                  <ul className="list-disc list-inside">
                    <li>Use natural language to ask questions.</li>
                    <li>
                      Try using numbers for specific queries (e.g., "salon with 2
                      employees").
                    </li>
                    <li>Click the microphone icon to use voice input.</li>
                    <li>Click the speaker icon to hear the last response.</li>
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default UBPAi;
