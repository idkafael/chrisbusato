import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

const links = [
  {
    id: 1,
    icon: '🌿',
    label: 'Grupo de Lançamento',
    sublabel: 'O Corpo Musical',
    href: 'https://chat.whatsapp.com/Bsv2jPif2JH8RHbsFc3LZC',
  },
  {
    id: 2,
    icon: '🤝',
    label: 'Comunidade Artistas da Conexão',
    sublabel: 'Amantes da Dança',
    href: 'https://api.whatsapp.com/send/?phone=5511998431233&text=Quero%20fazer%20parte%20da%20comunidade%20Artistas%20da%20Conex%C3%A3o&type=phone_number&app_absent=0',
  },
  {
    id: 3,
    icon: '✨',
    label: 'Mentoria Casal',
    sublabel: 'Um Date Fora do Comum',
    href: 'https://api.whatsapp.com/send/?phone=5511998431233&text=Oi%2C%20pode%20me%20dar%20mais%20informa%C3%A7%C3%B5es%20sobre%20a%20mentoria%20para%20casais%3F&type=phone_number&app_absent=0',
  },
]

export default function LinksSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="px-4 pb-4"
    >
      {/* Section label */}
      <div className="flex items-center gap-3 mb-3 px-1">
        <div className="h-px flex-1 bg-linen" />
        <p className="text-[0.62rem] tracking-[0.22em] uppercase text-driftwood font-light">
          Explore
        </p>
        <div className="h-px flex-1 bg-linen" />
      </div>

      <div className="flex flex-col gap-2.5">
        {links.map((link, i) => (
          <LinkCard key={link.id} link={link} delay={i * 0.07} />
        ))}
      </div>
    </motion.section>
  )
}

function LinkCard({
  link,
  delay,
}: {
  link: { icon: string; label: string; sublabel: string; href: string }
  delay: number
}) {
  return (
    <motion.a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -3, scale: 1.015, boxShadow: '0 8px 24px rgba(92, 112, 80, 0.12)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94], delay }}
      className="group flex items-center gap-4 px-5 py-4 rounded-2xl relative overflow-hidden bg-white"
      style={{
        border: '1px solid #E4D8C8',
        boxShadow: '0 4px 14px rgba(58, 43, 31, 0.05)',
      }}
    >
      {/* Icon */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center text-[1.4rem] shrink-0 transition-transform duration-300 group-hover:scale-110"
        style={{ background: '#F2EBE0', border: '1px solid #EAE0D5' }}
      >
        {link.icon}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-[0.85rem] font-medium text-espresso leading-tight transition-colors duration-300 group-hover:text-[#5C7050]">
          {link.label}
        </p>
        <p className="text-[0.72rem] text-driftwood font-light italic mt-0.5">{link.sublabel}</p>
      </div>

      {/* Arrow */}
      <div 
        className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-[#5C7050]" 
        style={{ background: '#F5EDE5' }}
      >
        <ChevronRight size={16} strokeWidth={2} className="text-driftwood transition-colors duration-300 group-hover:text-[#FAF7F4]" />
      </div>
    </motion.a>
  )
}
