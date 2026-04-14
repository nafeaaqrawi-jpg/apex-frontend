import { useEffect, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Send, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import { rizzAssistApi, type RizzChatMessage } from '../../api/rizzassist'

interface ChatBubble {
  role: 'user' | 'assistant'
  content: string
  openers?: string[]
}

const EMPTY_STATE_MESSAGE = 'Your Apex AI is ready. Describe your situation and I\'ll help craft the perfect message.'

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      {([0, 0.18, 0.36] as const).map((delay, index) => (
        <motion.span
          key={index}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.7, repeat: Infinity, delay, ease: 'easeInOut' }}
          className="block h-2 w-2 rounded-full bg-purple-400"
        />
      ))}
    </div>
  )
}

export default function RizzAssistPage() {
  const navigate = useNavigate()
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<RizzChatMessage[]>([])
  const [bubbles, setBubbles] = useState<ChatBubble[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const { mutate, isPending } = useMutation({
    mutationFn: rizzAssistApi.chat,
    onSuccess: (result) => {
      const coachText = result.coach
      const openers = result.openers?.length ? result.openers : undefined
      setBubbles((prev) => [
        ...prev,
        { role: 'assistant', content: coachText, openers },
      ])
      setHistory((prev) => [...prev, { role: 'assistant', content: coachText }])
    },
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [bubbles, isPending])

  const handleSend = () => {
    const text = input.trim()
    if (!text || isPending) return

    const userBubble: ChatBubble = { role: 'user', content: text }
    const nextHistory: RizzChatMessage[] = [...history, { role: 'user', content: text }]

    setBubbles((prev) => [...prev, userBubble])
    setHistory(nextHistory)
    setInput('')

    mutate({
      message: text,
      history: nextHistory,
      intent: 'reply',
      tone: 'confident',
      audience: 'any',
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleOpenerTap = (opener: string) => {
    setInput(opener)
    inputRef.current?.focus()
  }

  return (
    <AppLayout>
      <div className="mx-auto flex h-screen max-h-screen max-w-md flex-col bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#0f0a1e] via-[#1a0a3e] to-[#0d0620] px-4 pb-5 pt-4 text-white shadow-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 transition-colors hover:bg-white/25"
              aria-label="Go back"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white">Apex AI</h1>
              <p className="text-sm text-purple-200/80 italic">Your personal dating strategist</p>
              <span className="inline-flex items-center gap-1 mt-1 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-white/60">✦ Powered by AI</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-hide">
          {bubbles.length === 0 && !isPending ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="flex h-full flex-col items-center justify-center gap-4 text-center"
            >
              <motion.div
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles size={28} className="text-purple-600" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="flex flex-col items-center gap-1"
              >
                <p className="text-sm font-semibold text-gray-800">Your Apex AI is ready.</p>
                <p className="max-w-[220px] text-sm leading-relaxed text-gray-400">Describe your situation and I'll craft the perfect message.</p>
              </motion.div>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-3">
              <AnimatePresence initial={false}>
                {bubbles.map((bubble, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22 }}
                    className={`flex flex-col ${bubble.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    {/* Bubble */}
                    <div
                      className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        bubble.role === 'user'
                          ? 'bg-gradient-to-br from-purple-600 to-violet-600 text-white shadow-sm'
                          : 'border border-gray-200 bg-white text-gray-800 shadow-sm'
                      }`}
                    >
                      {bubble.content}
                    </div>

                    {/* Opener chips for AI messages */}
                    {bubble.role === 'assistant' && bubble.openers && bubble.openers.length > 0 && (
                      <div className="mt-2 flex max-w-[82%] flex-wrap gap-2">
                        {bubble.openers.map((opener) => (
                          <button
                            key={opener}
                            onClick={() => handleOpenerTap(opener)}
                            className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-700 transition-colors hover:bg-purple-100 active:scale-95"
                          >
                            {opener}
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              <AnimatePresence>
                {isPending && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.18 }}
                    className="flex items-start"
                  >
                    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                      <TypingDots />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input bar */}
        <div className="safe-bottom border-t border-gray-100 bg-white px-4 pb-6 pt-3">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your situation or paste their message..."
              className="flex-1 resize-none rounded-2xl bg-gray-100 px-4 py-3 text-sm leading-relaxed transition-all placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
              style={{ maxHeight: '120px', overflowY: 'auto' }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isPending}
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-violet-600 shadow-sm transition-all hover:from-purple-700 hover:to-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send size={17} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
