import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const GROUP_LINK = 'https://chat.whatsapp.com/Bsv2jPif2JH8RHbsFc3LZC'

export default function ClosingSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative overflow-hidden px-4 pt-10 pb-12"
      style={{
        background:
          'linear-gradient(160deg, #F5EDE5 0%, #F0E8DD 50%, #EAE0D5 100%)',
      }}
    >
      {/* Decorative orbs */}
      <div
        className="absolute top-0 left-0 w-48 h-48 rounded-full pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(circle, #C9908030 0%, transparent 70%)',
          transform: 'translate(-30%, -30%)',
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-40 h-40 rounded-full pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(circle, #7A926820 0%, transparent 70%)',
          transform: 'translate(30%, 30%)',
        }}
      />

      {/* Ornamental leaf pair */}
      <div className="flex justify-center mb-6" aria-hidden="true">
        <div className="flex items-center gap-1 opacity-25">
          <svg width="18" height="28" viewBox="0 0 18 28" fill="none">
            <path d="M9 2C9 2,17 8,17 14C17 20,9 26,9 26C9 26,1 20,1 14C1 8,9 2,9 2Z" fill="#7A9268" />
          </svg>
          <svg width="24" height="36" viewBox="0 0 24 36" fill="none">
            <path d="M12 2C12 2,22 10,22 18C22 26,12 34,12 34C12 34,2 26,2 18C2 10,12 2,12 2Z" fill="#5C7050" />
          </svg>
          <svg width="18" height="28" viewBox="0 0 18 28" fill="none">
            <path d="M9 2C9 2,17 8,17 14C17 20,9 26,9 26C9 26,1 20,1 14C1 8,9 2,9 2Z" fill="#7A9268" />
          </svg>
        </div>
      </div>

      {/* Emotional closing copy */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="text-center mb-8"
      >
        <p
          className="font-serif text-[1.55rem] italic font-semibold text-espresso leading-[1.35] mb-4"
        >
          "Seu corpo não precisa<br />
          de mais cobrança.<br />
          <span className="text-sage">Ele precisa de escuta."</span>
        </p>
        <p className="text-[0.8rem] text-driftwood font-light leading-relaxed max-w-[260px] mx-auto">
          Quando você se permite sentir, a dança deixa de ser performance e se torna presença.
        </p>
      </motion.div>

      {/* Final CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65, delay: 0.28 }}
        className="flex flex-col gap-3"
      >
        <motion.a
          href={GROUP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.1 }}
          className="flex items-center justify-center gap-2 py-[17px] rounded-2xl text-[0.82rem] font-medium tracking-wide text-warm"
          style={{
            background: 'linear-gradient(135deg, #7A9268 0%, #5C7050 100%)',
            boxShadow: '0 4px 16px rgba(92, 112, 80, 0.25)',
          }}
        >
          Entrar no Grupo
          <ArrowRight size={14} strokeWidth={2} />
        </motion.a>
      </motion.div>

      {/* Footer */}
      <div className="mt-10 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-6 h-px bg-linen" />
          <svg width="6" height="6" viewBox="0 0 6 6" fill="none" aria-hidden="true">
            <circle cx="3" cy="3" r="2" fill="#C4A882" opacity="0.6" />
          </svg>
          <div className="w-6 h-px bg-linen" />
        </div>
        <p className="text-[0.65rem] text-driftwood font-light tracking-[0.15em]">
          © 2025 Chris Busato
        </p>
        <p
          className="font-serif text-[0.72rem] italic text-sage mt-1"
          style={{ fontStyle: 'italic' }}
        >
          Dança &amp; Consciência
        </p>
      </div>
    </motion.section>
  )
}
