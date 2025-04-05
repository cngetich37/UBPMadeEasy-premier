import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FiSend, FiMic, FiPlus, FiTrash, FiMenu } from "react-icons/fi";
import { GiSpeaker } from "react-icons/gi";
import { Helmet } from "react-helmet";

// Helper function to normalize words (e.g., "watches" -> "watch")
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

// Convert words to numbers (e.g., "twenty-five" → 25)
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

// Extract numbers from text input (e.g., "5 outlets" → [5])
const extractNumbers = (text) => {
  const words = text.toLowerCase().split(/\s+/);
  let extractedNumbers = [];

  for (let i = 0; i < words.length; i++) {
    let word = words[i];

    if (numberWords[word]) {
      extractedNumbers.push(numberWords[word]);
    } else if (/\d+/.test(word)) {
      extractedNumbers.push(parseInt(word));
    } else if (word.includes("-")) {
      let num = wordsToNumber(word);
      if (num > 0) extractedNumbers.push(num);
    } else if (word === "over" && i + 1 < words.length) {
      let nextWord = words[i + 1];
      if (numberWords[nextWord] || /\d+/.test(nextWord)) {
        let num = numberWords[nextWord] || parseInt(nextWord);
        extractedNumbers.push(num + 1); // "over 5" → 6
      }
    }
  }
  return extractedNumbers;
};

const UBPAgent = () => {
  // State initialization
  const [prompt, setPrompt] = useState("");
  const [sessions, setSessions] = useState(
    JSON.parse(localStorage.getItem("ubpai_sessions")) || { "Chat 1": [] }
  );
  const [currentSession, setCurrentSession] = useState(
    localStorage.getItem("ubpai_currentSession") || "Chat 1"
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [typing, setTyping] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [businessData, setBusinessData] = useState(
    JSON.parse(localStorage.getItem("ubpai_businessData")) || []
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For mobile sidebar toggle

  const chatContainerRef = useRef(null);

  // Example prompts (unchanged)
  const examplePrompts = [
    "Business charges for MPESA with 5 outlets?",
    "What is the business activity code for betting shop?",
    "Kinyozi with 2 employees?",
    "Food storage with 1000 sq.m?",
  ];

  // Save sessions to localStorage
  useEffect(() => {
    localStorage.setItem("ubpai_sessions", JSON.stringify(sessions));
  }, [sessions]);

  // Save current session to localStorage
  useEffect(() => {
    localStorage.setItem("ubpai_currentSession", currentSession);
  }, [currentSession]);

  // Fetch business data (unchanged)
  useEffect(() => {
    if (!businessData.length) {
      fetch("https://effortlessubp-backend.onrender.com/api/naics/")
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

  // Scroll to bottom of chat container
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [sessions, typing]);

  // Handle sending a prompt
  const handleSendPrompt = async (inputPrompt = prompt) => {
    if (!inputPrompt.trim()) return;

    // Add user message to the current session
    setSessions((prev) => ({
      ...prev,
      [currentSession]: [
        ...(prev[currentSession] || []),
        { role: "user", text: inputPrompt },
      ],
    }));

    // Step 1: Match business activity
    const bestMatch = businessData.find((item) =>
      normalizeWord(inputPrompt.toLowerCase()).includes(
        normalizeWord(item.commonBusinessActivity.toLowerCase())
      )
    );

    if (!bestMatch) {
      const errorMessage =
        "I am sorry, I didn't understand you.";
      setSessions((prev) => ({
        ...prev,
        [currentSession]: [
          ...(prev[currentSession] || []),
          { role: "assistant", text: errorMessage },
        ],
      }));
      return;
    }

    try {
      const response = await fetch(
        `https://effortlessubp-backend.onrender.com/api/naics/businessactivities/${bestMatch.businessActivity}`
      );
      const businessDetails = await response.json();

      if (!businessDetails.financeActs) {
        throw new Error("Invalid business details response");
      }

      // Step 2: Extract numbers (outlets/employees)
      const requestedNumbers = extractNumbers(inputPrompt);

      // Extract size-based classification (e.g., "1000 sq.m" or "500m²")
      const sizeMatch = inputPrompt.match(
        /(\d+)\s*(sq\.?m|square meters?|m²)/i
      );
      const requestedSize = sizeMatch ? parseInt(sizeMatch[1]) : null;

      let selectedCategory = null;

      if (requestedNumbers.length > 0) {
        selectedCategory = businessDetails.financeActs.find((item) => {
          const numbersInDescription =
            item.businessDescription.match(/\d+/g)?.map(Number) || [];

          return requestedNumbers.some((num) => {
            if (numbersInDescription.length === 2) {
              return (
                num >= numbersInDescription[0] && num <= numbersInDescription[1]
              ); // Matches "X-Y range"
            } else if (numbersInDescription.length === 1) {
              return num > numbersInDescription[0]; // Matches "over X"
            }
            return false;
          });
        });

        // Handle specific cases like "up to X", "less than X", "over X"
        if (!selectedCategory) {
          selectedCategory = businessDetails.financeActs.find((item) => {
            const desc = item.businessDescription.toLowerCase();

            if (/up to|upto/.test(desc)) {
              const match = item.businessDescription.match(
                /\b(up to|upto)\s+(\d+)/i
              );
              if (match)
                return requestedNumbers.some(
                  (num) => num <= parseInt(match[2], 10)
                );
            }

            if (/less than/.test(desc)) {
              const match = item.businessDescription.match(
                /\bless\s+than\s+(\d+)/i
              );
              if (match)
                return requestedNumbers.some(
                  (num) => num < parseInt(match[1], 10)
                );
            }

            if (/over/.test(desc)) {
              const match = item.businessDescription.match(/\bover\s+(\d+)/i);
              if (match)
                return requestedNumbers.some(
                  (num) => num > parseInt(match[1], 10)
                );
            }

            return false;
          });
        }
      }

      if (requestedSize) {
        if (!selectedCategory) {
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
      }

      // Fallback to generic category if no exact match
      if (!selectedCategory && businessDetails.financeActs.length > 0) {
        selectedCategory =
          businessDetails.financeActs.find(
            (item) => !/\d+/.test(item.businessDescription)
          ) || businessDetails.financeActs[0];
      }

      let responseText = "";

      if (selectedCategory) {
        // Convert charges to numbers, treating "-" as 0
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

        responseText = `This is the business activity information for ${bestMatch.commonBusinessActivity}:\n\n`;
        responseText += `Industry: ${bestMatch.industry}\n`;
        responseText += `Business Category: ${bestMatch.businessCategory}\n`;
        responseText += `Business Subcategory: ${bestMatch.businessSubCategory}\n`;
        responseText += `Business Activity: ${bestMatch.businessActivity}\n`;
        responseText += `For a ${selectedCategory.businessDescription}, the charges are:\n\n`;
        responseText += `Trade License:  ${tradeLicence}\n`;
        responseText += `Fire Clearance:  ${fireClearance}\n`;
        responseText += `Food Hygiene:  ${foodHygiene}\n`;
        responseText += `Health Certificate:  ${healthCertificate}\n`;
        responseText += `Pest Control:  ${pestControl}\n\n`;
        responseText += `Total Charges:  ${totalCharges}\n\n`;
      } else {
        responseText = `I found the business "${bestMatch.commonBusinessActivity}", but I couldn't find specific charges based on your criteria.`;
      }

      // Step 3: Add assistant response to chat UI
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
    } catch (error) {
      console.error("Error fetching business charges:", error);
      const errorMessage =
        "There was an issue retrieving the requested information. Please try again later.";
      setSessions((prev) => ({
        ...prev,
        [currentSession]: [
          ...(prev[currentSession] || []),
          { role: "assistant", text: errorMessage },
        ],
      }));
    }
  };

  // Simulate typing effect
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

  // Handle deleting a session
  const handleDeleteSession = (session) => {
    const updatedSessions = { ...sessions };
    delete updatedSessions[session];
    setSessions(updatedSessions);
    if (currentSession === session) {
      const nextSession = Object.keys(updatedSessions)[0] || "Chat 1";
      setCurrentSession(nextSession);
    }
  };

  // Handle voice input
  const handleVoiceInput = () => {
    setIsListening(true);
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setPrompt(speechResult);
      handleSendPrompt(speechResult);
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

  // Handle reading text aloud
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

      // Find a female voice (e.g., "Google US English Female" or "Microsoft Zira")
      const femaleVoice = voices.find(
        (voice) =>
          voice.name.includes("Female") || // Generic female voices
          voice.name.includes("Zira") || // Microsoft Zira (female voice)
          voice.name.includes("Google US English Female") // Google female voice
      );

      // Set the voice if found, otherwise use the default voice
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Sorry, text-to-speech is not supported in your browser.");
    }
  };

  return (
    <>
      <Helmet>
        <title>UBP Made Easy - Streamline UBP</title>
        <meta
          name="description"
          content="Get accurate finance act estimates based on your industry and size. Powered by AI, UBP Assistant helps businesses with business activity search."
        />
        <meta
          name="keywords"
          content="Business permit, AI Business Assistant, Business charges Estimation, Financial Act Planning"
        />
      </Helmet>
      <div className="flex flex-col md:flex-row h-screen bg-[#F5F5F5] p-4 gap-4">
        {/* Mobile Sidebar Toggle Button */}
        <button
          className="md:hidden p-2 bg-emerald-900 text-white rounded-lg"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <FiMenu className="text-lg" />
        </button>

        {/* Sidebar for Chat Sessions */}
        <div
          className={`${
            isSidebarOpen ? "block" : "hidden"
          } md:block w-full md:w-1/4 bg-white p-4 rounded-lg shadow-lg`}
        >
          <h2 className="text-xl font-bold text-emerald-900 mb-4">Chats</h2>
          <button
            className="w-full bg-emerald-900 text-white p-2 rounded-lg flex items-center justify-center gap-2 hover:bg-[#05482D] transition-colors"
            onClick={() => {
              const newSessionName = `Chat ${Object.keys(sessions).length + 1}`;
              setSessions((prev) => ({
                ...prev,
                [newSessionName]: [],
              }));
              setCurrentSession(newSessionName);
              setIsSidebarOpen(false); // Close sidebar on mobile after creating a new session
            }}
          >
            <FiPlus className="text-lg" /> New Chat
          </button>
          <div className="mt-4 space-y-2">
            {Object.keys(sessions).map((session) => (
              <div
                key={session}
                className="flex justify-between items-center p-2 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <span
                  className="text-emerald-900"
                  onClick={() => {
                    setCurrentSession(session);
                    setIsSidebarOpen(false); // Close sidebar on mobile after selecting a session
                  }}
                >
                  {session}
                </span>
                <FiTrash
                  className="text-red-500 hover:text-red-600 cursor-pointer"
                  onClick={() => handleDeleteSession(session)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Interface */}
        <div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
          <header className="bg-emerald-900 p-4">
            <h1 className="text-2xl font-bold text-center text-white">
              <span className="text-[#FFD700]">UBP</span>Agent
            </h1>
          </header>
          <div
            ref={chatContainerRef}
            className="flex-1 p-4 overflow-y-auto space-y-4"
          >
            {sessions[currentSession]?.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-[#FFD700] text-emerald-900"
                      : "bg-emerald-900 text-white"
                  }`}
                >
                  {message.text}
                </div>
              </motion.div>
            ))}
            {typing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex justify-start"
              >
                <div className="max-w-[80%] p-3 bg-emerald-900 text-white rounded-lg">
                  {typing}
                </div>
              </motion.div>
            )}
          </div>
          <div className="p-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                className="flex-1 p-2 border border-emerald-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                placeholder="Enter your prompt..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSendPrompt();
                  }
                }}
              />
              <div className="flex gap-2">
                <button
                  className="bg-emerald-900 text-white p-2 rounded-lg hover:bg-[#05482D] transition-colors"
                  onClick={() => handleSendPrompt()}
                >
                  <FiSend className="text-lg" />
                </button>
                <button
                  className={`${
                    isListening ? "bg-emerald-900" : "bg-[#FFD700]"
                  } text-emerald-900 p-2 rounded-lg hover:bg-[#E6B800] transition-colors`}
                  onClick={handleVoiceInput}
                >
                  <FiMic className="text-lg" />
                </button>
                <button
                  onClick={() =>
                    sessions[currentSession]?.length
                      ? handleReadText(
                          sessions[currentSession].slice(-1)[0].text
                        )
                      : null
                  }
                  className="bg-emerald-900 text-[#FFD700] p-2 rounded-lg hover:bg-[#05482D] transition-colors"
                >
                  <GiSpeaker className="text-lg" />
                </button>
              </div>
            </div>
            <p className="text-sm text-emerald-900 text-center mt-2 italic">
              UBPAgent can make mistakes. Please consult the Finance Act.
            </p>
          </div>
          <div className="p-4 bg-gray-50">
            <h2 className="text-lg font-bold text-emerald-900 mb-2">
              Example Prompts:
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {examplePrompts.map((ex, index) => (
                <button
                  key={index}
                  className="p-2 bg-emerald-900 text-white rounded-lg hover:bg-[#05482D] transition-colors text-sm text-left"
                  onClick={() => handleSendPrompt(ex)}
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UBPAgent;