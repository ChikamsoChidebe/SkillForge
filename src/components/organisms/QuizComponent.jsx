import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle, 
  XCircle, 
  Trophy, 
  RotateCcw, 
  ArrowRight,
  Clock,
  Target,
  Award
} from 'lucide-react'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import { courseService } from '@/api/courseService'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'

const QuizComponent = ({ courseId, moduleId, lesson, onQuizComplete, onClose }) => {
  const { user } = useAuth()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [timeTaken, setTimeTaken] = useState(null)
  const [quizStarted, setQuizStarted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  let timerRef = null;
  const handleStartQuiz = () => {
    setQuizStarted(true)
    timerRef = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef)
          handleSubmitQuiz()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestion < lesson.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const handleSubmitQuiz = async () => {
    setSubmitting(true)
    if (timerRef) clearInterval(timerRef);
    setTimeTaken(300 - timeLeft);
    try {
      let correct = 0
      lesson.questions.forEach((question, index) => {
        if (answers[index] === question.correct) {
          correct++
        }
      })

      const finalScore = Math.round((correct / lesson.questions.length) * 100)
      setScore(finalScore)
      setCorrectAnswers(correct)
      setShowResults(true)

      // Submit to backend
      await courseService.submitQuiz(user.id, courseId, moduleId, lesson.id, answers, finalScore)

      if (finalScore >= 70) {
        toast.success(`Quiz passed with ${finalScore}%!`)
        setTimeout(() => {
          if (onQuizComplete) {
            onQuizComplete(moduleId, lesson.id, true)
          }
        }, 3000)
      } else {
        toast.error(`Quiz failed with ${finalScore}%. You need 70% to pass.`)
      }
    } catch (error) {
      toast.error('Failed to submit quiz')
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleRetakeQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
    setScore(0)
    setCorrectAnswers(0)
    setTimeLeft(300)
    setQuizStarted(false)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-blue-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreIcon = (score) => {
    if (score >= 90) return <Trophy className="w-12 h-12 text-yellow-500" />
    if (score >= 70) return <CheckCircle className="w-12 h-12 text-green-500" />
    return <XCircle className="w-12 h-12 text-red-500" />
  }

  if (!quizStarted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full p-8"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
              <Target className="w-10 h-10 text-white" />
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {lesson.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Test your knowledge with this interactive quiz
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="font-semibold text-gray-900 dark:text-gray-100">Questions</div>
                <div className="text-2xl font-bold text-blue-600">{lesson.questions.length}</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="font-semibold text-gray-900 dark:text-gray-100">Time Limit</div>
                <div className="text-2xl font-bold text-green-600">5 min</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="font-semibold text-gray-900 dark:text-gray-100">Passing Score</div>
                <div className="text-2xl font-bold text-purple-600">70%</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="font-semibold text-gray-900 dark:text-gray-100">Attempts</div>
                <div className="text-2xl font-bold text-orange-600">Unlimited</div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Quiz Instructions</h3>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 text-left">
                <li>• Read each question carefully before selecting your answer</li>
                <li>• You can navigate between questions using the navigation buttons</li>
                <li>• You need 70% or higher to pass and proceed to the next lesson</li>
                <li>• You can retake the quiz if you don't pass</li>
              </ul>
            </div>

            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleStartQuiz}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                Start Quiz
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  if (showResults) {
    const passed = score >= 70
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full p-8"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex justify-center"
            >
              {getScoreIcon(score)}
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className={`text-4xl font-bold mb-2 ${getScoreColor(score)}`}>
                {score}%
              </h2>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {passed ? 'Congratulations!' : 'Keep Learning!'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {passed 
                  ? 'You passed the quiz and can proceed to the next lesson'
                  : 'You need 70% to pass. Review the material and try again'
                }
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Correct Answers</div>
                <div className="text-2xl font-bold text-green-600">
                  {correctAnswers}/{lesson.questions.length}
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Time Taken</div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatTime(timeTaken !== null ? timeTaken : 300 - timeLeft)}
                </div>
              </div>
            </motion.div>

            {passed && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800"
              >
                <div className="flex items-center justify-center space-x-2 text-green-700 dark:text-green-300">
                  <Award className="w-5 h-5" />
                  <span className="font-semibold">Lesson Completed!</span>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex space-x-4"
            >
              {!passed && (
                <Button
                  onClick={handleRetakeQuiz}
                  variant="outline"
                  className="flex-1 flex items-center justify-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Quiz</span>
                </Button>
              )}
              <Button
                onClick={onClose}
                className={`${passed ? 'flex-1' : 'flex-1'} flex items-center justify-center space-x-2`}
              >
                <span>{passed ? 'Continue' : 'Close'}</span>
                {passed && <ArrowRight className="w-4 h-4" />}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  const question = lesson.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / lesson.questions.length) * 100

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {lesson.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Question {currentQuestion + 1} of {lesson.questions.length}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span className={timeLeft < 60 ? 'text-red-500 font-bold' : ''}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
                {question.question}
              </h3>

              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <motion.label
                    key={index}
                    className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      answers[currentQuestion] === index
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion}`}
                      value={index}
                      checked={answers[currentQuestion] === index}
                      onChange={() => handleAnswerSelect(currentQuestion, index)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                      answers[currentQuestion] === index
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {answers[currentQuestion] === index && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 bg-white rounded-full"
                        />
                      )}
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 flex-1">
                      {option}
                    </span>
                  </motion.label>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevQuestion}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>

            <div className="flex space-x-2">
              {lesson.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                    index === currentQuestion
                      ? 'bg-blue-500 text-white'
                      : answers[index] !== undefined
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {currentQuestion === lesson.questions.length - 1 ? (
              <Button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(answers).length < lesson.questions.length || submitting}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                disabled={answers[currentQuestion] === undefined}
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default QuizComponent