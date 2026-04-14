import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageSquare, X } from 'lucide-react'
import Button from '../ui/Button'

interface ConnectionNoteModalProps {
  isOpen: boolean
  isLoading?: boolean
  profileName: string
  initialMessage?: string
  onClose: () => void
  onSend: (message?: string) => void | Promise<void>
}

const MAX_NOTE_LENGTH = 280

export default function ConnectionNoteModal({
  isOpen,
  isLoading = false,
  profileName,
  initialMessage = '',
  onClose,
  onSend,
}: ConnectionNoteModalProps) {
  const [message, setMessage] = useState(initialMessage)

  useEffect(() => {
    if (isOpen) {
      setMessage(initialMessage)
    }
  }, [initialMessage, isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/45"
            onClick={isLoading ? undefined : onClose}
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 360, damping: 34 }}
            className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-md rounded-t-[28px] bg-white px-5 pb-8 pt-5 shadow-2xl"
          >
            <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-gray-200" />

            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-purple-500">
                  Connection Note
                </p>
                <h3 className="mt-2 text-xl font-bold text-gray-900">
                  Introduce yourself to {profileName}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-500">
                  LinkedIn-style notes work best when they feel personal, specific, and easy to answer.
                </p>
              </div>
              <button
                type="button"
                onClick={isLoading ? undefined : onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200"
              >
                <X size={16} />
              </button>
            </div>

            <div className="rounded-3xl border border-purple-100 bg-purple-50/50 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-purple-700">
                <MessageSquare size={16} />
                Optional note
              </div>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value.slice(0, MAX_NOTE_LENGTH))}
                rows={5}
                placeholder="You stood out for your work in biotech and that line in your profile about building thoughtful things. I'd love to connect."
                className="w-full resize-none rounded-2xl border border-purple-100 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-purple-300 focus:ring-2 focus:ring-purple-200"
              />
              <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                <span>Keep it concise and specific.</span>
                <span>{message.length}/{MAX_NOTE_LENGTH}</span>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
                onClick={() => onSend(message.trim() || undefined)}
              >
                Send Connection Note
              </Button>
              <Button
                variant="secondary"
                size="lg"
                fullWidth
                disabled={isLoading}
                onClick={() => onSend(undefined)}
              >
                Connect Without a Note
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
