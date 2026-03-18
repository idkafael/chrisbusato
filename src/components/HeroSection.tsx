import { motion } from 'framer-motion'
import { Instagram } from 'lucide-react'
import logo from '../assets/logo.png'

type ReactNode = React.ReactNode

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94]

const fade = (delay = 0) =>
  ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.75, ease: EASE, delay },
  }) as const

export default function HeroSection() {
  return (
    <section
      className="relative flex flex-col items-center px-6 pt-14 pb-10 text-center overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at 80% 10%, #E4D8C820 0%, transparent 55%), radial-gradient(ellipse at 10% 90%, #EFF4EB25 0%, transparent 55%), #FAF7F4',
      }}
    >
      {/* Decorative orb — top right */}
      <div
        className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(circle, #C4A88230 0%, transparent 70%)',
          transform: 'translate(30%, -30%)',
        }}
      />
      {/* Decorative orb — bottom left */}
      <div
        className="absolute bottom-0 left-0 w-40 h-40 rounded-full pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(circle, #7A926820 0%, transparent 70%)',
          transform: 'translate(-30%, 30%)',
        }}
      />

      {/* Leaf ornament */}
      <div className="absolute top-6 right-6 opacity-10 pointer-events-none" aria-hidden="true">
        <LeafOrnament />
      </div>

      {/* Profile Image */}
      <motion.div {...fade(0)} className="mb-6">
        <div className="relative w-[108px] h-[108px]">
          {/* Glow ring */}
          <div
            className="absolute inset-[-4px] rounded-full pointer-events-none"
            style={{
              background: 'conic-gradient(from 0deg, #7A9268, #C4A882, #C99080, #7A9268)',
              opacity: 0.3,
              filter: 'blur(6px)',
            }}
          />
          {/* Gradient border ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              padding: '2.5px',
              background: 'linear-gradient(135deg, #7A9268 0%, #C4A882 50%, #C99080 100%)',
            }}
          >
            <div className="w-full h-full rounded-full overflow-hidden bg-cream">
              <img
                src={logo}
                alt="Chris Busato Logo"
                width={108}
                height={108}
                className="w-full h-full object-cover"
                style={{ backgroundColor: '#C4A882' }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Name */}
      <motion.div {...fade(0.15)} className="mb-1">
        <h1
          className="font-serif text-[2.15rem] leading-tight font-semibold text-espresso"
          style={{ fontStyle: 'italic', letterSpacing: '0.01em' }}
        >
          Chris Busato
        </h1>
      </motion.div>

      {/* Subtitle */}
      <motion.p
        {...fade(0.22)}
        className="text-[0.7rem] font-light text-driftwood tracking-[0.28em] uppercase mb-5"
      >
        Dança &amp; Consciência
      </motion.p>

      {/* Ornamental divider */}
      <motion.div {...fade(0.3)} className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-px bg-linen" />
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
          <circle cx="4" cy="4" r="2" fill="#7A9268" opacity="0.6" />
        </svg>
        <div className="w-8 h-px bg-linen" />
      </motion.div>

      {/* Bio */}
      <motion.p
        {...fade(0.36)}
        className="text-[0.83rem] text-driftwood leading-[1.75] max-w-[270px] mb-3 font-light"
      >
        Ajudo quem ama dançar a ter um corpo mais fluído e musical através do método{' '}
        <span className="text-espresso font-normal" style={{ fontStyle: 'italic' }}>
          'O Corpo Musical'
        </span>
      </motion.p>

      {/* Tagline */}
      <motion.p
        {...fade(0.44)}
        className="font-serif text-[0.95rem] text-sage leading-snug max-w-[255px] mb-7"
        style={{ fontStyle: 'italic' }}
      >
        "Mais do que dançar melhor, é sobre sentir com mais verdade."
      </motion.p>

      {/* Social icons */}
      <motion.div {...fade(0.52)} className="flex gap-3">
        <SocialLink href="https://www.instagram.com/chrisbusato" label="Instagram">
          <Instagram size={15} strokeWidth={1.5} />
        </SocialLink>
        <SocialLink href="#" label="YouTube">
          <YouTubeIcon size={16} />
        </SocialLink>
        <SocialLink href="#" label="TikTok">
          <TikTokIcon size={15} />
        </SocialLink>
      </motion.div>
    </section>
  )
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: ReactNode
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="w-9 h-9 flex items-center justify-center rounded-full border border-linen bg-cream text-driftwood hover:text-sage hover:border-sage transition-colors duration-300"
    >
      {children}
    </a>
  )
}

function LeafOrnament() {
  return (
    <svg width="48" height="72" viewBox="0 0 48 72" fill="none" aria-hidden="true">
      <path
        d="M24 4C24 4,44 18,44 36C44 54,24 68,24 68C24 68,4 54,4 36C4 18,24 4,24 4Z"
        fill="#7A9268"
      />
      <path d="M24 4L24 68" stroke="#FAF7F4" strokeWidth="0.8" opacity="0.5" />
      <path
        d="M6 36C14 28,34 28,42 36"
        stroke="#FAF7F4"
        strokeWidth="0.6"
        opacity="0.4"
        fill="none"
      />
    </svg>
  )
}

function YouTubeIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
    </svg>
  )
}

function TikTokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.77 1.52V6.73a4.85 4.85 0 0 1-1-.04z" />
    </svg>
  )
}
