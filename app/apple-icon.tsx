import { ImageResponse } from 'next/og';

export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '40px',
          background: 'linear-gradient(135deg, #83D6C5 0%, rgba(131, 214, 197, 0.8) 100%)',
        }}
      >
        <span
          style={{
            fontSize: '110px',
            fontWeight: 700,
            color: '#000000',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          H
        </span>
      </div>
    ),
    {
      ...size,
    }
  );
}
