import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, Send, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { sendChatMessage } from '@/lib/chatbotApiClient';

const GREETING = {
  role: 'assistant',
  content:
    "Hi! I'm the Job Hunting U assistant. Ask me anything about our programs, pricing, or process.",
};

const FALLBACK_TEXT =
  "Sorry, something went wrong on our end. Please try again, or book a discovery call with Jerry directly.";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isOpen]);

  const handleSend = async (event) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const nextMessages = [...messages, { role: 'user', content: trimmed }];
    setMessages(nextMessages);
    setInput('');
    setIsSending(true);

    try {
      const history = nextMessages
        .filter((msg) => msg !== GREETING)
        .slice(-6)
        .map(({ role, content }) => ({ role, content }));

      const data = await sendChatMessage(trimmed, history);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.response, success: data.success },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: FALLBACK_TEXT, success: false },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="mb-4 flex h-[520px] w-[360px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-brand"
          >
            <div className="flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground">
              <div>
                <p className="font-semibold leading-none">Job Hunting U</p>
                <p className="text-xs text-primary-foreground/80">Ask us anything</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="rounded-full p-1 text-primary-foreground/90 transition-colors hover:bg-primary-foreground/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3">
              <div className="flex flex-col gap-3">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={cn(
                      'max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed',
                      msg.role === 'user'
                        ? 'ml-auto bg-primary text-primary-foreground'
                        : 'mr-auto bg-muted text-foreground'
                    )}
                  >
                    {msg.content}
                    {msg.role === 'assistant' && msg.success === false && (
                      <div className="mt-2">
                        <Link
                          to="/contact"
                          onClick={() => setIsOpen(false)}
                          className="text-xs font-semibold text-secondary underline underline-offset-2"
                        >
                          Talk to us directly &rarr;
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
                {isSending && (
                  <div className="mr-auto max-w-[85%] rounded-2xl bg-muted px-3 py-2 text-sm text-muted-foreground">
                    Typing...
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-border px-3 py-2">
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="mb-2 block text-center text-xs font-medium text-muted-foreground hover:text-primary"
              >
                Prefer to talk to a person? Contact us &rarr;
              </Link>
              <form onSubmit={handleSend} className="flex items-center gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your question..."
                  disabled={isSending}
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={isSending || !input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={() => setIsOpen((prev) => !prev)}
        size="icon"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        className="h-14 w-14 rounded-full shadow-brand"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>
    </div>
  );
}
