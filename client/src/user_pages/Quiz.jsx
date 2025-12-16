import React, { useState } from "react";
import { 
  BookOpen, 
  CheckCircle, 
  XCircle, 
  Trophy, 
  ArrowRight, 
  RefreshCw, 
  Timer,
  Play
} from "lucide-react";
import Sidebar1 from "../user_components/Sidebar.jsx";



// --- Mock Sidebar (Simplified for Game Focus) ---
const Sidebar = () => (
  <div>
    <Sidebar1/>
  </div>
);



// --- Helper: Quiz Parser (FIXED VERSION) ---
const parseQuizText = (text) => {
  const questions = [];
  const lines = text.split('\n');
  let currentQuestion = null;

  lines.forEach(line => {
    line = line.trim();
    if (!line) return;

    // 1. Detect Question (starts with "1.", "10.", etc.)
    if (/^\d+\./.test(line)) {
      if (currentQuestion) questions.push(currentQuestion);
      currentQuestion = {
        id: questions.length,
        question: line.replace(/^\d+\.\s*/, ''), // Remove the number
        options: [],
        correctAnswer: ''
      };
    }
    // 2. Detect Answer Key (looks for "Answer:-:")
    else if (line.toLowerCase().includes('answer:-:')) {
       if (currentQuestion) {
         const answerText = line.split(':-:')[1]?.trim() || "";
         currentQuestion.correctAnswer = answerText;
       }
    }
    // 3. Detect Options (Matches "A.", "a)", "(a)", "[A]", etc.)
    // FIXED: The regex is now more flexible
    else if (/^[\(\[]?[a-dA-D][\)\]\.]\s/.test(line)) {
      if (currentQuestion) {
        currentQuestion.options.push(line);
      }
    }
    // 4. Handle Multi-line Questions (Appends text if it's not an option/answer)
    else if (currentQuestion && currentQuestion.options.length === 0 && !line.toLowerCase().startsWith('answer')) {
       currentQuestion.question += " " + line;
    }
  });
  
  if (currentQuestion) questions.push(currentQuestion);
  return questions;
};


// --- Main Game Component ---
const Quiz = () => {
  // Game States: 'idle' (upload), 'loading', 'playing', 'finished'
  const [gameState, setGameState] = useState('idle');
  const [file, setFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Gameplay Data
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  // --- Actions ---

  const handleStartGame = async () => {
    try {
      setGameState('loading');
      setErrorMsg("");

      if (!file) {
        setErrorMsg("Please upload a PDF to generate the quiz!");
        setGameState('idle');
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://127.0.0.1:5000/quiz_from_pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to fetch quiz");

      const data = await response.json();
      
      // Debugging: View this in your browser console (F12)
      console.log("Raw API Response:", data.quiz);
      
      const parsed = parseQuizText(data.quiz);
      console.log("Parsed Questions:", parsed);
      
      if (parsed.length > 0) {
        setQuestions(parsed);
        setCurrentQIndex(0);
        setScore(0);
        setSelectedOption(null);
        setIsCorrect(null);
        setGameState('playing');
      } else {
        throw new Error("Could not parse valid questions from the AI response.");
      }

    } catch (error) {
      console.error("Error starting game:", error);
      setErrorMsg("Failed to generate quiz. Please try a different PDF.");
      setGameState('idle');
    }
  };

  const handleOptionSelect = (option) => {
    if (selectedOption) return; // Lock choice

    setSelectedOption(option);
    
    const currentQ = questions[currentQIndex];
    // Clean up option to get just the letter (e.g., "A")
    const optionLetter = option.match(/^[\(\[]?([a-dA-D])[amino\)\]\.]/)?.[1]?.toLowerCase() || "";
    const answerLower = currentQ.correctAnswer.toLowerCase();
    
    // Check match: logic improved to check if answer contains "a)", "a.", etc.
    const correct = answerLower.includes(optionLetter + ')') || 
                    answerLower.includes(optionLetter + '.') ||
                    answerLower.startsWith(optionLetter);
    
    setIsCorrect(correct);
    if (correct) setScore(s => s + 10); // 10 points per correct answer
  };

  const handleNextQuestion = () => {
    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      setGameState('finished');
    }
  };

  const handleRestart = () => {
    setFile(null);
    setGameState('idle');
    setQuestions([]);
    setScore(0);
  };

  // --- Render Helpers ---

  // 1. Upload Screen
  const renderIdle = () => (
    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto p-8 animate-in fade-in zoom-in duration-500">
      <div className="bg-white p-10 rounded-3xl shadow-2xl text-center w-full border-4 border-[#1b5cb8]/10">
        <div className="bg-blue-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <BookOpen size={48} className="text-[#1b5cb8]" />
        </div>
        <h1 className="text-4xl font-extrabold text-[#0B2C59] mb-4">Quiz Generator</h1>
        <p className="text-gray-500 mb-8 text-lg">Upload your study material (PDF) and we'll turn it into a gamified quiz instantly.</p>
        
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-3 file:px-6
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-[#1b5cb8] file:text-white
            hover:file:bg-[#154a96]
            border-2 border-dashed border-gray-300 rounded-xl p-4 bg-gray-50 cursor-pointer mb-6"
        />

        {errorMsg && <p className="text-red-500 font-bold mb-4 bg-red-50 p-3 rounded-lg">{errorMsg}</p>}

        <button
          onClick={handleStartGame}
          disabled={!file}
          className={`w-full py-4 rounded-xl text-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-1
            ${file ? 'bg-gradient-to-r from-[#207dff] to-[#0fc6b4] hover:shadow-xl' : 'bg-gray-300 cursor-not-allowed'}`}
        >
          Start Game
        </button>
      </div>
    </div>
  );

  // 2. Loading Screen
  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative w-32 h-32 mb-8">
        <div className="absolute top-0 left-0 w-full h-full border-8 border-gray-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-8 border-[#207dff] border-t-transparent rounded-full animate-spin"></div>
      </div>
      <h2 className="text-2xl font-bold text-[#0B2C59] animate-pulse">Generating Challenge...</h2>
      <p className="text-gray-500 mt-2">Reading your PDF and crafting questions.</p>
    </div>
  );

  // 3. Gameplay Screen
  const renderPlaying = () => {
    const currentQ = questions[currentQIndex];
    const progress = ((currentQIndex) / questions.length) * 100;

    return (
      <div className="max-w-3xl mx-auto w-full py-8 px-4 h-full flex flex-col">
        {/* Header Stats */}
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2">
            <div className="bg-purple-100 p-2 rounded-lg text-[#0fc6b4]">
              <span className="font-bold text-sm">Question</span>
              <div className="text-xl font-black leading-none">{currentQIndex + 1}<span className="text-gray-400 text-sm">/{questions.length}</span></div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="text-yellow-500 fill-yellow-500" />
            <span className="text-2xl font-black text-[#0B2C59]">{score}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-3 rounded-full mb-8 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-[#1b5cb8] to-[#0fc6b4] h-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6 border-b-8 border-[#1b5cb8]/10 flex-1 flex flex-col justify-center animate-in slide-in-from-right-10 duration-300 key={currentQIndex}">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0B2C59] mb-8 leading-tight">
            {currentQ.question}
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {currentQ.options.map((option, idx) => {
              // Styling Logic
              let baseStyle = "p-5 rounded-xl border-2 text-left text-lg font-medium transition-all duration-200 flex justify-between items-center transform hover:scale-[1.01] active:scale-[0.99] ";
              
              if (selectedOption === option) {
                if (isCorrect) baseStyle += "bg-green-100 border-green-500 text-green-800 shadow-md";
                else baseStyle += "bg-red-100 border-red-500 text-red-800 shadow-md";
              } else if (selectedOption && !isCorrect && currentQ.correctAnswer.toLowerCase().includes(option.split(')')[0].toLowerCase())) {
                baseStyle += "bg-green-50 border-green-300 text-green-700 opacity-70";
              } else if (selectedOption) {
                baseStyle += "bg-gray-50 border-gray-100 text-gray-400 opacity-50 cursor-not-allowed";
              } else {
                baseStyle += "bg-white border-gray-200 text-gray-700 hover:border-[#1b5cb8] hover:bg-blue-50 hover:shadow-md cursor-pointer";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(option)}
                  disabled={!!selectedOption}
                  className={baseStyle}
                >
                  <span>{option}</span>
                  {selectedOption === option && (
                    isCorrect ? <CheckCircle className="text-green-600" /> : <XCircle className="text-red-500" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Next Button / Feedback */}
        <div className="h-20 flex items-center justify-center">
          {selectedOption ? (
             <button 
               onClick={handleNextQuestion}
               className="flex items-center gap-3 bg-[#0B2C59] text-white px-10 py-4 rounded-full text-xl font-bold shadow-xl hover:bg-[#1b5cb8] transition-all transform hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4"
             >
               {currentQIndex + 1 === questions.length ? "Finish Game" : "Next Question"} <ArrowRight />
             </button>
          ) : (
             <p className="text-gray-400 text-sm animate-pulse">Select an answer to continue</p>
          )}
        </div>
      </div>
    );
  };

  // 4. Results Screen
  const renderFinished = () => {
    const maxScore = questions.length * 10;
    const percentage = Math.round((score / maxScore) * 100);
    
    let message = "Good Effort!";
    if (percentage === 100) message = "Perfect Score! 🌟";
    else if (percentage >= 80) message = "Excellent Work! 🏆";
    else if (percentage >= 50) message = "Keep Practicing! 📚";

    return (
      <div className="flex flex-col items-center justify-center h-full animate-in zoom-in duration-500">
        <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-lg w-full border-t-8 border-[#ad31af]">
          <Trophy size={80} className="text-yellow-500 mx-auto mb-6 drop-shadow-lg" />
          
          <h2 className="text-4xl font-extrabold text-[#0B2C59] mb-2">{message}</h2>
          <p className="text-gray-500 mb-8">Quiz Completed</p>

          <div className="flex justify-center items-center gap-8 mb-10">
            <div className="text-center">
              <div className="text-sm text-gray-400 uppercase font-bold tracking-wider">Score</div>
              <div className="text-5xl font-black text-[#1b5cb8]">{score}</div>
            </div>
            <div className="w-px h-16 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-sm text-gray-400 uppercase font-bold tracking-wider">Total</div>
              <div className="text-5xl font-black text-gray-300">{maxScore}</div>
            </div>
          </div>

          <button
            onClick={handleRestart}
            className="flex items-center justify-center gap-3 w-full py-4 rounded-xl text-lg font-bold bg-gray-900 text-white hover:bg-black transition-all shadow-lg"
          >
            <RefreshCw size={20} /> Play Again
          </button>
        </div>
      </div>
    );
  };


  return (
    <div className="flex bg-gray-100 min-h-screen font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 relative">
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none overflow-hidden">
           <div className="absolute top-10 right-10 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
           <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        </div>

        {/* Content Switcher */}
        <div className="h-screen overflow-y-auto">
          {gameState === 'idle' && renderIdle()}
          {gameState === 'loading' && renderLoading()}
          {gameState === 'playing' && renderPlaying()}
          {gameState === 'finished' && renderFinished()}
        </div>
      </div>
    </div>
  );
};

export default Quiz;