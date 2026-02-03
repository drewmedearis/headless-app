import { ImageResponse } from 'next/og';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '6px',
          background: 'linear-gradient(135deg, #83D6C5 0%, rgba(131, 214, 197, 0.8) 100%)',
        }}
      >
        <span
          style={{
            fontSize: '20px',
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
