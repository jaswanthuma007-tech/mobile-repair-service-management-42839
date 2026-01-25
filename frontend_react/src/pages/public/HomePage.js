import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button, Container } from '../../ui/tw';

/**
 * Motion helpers (small, local, and predictable).
 */
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 }
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1 }
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

function cn(...parts) {
  return parts.filter(Boolean).join(' ');
}

function IconPin(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
    </svg>
  );
}

function IconWrench(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M21.7 18.3 13 9.6a6.1 6.1 0 0 0-7.8-7.8l3.2 3.2-1.9 1.9-3.2-3.2A6.1 6.1 0 0 0 11 11l8.7 8.7a1.4 1.4 0 0 0 2 0 1.4 1.4 0 0 0 0-2Z" />
      <path d="M7.4 12.6 2.8 17.2a2.8 2.8 0 0 0 4 4l4.6-4.6-4-4Z" />
    </svg>
  );
}

function IconShield(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2 4 5.5V12c0 5 3.4 9.4 8 10.9 4.6-1.5 8-5.9 8-10.9V5.5L12 2Zm0 18.4c-3.2-1.3-5.5-4.6-5.5-8.4V7l5.5-2.4L17.5 7v5c0 3.8-2.3 7.1-5.5 8.4Z" />
      <path d="M10.9 13.9 8.6 11.6l-1.1 1.1 3.4 3.4 5.7-5.7-1.1-1.1-4.6 4.6Z" />
    </svg>
  );
}

function FeaturePill({ icon, title, subtitle }) {
  return (
    <motion.div
      variants={fadeUp}
      className={cn(
        'flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3',
        'backdrop-blur-md shadow-[0_18px_40px_rgba(0,0,0,0.22)]'
      )}
    >
      <div
        className={cn(
          'grid h-10 w-10 shrink-0 place-items-center rounded-xl',
          'bg-white/12 text-white ring-1 ring-white/15'
        )}
        aria-hidden="true"
      >
        {icon}
      </div>
      <div className="min-w-0">
        <div className="truncate text-sm font-extrabold tracking-tight text-white">{title}</div>
        <div className="truncate text-xs text-white/80">{subtitle}</div>
      </div>
    </motion.div>
  );
}

function PhoneMockupCard() {
  return (
    <motion.div
      variants={fadeUp}
      className={cn(
        'relative overflow-hidden rounded-3xl border border-black/10 bg-white',
        'shadow-[0_16px_34px_rgba(17,24,39,0.12)]'
      )}
      aria-label="Phone mockup preview card"
    >
      <div className="absolute inset-0 bg-[radial-gradient(800px_380px_at_20%_10%,rgba(37,99,235,0.14),transparent_58%),radial-gradient(520px_320px_at_90%_30%,rgba(245,158,11,0.10),transparent_55%)]" />
      <div className="relative p-6">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-ocean-muted">Repair tracking</div>
          <div className="rounded-full border border-black/10 bg-ocean-bg px-3 py-1 text-xs font-semibold text-ocean-muted">
            Live updates
          </div>
        </div>

        {/* Minimal "phone" mock (pure CSS) so we don't rely on binary assets */}
        <div className="mt-5 flex justify-center">
          <div className="relative h-[360px] w-[200px] rounded-[34px] border border-black/10 bg-[#0b1220] shadow-[0_22px_50px_rgba(17,24,39,0.22)]">
            <div className="absolute left-1/2 top-3 h-4 w-16 -translate-x-1/2 rounded-full bg-black/50" aria-hidden="true" />
            <div className="absolute inset-[10px] rounded-[28px] bg-gradient-to-b from-white/10 to-white/0" aria-hidden="true" />
            <div className="absolute inset-3 rounded-[28px] bg-white">
              <div className="h-full rounded-[26px] bg-[radial-gradient(800px_500px_at_15%_0%,rgba(37,99,235,0.14),transparent_55%),radial-gradient(600px_340px_at_100%_0%,rgba(245,158,11,0.10),transparent_55%)] p-4">
                <div className="text-[11px] font-semibold text-ocean-muted">Ticket</div>
                <div className="mt-1 text-sm font-black tracking-tight text-ocean-text">MR-24819</div>

                <div className="mt-4 grid gap-2">
                  {[
                    ['Picked up', true],
                    ['Diagnostics', true],
                    ['Parts arranged', false]
                  ].map(([label, done]) => (
                    <div
                      key={label}
                      className={cn(
                        'flex items-center justify-between rounded-xl border px-3 py-2',
                        done ? 'border-blue-600/20 bg-blue-600/10' : 'border-black/10 bg-white'
                      )}
                    >
                      <div className="text-xs font-semibold text-ocean-text">{label}</div>
                      <div
                        className={cn(
                          'h-2.5 w-2.5 rounded-full',
                          done ? 'bg-blue-600' : 'bg-black/15'
                        )}
                        aria-hidden="true"
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-xl border border-black/10 bg-white px-3 py-2">
                  <div className="text-[11px] font-semibold text-ocean-muted">ETA</div>
                  <div className="text-xs font-bold text-ocean-text">Today, 6:30 PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 text-xs text-ocean-muted">
          A clean, Samsung-like card treatment with subtle gradients and soft shadows.
        </div>
      </div>
    </motion.div>
  );
}

// PUBLIC_INTERFACE
export default function HomePage() {
  /** Samsung-style Service Center landing section with blurred hero, feature highlights, motion, and CTA into booking flow. */
  const navigate = useNavigate();

  const goToBooking = () => {
    // Booking flow requirement: Brand → Model → Issue → Confirm.
    // Current app routes start at /select-brand.
    navigate('/select-brand');
  };

  return (
    <div className="bg-ocean-bg">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background image + blur overlay (Samsung-like) */}
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1581091215367-59ab6b6b5b1e?auto=format&fit=crop&w=2400&q=80')"
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 -z-10 bg-black/55 backdrop-blur-md" aria-hidden="true" />
        <div
          className="absolute inset-0 -z-10 bg-[radial-gradient(1100px_520px_at_25%_0%,rgba(37,99,235,0.28),transparent_60%),radial-gradient(900px_520px_at_100%_10%,rgba(37,99,235,0.18),transparent_55%)]"
          aria-hidden="true"
        />

        <Container className="py-16 sm:py-20">
          <motion.div
            initial="hidden"
            animate="show"
            variants={stagger}
            className="mx-auto grid max-w-4xl place-items-center gap-7 text-center"
          >
            <motion.div
              variants={fadeIn}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white/90 backdrop-blur"
            >
              <span className="h-2 w-2 rounded-full bg-[#2563eb]" aria-hidden="true" />
              Samsung-style service experience, built for MobileRepair
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl font-black leading-tight tracking-tight text-white drop-shadow sm:text-6xl"
            >
              Service Center
            </motion.h1>

            <motion.p variants={fadeUp} className="max-w-2xl text-base text-white/85 sm:text-lg">
              Fast, professional repairs with transparent updates. Built with genuine parts and trained experts—designed with modern
              Samsung-like spacing and clarity.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col items-center gap-3 sm:flex-row">
              <Button
                className="btn-shine w-full px-6 py-3 sm:w-auto"
                onClick={goToBooking}
              >
                Book Repair
              </Button>
              <div className="text-xs font-semibold text-white/80">
                Brand → Model → Issue → Confirm
              </div>
            </motion.div>

            <motion.div variants={stagger} className="mt-6 grid w-full gap-3 sm:grid-cols-3">
              <FeaturePill
                icon={<IconPin className="h-5 w-5" />}
                title="3000+ Service Points"
                subtitle="Easy drop-off & pickup"
              />
              <FeaturePill
                icon={<IconWrench className="h-5 w-5" />}
                title="Trained Service Experts"
                subtitle="Certified technicians"
              />
              <FeaturePill
                icon={<IconShield className="h-5 w-5" />}
                title="Genuine Parts"
                subtitle="Quality you can trust"
              />
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Below-hero content block */}
      <section className="border-t border-black/10 bg-white py-14 sm:py-16">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            variants={stagger}
            className="grid items-center gap-10 lg:grid-cols-2"
          >
            <motion.div variants={stagger} className="grid gap-4">
              <motion.h2 variants={fadeUp} className="text-3xl font-black tracking-tight text-ocean-text">
                Professional Mobile Repair Service
              </motion.h2>

              <motion.p variants={fadeUp} className="text-sm leading-relaxed text-ocean-muted">
                Your device is handled with care—from diagnostics to final quality checks. We prioritize data privacy, safe repair
                practices, and genuine parts so you get consistent performance after service. Track status updates and stay informed at
                every step.
              </motion.p>

              <motion.ul variants={stagger} className="mt-1 grid gap-3">
                {[
                  ['Data privacy first', 'We follow safe handling practices during repairs.'],
                  ['Quality parts + warranty', 'Trusted components with service assurance.'],
                  ['Clear communication', 'Receive transparent progress updates.']
                ].map(([title, desc]) => (
                  <motion.li
                    key={title}
                    variants={fadeUp}
                    className="flex gap-3 rounded-2xl border border-black/10 bg-ocean-bg p-4 shadow-[0_10px_20px_rgba(17,24,39,0.06)]"
                  >
                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-blue-600/10 text-blue-700 ring-1 ring-blue-600/15">
                      <span className="h-2 w-2 rounded-full bg-[#2563eb]" aria-hidden="true" />
                    </span>
                    <div>
                      <div className="text-sm font-extrabold tracking-tight text-ocean-text">{title}</div>
                      <div className="text-xs text-ocean-muted">{desc}</div>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>

              <motion.div variants={fadeUp} className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button className="w-full px-6 py-3 sm:w-auto" onClick={goToBooking}>
                  Book Repair
                </Button>
                <div className="text-xs text-ocean-muted">
                  Ready in minutes—start with your brand and model.
                </div>
              </motion.div>
            </motion.div>

            <PhoneMockupCard />
          </motion.div>
        </Container>
      </section>

      {/* Mobile sticky CTA */}
      <div className="sticky bottom-0 z-20 border-t border-black/10 bg-white/85 backdrop-blur sm:hidden">
        <Container className="flex items-center justify-between gap-3 py-3">
          <div className="min-w-0">
            <div className="truncate text-sm font-extrabold">Need repair fast?</div>
            <div className="truncate text-xs text-ocean-muted">Book now & track live</div>
          </div>
          <Button className="shrink-0 px-4 py-2.5" onClick={goToBooking}>
            Book Repair
          </Button>
        </Container>
      </div>
    </div>
  );
}
