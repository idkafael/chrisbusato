import { motion } from 'framer-motion'
import f1 from '../assets/feedback (1).jpg'
import f2 from '../assets/feedback (2).jpg'
import f3 from '../assets/feedback (1).webp'
import f4 from '../assets/feedback (4).jpg'

const feedbacks = [
  { id: 1, src: f1 },
  { id: 2, src: f2 },
  { id: 3, src: f3 },
  { id: 4, src: f4 },
]

export default function TestimonialsSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="px-4 pb-4"
    >
      {/* Section header */}
      <div className="text-center mb-5">
        <p className="text-[0.65rem] tracking-[0.25em] uppercase text-driftwood font-light mb-1.5">
          Transformações
        </p>
        <h3
          className="font-serif text-[1.35rem] font-semibold text-espresso"
          style={{ fontStyle: 'italic' }}
        >
          O que dizem por aí
        </h3>
      </div>

      <div className="flex flex-col gap-3">
        {feedbacks.map((f, i) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.08 }}
            className="rounded-2xl overflow-hidden shadow-sm"
          >
            <img src={f.src} alt={`Feedback ${f.id}`} className="w-full h-auto object-cover rounded-2xl" />
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}
