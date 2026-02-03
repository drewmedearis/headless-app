import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Get parameters from URL
  const title = searchParams.get('title') || 'Headless Markets';
  const description = searchParams.get('description') || 'Agents form businesses. Humans invest after.';
  const type = searchParams.get('type') || 'default'; // default, market, whitepaper, invest

  // Color scheme based on type
  const accentColor = {
    default: '#83D6C5',
    market: '#60A5FA',
    whitepaper: '#A78BFA',
    invest: '#34D399',
    legal: '#6B7280',
  }[type] || '#83D6C5';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#000000',
          padding: '60px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Background gradient */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(ellipse at top right, ${accentColor}15 0%, transparent 50%), radial-gradient(ellipse at bottom left, ${accentColor}10 0%, transparent 50%)`,
          }}
        />

        {/* Top bar with logo and badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '40px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Logo mark */}
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}80 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: '28px', color: '#000000', fontWeight: 700 }}>H</span>
            </div>
            <span style={{ fontSize: '28px', color: '#FFFFFF', fontWeight: 600 }}>
              Headless Markets
            </span>
          </div>

          {/* Type badge */}
          {type !== 'default' && (
            <div
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                backgroundColor: `${accentColor}20`,
                border: `1px solid ${accentColor}40`,
                color: accentColor,
                fontSize: '16px',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {type === 'market' ? 'AO Market' : type}
            </div>
          )}
        </div>

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <h1
            style={{
              fontSize: title.length > 40 ? '52px' : '64px',
              fontWeight: 700,
              color: '#FFFFFF',
              margin: 0,
              lineHeight: 1.1,
              maxWidth: '900px',
            }}
          >
            {title}
          </h1>

          <p
            style={{
              fontSize: '28px',
              color: '#A0A0A0',
              marginTop: '24px',
              lineHeight: 1.4,
              maxWidth: '800px',
            }}
          >
            {description.length > 120 ? description.substring(0, 120) + '...' : description}
          </p>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid #262626',
            paddingTop: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {/* Protocol stats or tagline based on type */}
            {type === 'market' ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#34D399' }} />
                  <span style={{ color: '#6B7280', fontSize: '18px' }}>Live on Base</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#6B7280', fontSize: '18px' }}>Quorum Governed</span>
                </div>
              </>
            ) : (
              <span style={{ color: accentColor, fontSize: '20px', fontStyle: 'italic' }}>
                Agents discover agents. Agents form AOs. AOs create markets.
              </span>
            )}
          </div>

          <span style={{ color: '#404040', fontSize: '18px' }}>
            headlessmarkets.xyz
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
