import { motion } from 'framer-motion'

const WA_LINK_1 = 'https://wa.me/5500000000000?text=Ol%C3%A1%2C%20Chris!'
const WA_LINK_2 = 'https://wa.me/5500000000000?text=Ol%C3%A1%2C%20tenho%20uma%20d%C3%BAvida!'

export default function WhatsAppSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.05 }}
      className="px-4 pb-4"
    >
      <div className="grid grid-cols-2 gap-3">
        <WhatsAppCard
          href={WA_LINK_1}
          label="Falar no WhatsApp"
          sublabel="Vamos conversar"
          delay={0}
        />
        <WhatsAppCard
          href={WA_LINK_2}
          label="Tirar dúvidas"
          sublabel="Estou aqui pra você"
          delay={0.08}
        />
      </div>
    </motion.section>
  )
}

function WhatsAppCard({
  href,
  label,
  sublabel,
  delay,
}: {
  href: string
  label: string
  sublabel: string
  delay: number
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94], delay }}
      className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl text-center"
      style={{
        background: 'linear-gradient(145deg, #FFF0F3 0%, #FFE4EC 100%)',
        border: '1px solid #F4B8CC',
        boxShadow: '0 2px 12px rgba(194, 24, 69, 0.08)',
      }}
    >
      <WhatsAppIcon size={22} />
      <div>
        <p className="text-[0.78rem] font-medium text-espresso leading-tight mb-0.5">{label}</p>
        <p className="text-[0.65rem] text-driftwood font-light italic">{sublabel}</p>
      </div>
    </motion.a>
  )
}

function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="#9E0F2F"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}
