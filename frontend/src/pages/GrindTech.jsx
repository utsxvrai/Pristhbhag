import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import LevelCard from '../components/LevelCard';

export default function GrindTech() {
  const [progress, setProgress] = useState({ completed: 0, total: 36 });
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [modalStep, setModalStep] = useState(0); // 0 = resources, 1+ = questions
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [validationResults, setValidationResults] = useState({});
  const [showValidation, setShowValidation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Sample level data with resources, questions, and expected answers
  const getLevelData = (levelId) => {
    const levelDataMap = {
      1: {
        resources: [
          { type: 'article', title: 'MDN: Promise Combinators', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise' },
          { type: 'video', title: 'Async JavaScript Deep Dive', url: 'https://youtube.com' },
          { type: 'article', title: 'Promise.all() vs Promise.allSettled()', url: 'https://javascript.info/promise-api' },
          { type: 'docs', title: 'Node.js Promises Guide', url: 'https://nodejs.org' }
        ],
        questions: [
          {
            id: 1,
            question: 'What is the main difference between Promise.all() and Promise.allSettled()?',
            placeholder: 'Explain the key differences...',
            keywords: ['reject', 'fail', 'settled', 'all', 'wait', 'complete'],
            expectedAnswer: 'Promise.all() fails fast and rejects if any promise rejects, while Promise.allSettled() waits for all promises to complete (either resolve or reject) and returns their results.',
            hints: 'Think about what happens when one promise fails in each method.'
          },
          {
            id: 2,
            question: 'Write a code snippet that demonstrates how Promise.race() works with at least 3 promises.',
            placeholder: 'Paste your code here...',
            keywords: ['Promise.race', 'resolve', 'reject', 'first', 'fastest'],
            expectedAnswer: 'Promise.race() returns the result of the first promise that settles (either resolves or rejects), ignoring the others.',
            hints: 'Promise.race should have multiple promises as arguments.'
          },
          {
            id: 3,
            question: 'In what scenarios would you use Promise.any() instead of Promise.race()?',
            placeholder: 'Describe the use cases...',
            keywords: ['first', 'successful', 'resolve', 'fulfill', 'ignore', 'reject'],
            expectedAnswer: 'Use Promise.any() when you want the first successful result and want to ignore rejections, unlike Promise.race() which returns the first settled promise regardless of success or failure.',
            hints: 'Promise.any focuses on successful resolutions only.'
          },
          {
            id: 4,
            question: 'Implement a custom promise combinator function called promiseMap() that takes an array and a mapper function.',
            placeholder: 'Write your implementation...',
            keywords: ['map', 'Promise.all', 'async', 'await', 'array'],
            expectedAnswer: 'A promiseMap function should map each item through the mapper function and use Promise.all() to wait for all promises to resolve.',
            hints: 'Use array.map() combined with Promise.all().'
          },
          {
            id: 5,
            question: 'Explain how you would handle errors when using Promise.all() with multiple API calls.',
            placeholder: 'Describe your error handling strategy...',
            keywords: ['try', 'catch', 'reject', 'error', 'handle', 'allSettled'],
            expectedAnswer: 'Wrap Promise.all() in try-catch, or use Promise.allSettled() to handle individual failures, or attach .catch() to each promise before passing to Promise.all().',
            hints: 'Consider using try-catch blocks or Promise.allSettled().'
          },
          {
            id: 6,
            question: 'What happens when you pass an empty array to Promise.all()? Write your answer and test it.',
            placeholder: 'Your answer and test results...',
            keywords: ['empty', 'resolves', 'immediately', 'array', 'fulfilled'],
            expectedAnswer: 'Promise.all([]) resolves immediately with an empty array as the result.',
            hints: 'Test it! Promise.all([]) behavior is synchronous.'
          }
        ]
      }
    };
    return levelDataMap[levelId] || { resources: [], questions: [] };
  };

  const levels = [
    {
      id: 1,
      number: 'LVL 1',
      title: 'PROMISE COMBINATORS',
      description: 'Advanced Async',
      status: 'unlocked',
      color: 'purple',
      challenges: [
        'Promise.all() implementation',
        'Promise.race() deep dive',
        'Promise.allSettled() patterns',
        'Custom combinator functions'
      ]
    },
    {
      id: 2,
      number: 'LVL 2',
      title: 'GENERATORS & ASYNC ITERATORS',
      description: '',
      status: 'locked',
      color: 'purple',
      challenges: [
        'Generator functions basics',
        'Async generators',
        'Iterator protocol',
        'Custom iterables'
      ]
    },
    {
      id: 3,
      number: 'LVL 3',
      title: 'CANCELLATION & ABORT/CONTROLLER',
      description: '',
      status: 'locked',
      color: 'blue',
      challenges: [
        'AbortController API',
        'Request cancellation',
        'Timeout patterns',
        'Cleanup strategies'
      ]
    },
    {
      id: 4,
      number: 'LVL 4',
      title: 'WEAKMAP & WEAKSET',
      description: '',
      status: 'locked',
      color: 'blue',
      challenges: [
        'Memory management',
        'Weak references',
        'Cache implementation',
        'Private data patterns'
      ]
    },
    {
      id: 5,
      number: 'LVL 5',
      title: 'PROXY & REFLECT',
      description: '',
      status: 'locked',
      color: 'purple',
      challenges: [
        'Proxy traps',
        'Reflect API',
        'Validation patterns',
        'Observable objects'
      ]
    },
    {
      id: 6,
      number: 'LVL 6',
      title: 'CURRYING & PARTIAL APPLICATION',
      description: '',
      status: 'locked',
      color: 'gray',
      challenges: [
        'Currying implementation',
        'Partial application',
        'Function composition',
        'Practical use cases'
      ]
    },
    {
      id: 7,
      number: 'LVL 7',
      title: 'FUNCTION COMPOSITION & PIPELINES',
      description: '',
      status: 'locked',
      color: 'gray',
      challenges: [
        'Compose function',
        'Pipe operator',
        'Data transformation',
        'Point-free style'
      ]
    },
    {
      id: 8,
      number: 'LVL 8',
      title: 'MEMOIZATION',
      description: '',
      status: 'locked',
      color: 'blue',
      challenges: [
        'Simple memoization',
        'LRU cache',
        'Recursive memoization',
        'Performance optimization'
      ]
    },
    {
      id: 9,
      number: 'LVL 9',
      title: 'TRANSDUCERS & HIGH-PERF PIPELINES',
      description: '',
      status: 'locked',
      color: 'blue',
      challenges: [
        'Transducer basics',
        'Composable transformations',
        'High-performance patterns',
        'Real-world applications'
      ]
    },
    {
      id: 10,
      number: 'LVL 10',
      title: 'STREAMS API & BACKPRESSURE',
      description: '',
      status: 'locked',
      color: 'purple',
      challenges: [
        'ReadableStream API',
        'WritableStream API',
        'Transform streams',
        'Backpressure handling'
      ]
    },
    {
      id: 11,
      number: 'BOSS 1',
      title: 'BOSS 1: API REQUEST MANAGER',
      description: '',
      status: 'locked',
      color: 'orange',
      challenges: [
        'Build a complete request manager',
        'Implement retry logic',
        'Add caching layer',
        'Handle concurrent requests'
      ]
    },
    {
      id: 12,
      number: 'BOSS 2',
      title: 'BOSS II: DATA PIPELINE BUILDER',
      description: '',
      status: 'locked',
      color: 'orange',
      challenges: [
        'Design pipeline architecture',
        'Implement transformers',
        'Add error handling',
        'Optimize performance'
      ]
    }
  ];

  const handleLevelClick = (level) => {
    if (level.status === 'locked') {
      alert('🔒 This level is locked. Complete previous levels to unlock!');
    } else {
      setSelectedLevel(level);
      setModalStep(0);
      setAnswers({});
      setCurrentAnswer('');
      setValidationResults({});
      setShowValidation(false);
    }
  };

  const closeModal = () => {
    setSelectedLevel(null);
    setModalStep(0);
    setAnswers({});
    setCurrentAnswer('');
    setValidationResults({});
    setShowValidation(false);
    setIsProcessing(false);
    
    // Clean up media recorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (isListening) {
      setIsListening(false);
    }
  };

  const startQuestions = () => {
    setModalStep(1);
    setShowValidation(false);
  };

  const toggleSpeechRecognition = async () => {
    if (isListening) {
      // Stop recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      setIsListening(false);
    } else {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          setIsProcessing(true);
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          
          // Send audio to backend
          try {
            const formData = new FormData();
            formData.append('file', audioBlob, 'recording.webm');

            const response = await fetch('http://localhost/api/v1/stt/speech-to-text', {
              method: 'POST',
              body: formData,
            });

            const data = await response.json();
            
            if (data.text) {
              setCurrentAnswer(prev => prev + data.text + ' ');
            } else {
              console.error('No text in response:', data);
              alert('Failed to transcribe audio. Please try again.');
            }
          } catch (error) {
            console.error('Error sending audio to backend:', error);
            alert('Error transcribing audio. Please check your connection.');
          } finally {
            setIsProcessing(false);
            // Stop all tracks to release microphone
            stream.getTracks().forEach(track => track.stop());
          }
        };

        mediaRecorder.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error accessing microphone:', error);
        alert('Unable to access microphone. Please grant permission and try again.');
      }
    }
  };

  const validateAnswer = async () => {
    if (!selectedLevel) return;
    
    const levelData = getLevelData(selectedLevel.id);
    const questionIndex = modalStep - 1;
    const currentQuestion = levelData.questions[questionIndex];
    
    if (!currentQuestion) return;

    setIsProcessing(true);
    setValidationResults(prev => ({ ...prev, [questionIndex]: null })); // Clear previous result

    try {
      const response = await fetch('http://localhost/api/v1/evaluation/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQuestion.question,
          answer: currentAnswer
        })
      });

      if (!response.ok) {
        throw new Error('Evaluation failed');
      }

      const result = await response.json();

      setValidationResults(prev => ({
        ...prev,
        [questionIndex]: result
      }));
      
      setShowValidation(true);

    } catch (error) {
      console.error("Evaluation error:", error);
      alert("Failed to evaluate answer. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNextQuestion = () => {
    if (!selectedLevel) return;
    
    const levelData = getLevelData(selectedLevel.id);
    const currentQuestionIndex = modalStep - 1;
    
    // Save current answer
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: currentAnswer
    }));
    
    if (modalStep < levelData.questions.length) {
      setModalStep(modalStep + 1);
      setCurrentAnswer(answers[modalStep] || '');
      setShowValidation(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (modalStep > 1) {
      // Save current answer
      const currentQuestionIndex = modalStep - 1;
      setAnswers(prev => ({
        ...prev,
        [currentQuestionIndex]: currentAnswer
      }));
      
      setModalStep(modalStep - 1);
      setCurrentAnswer(answers[modalStep - 2] || '');
      setShowValidation(false);
    }
  };

  const handleSubmitAnswers = () => {
    // Save final answer
    const currentQuestionIndex = modalStep - 1;
    const finalAnswers = {
      ...answers,
      [currentQuestionIndex]: currentAnswer
    };
    
    console.log('Submitted answers:', finalAnswers);
    console.log('Validation results:', validationResults);
    
    const correctCount = Object.values(validationResults).filter(r => r.isCorrect).length;
    const totalQuestions = getLevelData(selectedLevel.id).questions.length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    
    alert(`🎉 Submitted! You got ${correctCount}/${totalQuestions} questions correct (${percentage}%)`);
    closeModal();
  };

  const getResourceIcon = (type) => {
    switch(type) {
      case 'video':
        return '🎥';
      case 'article':
        return '📄';
      case 'docs':
        return '📚';
      default:
        return '🔗';
    }
  };

  const renderModalContent = () => {
    if (!selectedLevel) return null;
    
    const levelData = getLevelData(selectedLevel.id);
    
    // Step 0: Resources
    if (modalStep === 0) {
      return (
        <>
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className={`text-xs font-bold px-2 py-1 rounded ${
                selectedLevel.color === 'purple' ? 'bg-purple-500/20 text-purple-300' :
                selectedLevel.color === 'blue' ? 'bg-blue-500/20 text-blue-300' :
                selectedLevel.color === 'orange' ? 'bg-orange-500/20 text-orange-300' :
                'bg-gray-500/20 text-gray-300'
              }`}>
                {selectedLevel.number}
              </span>
              <h2 className="text-3xl font-black mt-3 text-white">{selectedLevel.title}</h2>
              {selectedLevel.description && (
                <p className="text-gray-400 mt-2">{selectedLevel.description}</p>
              )}
            </div>
            <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4 text-purple-300 flex items-center">
              📚 Learning Resources
            </h3>
            <p className="text-gray-400 mb-6">Review these resources before starting the challenges:</p>
            
            <div className="space-y-3 mb-6">
              {levelData.resources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 bg-white/5 p-4 rounded-lg border border-white/10 hover:border-purple-500/50 hover:bg-white/10 transition-all group"
                >
                  <span className="text-2xl">{getResourceIcon(resource.type)}</span>
                  <div className="flex-1">
                    <p className="text-white font-semibold group-hover:text-purple-300 transition-colors">{resource.title}</p>
                    <p className="text-xs text-gray-500">{resource.type.toUpperCase()}</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-500 group-hover:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ))}
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">💡</span>
                <div>
                  <p className="text-blue-200 font-semibold mb-1">Pro Tip</p>
                  <p className="text-blue-300/80 text-sm">Take your time to understand the concepts. You'll face {levelData.questions.length} questions that test your knowledge.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button 
              onClick={startQuestions}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 rounded-lg font-bold hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Start Questions ({levelData.questions.length} total)
            </button>
            <button 
              onClick={closeModal} 
              className="px-6 py-3 rounded-lg font-bold border-2 border-gray-700 hover:border-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </>
      );
    }

    // Step 1+: Questions
    const questionIndex = modalStep - 1;
    const currentQuestion = levelData.questions[questionIndex];
    const currentValidation = validationResults[questionIndex];
    
    if (!currentQuestion) return null;

    return (
      <>
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <span className={`text-xs font-bold px-2 py-1 rounded ${
                selectedLevel.color === 'purple' ? 'bg-purple-500/20 text-purple-300' :
                selectedLevel.color === 'blue' ? 'bg-blue-500/20 text-blue-300' :
                selectedLevel.color === 'orange' ? 'bg-orange-500/20 text-orange-300' :
                'bg-gray-500/20 text-gray-300'
              }`}>
                Question {modalStep} / {levelData.questions.length}
              </span>
              <div className="flex-1 bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(modalStep / levelData.questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
            <h2 className="text-2xl font-black text-white">{selectedLevel.title}</h2>
          </div>
          <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors ml-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 text-white">{currentQuestion.question}</h3>
          
          <div className="relative">
            <textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder={currentQuestion.placeholder}
              className="w-full bg-gray-800/50 border-2 border-gray-700 rounded-lg p-4 pr-14 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none min-h-[200px] resize-y"
              autoFocus
            />
            
            {/* Microphone Button */}
            <button
              onClick={toggleSpeechRecognition}
              disabled={isProcessing}
              className={`absolute right-4 top-4 p-3 rounded-full transition-all ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : isProcessing
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
              title={isListening ? 'Stop recording' : isProcessing ? 'Processing...' : 'Start speech-to-text'}
            >
              {isListening ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <rect x="6" y="6" width="8" height="8" rx="1" />
                </svg>
              ) : isProcessing ? (
                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" />
                </svg>
              )}
            </button>
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-gray-500">
              {currentAnswer.length} characters 
              {isListening && ' • 🎤 Recording...'}
              {isProcessing && ' • ⏳ Transcribing...'}
            </p>
            <button
              onClick={validateAnswer}
              disabled={!currentAnswer.trim()}
              className="text-sm px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
            >
              Check Answer
            </button>
          </div>

          {/* Validation Feedback */}
          {showValidation && currentValidation && (
            <div className={`mt-4 p-4 rounded-lg border-2 ${
              currentValidation.isCorrect 
                ? 'bg-green-500/10 border-green-500/30' 
                : 'bg-red-500/10 border-red-500/30'
            }`}>
              <div className="flex items-start space-x-3 mb-3">
                <span className="text-2xl">{currentValidation.isCorrect ? '✅' : '❌'}</span>
                <div className="flex-1">
                  <p className={`font-bold mb-1 ${currentValidation.isCorrect ? 'text-green-300' : 'text-red-300'}`}>
                    Score: {currentValidation.score}/10
                  </p>
                  <p className="text-sm text-white/90 mb-2">
                    {currentValidation.feedback}
                  </p>
                </div>
              </div>

               {/* Missing Concepts */}
               {currentValidation.missingConcepts && currentValidation.missingConcepts.length > 0 && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-3">
                  <p className="text-yellow-200 font-semibold text-sm mb-1">⚠️ Missing Concepts:</p>
                  <ul className="list-disc list-inside text-yellow-300/80 text-sm">
                    {currentValidation.missingConcepts.map((concept, idx) => (
                      <li key={idx}>{concept}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Incorrect Statements */}
              {currentValidation.incorrectStatements && currentValidation.incorrectStatements.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-3">
                  <p className="text-red-200 font-semibold text-sm mb-1">❌ Corrections:</p>
                   <ul className="list-disc list-inside text-red-300/80 text-sm">
                    {currentValidation.incorrectStatements.map((stmt, idx) => (
                      <li key={idx}>{stmt}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Ideal Answer */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                <p className="text-blue-200 font-semibold text-sm mb-1">📖 Ideal Answer:</p>
                <p className="text-blue-300/80 text-sm">{currentValidation.idealShortAnswer}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex space-x-4">
          {modalStep > 1 && (
            <button 
              onClick={handlePreviousQuestion}
              className="px-6 py-3 rounded-lg font-bold border-2 border-gray-700 hover:border-gray-600 transition-colors"
            >
              ← Previous
            </button>
          )}
          
          {modalStep < levelData.questions.length ? (
            <button 
              onClick={handleNextQuestion}
              disabled={!currentAnswer.trim()}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 rounded-lg font-bold hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Question →
            </button>
          ) : (
            <button 
              onClick={handleSubmitAnswers}
              disabled={!currentAnswer.trim()}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 rounded-lg font-bold hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit All Answers ✓
            </button>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-slate-900 to-black text-white">
      {/* Header Section */}
      <div className="container mx-auto px-6 py-16">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-16">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-3 rounded-lg">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold">
              Grind<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Node</span>
            </h1>
            <div className="flex items-center space-x-2 bg-orange-500/20 px-3 py-1 rounded-full border border-orange-500/30">
              <span className="text-orange-400">🔥</span>
              <span className="text-sm font-semibold">1</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <span className="text-pink-500 font-bold">{progress.completed}</span>
              <span className="text-gray-500"> / </span>
              <span className="text-gray-400">{progress.total}</span>
              <span className="text-gray-500 ml-2">CHALLENGES CRUSHED</span>
            </div>
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:from-purple-700 hover:to-blue-700">
              Theme Toggle
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="font-bold">UR</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-7xl font-black mb-6">
            MASTER <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">NODE.JS</span>
          </h1>
          <p className="text-xl text-gray-400 font-light">
            30 LEVELS. 6 BOSS PROJECTS.
          </p>
          <p className="text-lg text-purple-300 mt-2">
            Master advanced concepts: Express patterns, middleware design, performance optimization.
          </p>
        </div>

        {/* Levels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
          {levels.map((level) => (
            <LevelCard 
              key={level.id} 
              level={level} 
              onClick={handleLevelClick}
            />
          ))}
        </div>

        {/* Coming Soon Section */}
        <div className="text-center mt-20 py-12 border-t border-gray-800">
          <p className="text-gray-500 text-sm">More Grind series coming soon...</p>
          <div className="flex justify-center space-x-4 mt-4">
            <span className="text-gray-600">GrindReact</span>
            <span className="text-gray-700">•</span>
            <span className="text-gray-600">GrindPython</span>
            <span className="text-gray-700">•</span>
            <span className="text-gray-600">GrindGo</span>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedLevel && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-gradient-to-br from-gray-900 to-slate-900 border-2 border-purple-500/30 rounded-2xl max-w-3xl w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {renderModalContent()}
          </div>
        </div>
      )}
    </div>
  );
}

