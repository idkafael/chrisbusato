import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const GROUP_LINK = 'https://chat.whatsapp.com/Bsv2jPif2JH8RHbsFc3LZC'

export default function CTASection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="px-4 pb-4"
    >
      <div
        className="relative rounded-3xl overflow-hidden px-6 py-8"
        style={{
          background:
            'linear-gradient(145deg, #F2EBE0 0%, #EFF4EB 60%, #E4D8C8 100%)',
          boxShadow: '0 4px 24px rgba(92, 112, 80, 0.10), 0 1px 4px rgba(92, 112, 80, 0.06)',
        }}
      >
        {/* Leaf decoration */}
        <div
          className="absolute top-0 right-0 opacity-20 pointer-events-none"
          aria-hidden="true"
          style={{ transform: 'translate(20%, -20%) rotate(15deg)' }}
        >
          <BigLeaf />
        </div>
        <div
          className="absolute bottom-0 left-0 opacity-10 pointer-events-none"
          aria-hidden="true"
          style={{ transform: 'translate(-25%, 25%) rotate(195deg)' }}
        >
          <BigLeaf />
        </div>

        {/* Label */}
        <p className="text-[0.65rem] font-medium tracking-[0.25em] uppercase text-sage mb-3 relative z-10">
          Grupo de Lançamento
        </p>

        {/* Display title */}
        <h2
          className="font-serif text-[2.1rem] leading-[1.1] font-semibold text-espresso mb-5 relative z-10"
          style={{ fontStyle: 'italic' }}
        >
          O Corpo<br />
          Musical
        </h2>

        {/* Description */}
        <p className="text-[0.82rem] text-driftwood leading-[1.7] mb-7 relative z-10 font-light max-w-[260px]">
          Uma experiência de dança que convida seu corpo a se mover com mais verdade, presença e musicalidade.
        </p>

        {/* CTA Button */}
        <motion.a
          href={GROUP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.1 }}
          className="relative z-10 flex items-center justify-center gap-2.5 w-full py-[17px] rounded-2xl text-[0.82rem] font-medium tracking-wide text-warm"
          style={{
            background: 'linear-gradient(135deg, #5C7050 0%, #7A9268 100%)',
            boxShadow: '0 4px 16px rgba(92, 112, 80, 0.35)',
          }}
        >
          Entre para a próxima experiência
          <ArrowRight size={15} strokeWidth={2} />
        </motion.a>

        {/* Microcopy */}
        <p className="relative z-10 text-center text-[0.72rem] text-driftwood mt-3 font-light italic">
          Não precisa saber dançar
        </p>
      </div>
    </motion.section>
  )
}

function BigLeaf() {
  return (
    <svg width="100" height="150" viewBox="0 0 100 150" fill="none" aria-hidden="true">
      <path
        d="M50 5C50 5, 95 35, 95 75C95 115, 50 145, 50 145C50 145, 5 115, 5 75C5 35, 50 5, 50 5Z"
        fill="#7A9268"
      />
      <path d="M50 5L50 145" stroke="#EFF4EB" strokeWidth="1" opacity="0.3" />
      <path d="M8 75C25 58, 75 58, 92 75" stroke="#EFF4EB" strokeWidth="0.8" opacity="0.25" fill="none" />
      <path d="M14 55C30 42, 70 42, 86 55" stroke="#EFF4EB" strokeWidth="0.6" opacity="0.2" fill="none" />
      <path d="M14 95C30 108, 70 108, 86 95" stroke="#EFF4EB" strokeWidth="0.6" opacity="0.2" fill="none" />
    </svg>
  )
}
