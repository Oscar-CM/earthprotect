'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { Check, ShieldCheck, Scale, ChevronDown, Loader2, AlertCircle, Briefcase, MapPin, CalendarDays, FileText, Award } from 'lucide-react'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { ShareJob } from '@/components/shared/ShareJob'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { CAREERS_EMAIL, cvEmailSubject, jobShareUrl, type PublicCountry } from '@/lib/careers'
import { submitJobApplication } from '@/app/actions/careers'

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  residence: '',
  yearsExperience: '',
  motivation: '',
  rightToWork: false,
  backgroundConsent: false,
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function CareersClient({
  countries,
  baseUrl,
  initialJobId,
}: {
  countries: PublicCountry[]
  baseUrl: string
  initialJobId: string | null
}) {
  const linkedCountry = initialJobId ? countries.find((c) => c.openings.some((o) => o.id === initialJobId)) : undefined
  const [countryCode, setCountryCode] = useState(linkedCountry?.code ?? countries[0]?.code ?? '')
  const [openRole, setOpenRole] = useState<string | null>(linkedCountry ? initialJobId : null)
  const [applyRole, setApplyRole] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const [form, setForm] = useState(EMPTY_FORM)
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (linkedCountry && initialJobId) {
      document.getElementById(`job-${initialJobId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const country = countries.find((c) => c.code === countryCode) ?? countries[0]
  const role = applyRole ? country?.openings.find((o) => o.id === applyRole) : undefined

  function selectCountry(code: string) {
    setCountryCode(code)
    setApplyRole(null)
    setOpenRole(null)
    setSubmitted(false)
    setError('')
  }

  function startApply(id: string) {
    setApplyRole(id)
    setSubmitted(false)
    setError('')
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!applyRole) return
    setError('')
    startTransition(async () => {
      const result = await submitJobApplication({
        ...form,
        openingId: applyRole,
      })
      if (result.success) {
        setSubmitted(true)
        setForm(EMPTY_FORM)
      } else {
        setError(result.error ?? 'Something went wrong. Please try again.')
      }
    })
  }

  const field = { borderColor: 'var(--ep-border)' }

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ background: 'var(--ep-bg)' }}>
      <div className="py-14 px-6 text-center" style={{ background: 'var(--ep-bg2)', borderBottom: '1px solid var(--ep-border)' }}>
        <div className="max-w-2xl mx-auto">
          <SectionTitle
            accent="Careers"
            title="Work With Earth Protect on the Ground"
            subtitle={
              countries.length
                ? `We are building country teams in ${countries.map((c) => c.name).join(', ')}. Browse the open positions below.`
                : 'We are building country teams across Africa. Check back soon for open positions.'
            }
            centered
          />
        </div>
      </div>

      {!country ? (
        <p className="text-center text-sm py-16" style={{ color: 'var(--ep-muted)' }}>
          There are no open positions right now. Please check back soon.
        </p>
      ) : (
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Country tabs */}
        <div className="flex flex-wrap gap-3 mb-8" role="tablist" aria-label="Country">
          {countries.map((c) => {
            const active = c.code === countryCode
            return (
              <button
                key={c.code}
                role="tab"
                aria-selected={active}
                onClick={() => selectCountry(c.code)}
                className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
                style={{
                  background: active ? 'var(--ep-primary)' : 'var(--ep-card)',
                  color: active ? '#fff' : 'var(--ep-text)',
                  border: `1px solid ${active ? 'var(--ep-primary)' : 'var(--ep-border)'}`,
                }}
              >
                {c.flag} {c.name}
              </button>
            )
          })}
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold mb-1" style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}>
            {country.flag} {country.name}, {country.region}
          </h3>
          <p className="text-sm" style={{ color: 'var(--ep-muted)' }}>
            Focus: {country.focus}. Working languages: {country.languages}.
          </p>
        </div>

        {/* Roles */}
        <div className="space-y-4 mb-10">
          {country.openings.length === 0 && (
            <p className="text-sm" style={{ color: 'var(--ep-muted)' }}>No positions are listed for {country.name} right now.</p>
          )}
          {country.openings.map((r) => {
            const open = openRole === r.id
            const canApply = r.availability === 'open'
            return (
              <div
                key={r.id}
                id={`job-${r.id}`}
                className="rounded-xl overflow-hidden scroll-mt-28"
                style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}
              >
                <button
                  type="button"
                  onClick={() => setOpenRole(open ? null : r.id)}
                  aria-expanded={open}
                  className="w-full flex items-start gap-4 p-5 text-left"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'color-mix(in srgb, var(--ep-primary) 12%, transparent)' }}
                  >
                    <Briefcase size={20} style={{ color: 'var(--ep-primary)' }} />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold" style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}>
                      {r.title}, {country.name}
                    </p>
                    <p className="text-xs mb-2" style={{ color: 'var(--ep-accent)' }}>
                      {r.employmentType}{r.reportsTo ? ` · Reports to ${r.reportsTo}` : ''}
                      {r.positions > 1 ? ` · ${r.positions} positions` : ''}
                    </p>
                    <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs mb-2" style={{ color: 'var(--ep-muted)' }}>
                      {r.location && <span className="inline-flex items-center gap-1"><MapPin size={11} /> {r.location}</span>}
                      {r.salary && <span>{r.salary}</span>}
                      {r.availability === 'upcoming' && r.opensAt && <span className="inline-flex items-center gap-1"><CalendarDays size={11} /> Opens {fmtDate(r.opensAt)}</span>}
                      {r.availability === 'open' && r.closesAt && <span className="inline-flex items-center gap-1"><CalendarDays size={11} /> Apply by {fmtDate(r.closesAt)}</span>}
                      {r.availability === 'closed' && <span style={{ color: '#dc2626' }}>Applications closed</span>}
                    </p>
                    <p className="text-sm" style={{ color: 'var(--ep-muted)' }}>{r.summary}</p>
                  </div>
                  <ChevronDown
                    size={18}
                    className="shrink-0 mt-1 transition-transform"
                    style={{ color: 'var(--ep-muted)', transform: open ? 'rotate(180deg)' : undefined }}
                  />
                </button>

                {open && (
                  <div className="px-5 pb-5 pt-0 grid gap-5 md:grid-cols-3 text-sm" style={{ borderTop: '1px solid var(--ep-border)' }}>
                    {[
                      ['Responsibilities', r.responsibilities],
                      ['Requirements', r.requirements],
                      ['Nice to have', r.niceToHave],
                    ].map(([title, items]) => (
                      <div key={title as string} className="pt-5">
                        <p className="font-semibold mb-2" style={{ color: 'var(--ep-text)' }}>{title as string}</p>
                        <ul className="space-y-1.5">
                          {(items as string[]).map((item) => (
                            <li key={item} className="flex items-start gap-1.5" style={{ color: 'var(--ep-muted)' }}>
                              <Check size={13} className="shrink-0 mt-1" style={{ color: 'var(--ep-least-concern)' }} />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    {r.timeline.length > 0 && (
                      <div className="md:col-span-3">
                        <p className="font-semibold mb-2" style={{ color: 'var(--ep-text)' }}>Hiring timeline</p>
                        <ol className="space-y-1.5">
                          {r.timeline.map((t) => (
                            <li key={`${t.date}-${t.label}`} className="flex gap-3" style={{ color: 'var(--ep-muted)' }}>
                              <span className="w-28 shrink-0 font-medium" style={{ color: 'var(--ep-text)' }}>
                                {Number.isNaN(Date.parse(t.date)) ? t.date : fmtDate(t.date)}
                              </span>
                              {t.label}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                    {canApply && (
                    <div className="md:col-span-3">
                      <Button
                        onClick={() => startApply(r.id)}
                        className="text-white font-semibold"
                        style={{ background: 'var(--ep-primary)', border: 'none' }}
                      >
                        Apply for this role
                      </Button>
                    </div>
                    )}
                  </div>
                )}

                {!open && canApply && (
                  <div className="px-5 pb-4 -mt-1">
                    <Button
                      onClick={() => startApply(r.id)}
                      variant="outline"
                      className="font-semibold"
                      style={{ borderColor: 'var(--ep-primary)', color: 'var(--ep-primary)' }}
                    >
                      Apply
                    </Button>
                  </div>
                )}

                <div className="px-5 py-3" style={{ borderTop: '1px solid var(--ep-border)' }}>
                  <ShareJob url={jobShareUrl(baseUrl, r.id)} title={`${r.title}, ${country.name}`} />
                </div>
              </div>
            )
          })}
        </div>

        {/* How selection works */}
        <div
          className="grid gap-5 md:grid-cols-2 p-6 rounded-xl mb-6"
          style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}
        >
          <div>
            <p className="flex items-center gap-2 font-semibold mb-2" style={{ color: 'var(--ep-text)' }}>
              <FileText size={18} style={{ color: 'var(--ep-primary)' }} /> CV required after the first selection
            </p>
            <p className="text-sm" style={{ color: 'var(--ep-muted)' }}>
              Apply with the short form below. If you pass the first selection, we will ask you to email a CV written for
              the role you applied for (for example, a Community Coordinator CV for a Community Coordinator application), to{' '}
              <a href={`mailto:${CAREERS_EMAIL}`} className="underline" style={{ color: 'var(--ep-primary)' }}>{CAREERS_EMAIL}</a>.
              Please do not send a CV before you are asked.
            </p>
          </div>
          <div>
            <p className="flex items-center gap-2 font-semibold mb-2" style={{ color: 'var(--ep-text)' }}>
              <Award size={18} style={{ color: 'var(--ep-primary)' }} /> Selection is on merit
            </p>
            <p className="text-sm" style={{ color: 'var(--ep-muted)' }}>
              Every application is judged on merit: your skills, experience and fit for the role. Tribe, gender, connections
              or payment play no part, and we never charge a fee at any stage of recruitment.
            </p>
          </div>
        </div>

        {/* Compliance */}
        <div
          className="grid gap-5 md:grid-cols-2 p-6 rounded-xl mb-10"
          style={{ background: 'var(--ep-bg2)', border: '1px solid var(--ep-border)' }}
        >
          <div>
            <p className="flex items-center gap-2 font-semibold mb-2" style={{ color: 'var(--ep-text)' }}>
              <ShieldCheck size={18} style={{ color: 'var(--ep-primary)' }} /> How we vet candidates in {country.name}
            </p>
            <p className="text-xs mb-2" style={{ color: 'var(--ep-muted)' }}>
              Only shortlisted candidates are asked for documents. No offer is made until checks are complete.
            </p>
            <ul className="space-y-1.5 text-sm" style={{ color: 'var(--ep-muted)' }}>
              {country.verification.map((v) => (
                <li key={v} className="flex items-start gap-1.5">
                  <Check size={13} className="shrink-0 mt-1" style={{ color: 'var(--ep-least-concern)' }} /> {v}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="flex items-center gap-2 font-semibold mb-2" style={{ color: 'var(--ep-text)' }}>
              <Scale size={18} style={{ color: 'var(--ep-primary)' }} /> Laws our team must follow
            </p>
            <p className="text-xs mb-2" style={{ color: 'var(--ep-muted)' }}>
              Anyone who breaches these, or who has a history of wildlife or financial crime, will not be hired.
            </p>
            <ul className="space-y-1.5 text-sm" style={{ color: 'var(--ep-muted)' }}>
              {country.laws.map((l) => (
                <li key={l} className="flex items-start gap-1.5">
                  <Check size={13} className="shrink-0 mt-1" style={{ color: 'var(--ep-least-concern)' }} /> {l}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Application form */}
        <div ref={formRef} className="scroll-mt-28">
          {submitted ? (
            <div className="text-center p-8 rounded-2xl" style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}>
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'color-mix(in srgb, var(--ep-secondary) 15%, transparent)' }}
              >
                <Check size={30} style={{ color: 'var(--ep-secondary)' }} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}>
                Application submitted
              </h3>
              <p className="text-sm" style={{ color: 'var(--ep-muted)' }}>
                Thank you. Check your inbox for a confirmation. Applications are considered on merit. If you pass the first
                selection, we will email you to send a CV tailored to the role you applied for.
              </p>
            </div>
          ) : role ? (
            <div className="max-w-xl mx-auto p-6 md:p-8 rounded-2xl" style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}>
              <h3 className="text-lg font-bold mb-5" style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}>
                Apply: {role.title}, {country.name}
              </h3>
              <p className="text-xs mb-5 -mt-3" style={{ color: 'var(--ep-muted)' }}>
                No CV needed yet. If you pass the first selection, you will be asked to email a CV for this role
                (subject: &ldquo;{cvEmailSubject(role.title, country.name)}&rdquo;). Applications are considered on merit.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Input aria-label="First name" placeholder="First name" required disabled={isPending} style={field}
                    value={form.firstName} onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))} />
                  <Input aria-label="Last name" placeholder="Last name" required disabled={isPending} style={field}
                    value={form.lastName} onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))} />
                </div>
                <Input type="email" aria-label="Email address" placeholder="Email address" required disabled={isPending} style={field}
                  value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
                <Input type="tel" aria-label="Phone number" placeholder="Phone / WhatsApp (with country code)" required disabled={isPending} style={field}
                  value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
                <Input aria-label="Where you live" placeholder="Where do you live now? (town, country)" required disabled={isPending} style={field}
                  value={form.residence} onChange={(e) => setForm((f) => ({ ...f, residence: e.target.value }))} />
                <Input aria-label="Years of experience" placeholder="Years of relevant experience" required disabled={isPending} style={field}
                  value={form.yearsExperience} onChange={(e) => setForm((f) => ({ ...f, yearsExperience: e.target.value }))} />
                <Textarea aria-label="Experience and motivation" rows={5} required disabled={isPending} style={field}
                  placeholder="Tell us about your experience and why you want this role…"
                  value={form.motivation} onChange={(e) => setForm((f) => ({ ...f, motivation: e.target.value }))} />

                <label className="flex items-start gap-2 cursor-pointer text-sm" style={{ color: 'var(--ep-muted)' }}>
                  <input type="checkbox" required checked={form.rightToWork} disabled={isPending}
                    onChange={(e) => setForm((f) => ({ ...f, rightToWork: e.target.checked }))}
                    className="w-4 h-4 mt-0.5 rounded" style={{ accentColor: 'var(--ep-primary)' }} />
                  I have the legal right to live and work in {country.name}, or I will obtain it before starting.
                </label>
                <label className="flex items-start gap-2 cursor-pointer text-sm" style={{ color: 'var(--ep-muted)' }}>
                  <input type="checkbox" required checked={form.backgroundConsent} disabled={isPending}
                    onChange={(e) => setForm((f) => ({ ...f, backgroundConsent: e.target.checked }))}
                    className="w-4 h-4 mt-0.5 rounded" style={{ accentColor: 'var(--ep-primary)' }} />
                  If shortlisted, I consent to identity, criminal-record and reference checks, and I confirm I have not been convicted of wildlife, fraud or violence offences.
                </label>

                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-lg text-sm" style={{ background: '#fee2e2', color: '#dc2626' }}>
                    <AlertCircle size={15} /> {error}
                  </div>
                )}

                <Button type="submit" disabled={isPending} className="w-full text-white font-semibold py-5 gap-2"
                  style={{ background: 'var(--ep-primary)', border: 'none' }}>
                  {isPending ? <><Loader2 size={16} className="animate-spin" /> Submitting…</> : 'Submit Application'}
                </Button>
              </form>
            </div>
          ) : (
            <p className="text-center text-sm" style={{ color: 'var(--ep-muted)' }}>
              Choose a role above and press Apply to open the application form.
            </p>
          )}
        </div>
      </div>
      )}
    </div>
  )
}
