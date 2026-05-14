import { ImageResponse } from 'next/og'
import CONFIG from 'constants/config'
import { theme } from 'constants/theme'

type OgImageOptions = {
  title: string
  description?: string
  eyebrow?: string
}

export const ogImageSize = {
  width: 1200,
  height: 630,
}

export const ogImageContentType = 'image/png'

export const createOgImage = ({ title, description, eyebrow }: OgImageOptions) => {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          padding: '56px',
          background: `linear-gradient(135deg, ${theme.background} 0%, #14161d 100%)`,
          color: theme.foreground,
          fontFamily: 'Geist, Geist Sans, Arial, sans-serif',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: '32px',
            border: `1px solid ${theme.border}`,
            borderRadius: '32px',
            opacity: 0.65,
          }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
            borderRadius: '28px',
            border: `2px solid ${theme.border}`,
            background: 'rgba(16, 18, 24, 0.78)',
            padding: '40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '24px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                fontSize: 18,
                color: theme.accent,
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 9999,
                  background: theme.primary,
                  display: 'flex',
                }}
              />
              <div style={{ display: 'flex' }}>{eyebrow || 'xuco.me'}</div>
            </div>
            <div style={{ display: 'flex', fontSize: 18, color: theme.accent }}>
              {CONFIG.WEB_AUTHOR}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div
              style={{
                display: 'flex',
                fontSize: 64,
                lineHeight: 1.08,
                fontWeight: 700,
                letterSpacing: '-0.04em',
                whiteSpace: 'pre-wrap',
              }}
            >
              {title}
            </div>
            {description ? (
              <div
                style={{
                  display: 'flex',
                  maxWidth: '88%',
                  fontSize: 32,
                  lineHeight: 1.45,
                  color: theme.accent,
                }}
              >
                {description}
              </div>
            ) : null}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '24px',
              fontSize: 24,
              color: theme.accent,
            }}
          >
            <div style={{ display: 'flex', color: theme.success }}>
              {CONFIG.SITE_URL.replace(/^https?:\/\//, '')}
            </div>
          </div>
        </div>
      </div>
    ),
    ogImageSize
  )
}
