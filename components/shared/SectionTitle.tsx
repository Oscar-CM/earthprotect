interface SectionTitleProps {
  title: string
  subtitle?: string
  centered?: boolean
  accent?: string
}

export function SectionTitle({ title, subtitle, centered = false, accent }: SectionTitleProps) {
  return (
    <div className={`mb-10 ${centered ? 'text-center' : ''}`}>
      {accent && (
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-2"
          style={{ color: 'var(--ep-primary)' }}
        >
          {accent}
        </p>
      )}
      <h2
        className="text-3xl md:text-4xl font-bold leading-tight mb-3"
        style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="text-base md:text-lg leading-relaxed max-w-2xl"
          style={{
            color: 'var(--ep-muted)',
            marginLeft: centered ? 'auto' : undefined,
            marginRight: centered ? 'auto' : undefined,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
