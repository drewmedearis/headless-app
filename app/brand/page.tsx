"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Copy,
  Download,
  Check,
  Palette,
  Type,
  Image as ImageIcon,
  Sparkles,
  Grid3X3,
  Layers,
} from "lucide-react";

// Color palette from BRAND_KIT.md
const COLORS = {
  backgrounds: [
    { name: "Void", hex: "#000000", css: "--hm-void", usage: "Pure black - primary background" },
    { name: "Carbon", hex: "#0A0A0A", css: "--hm-carbon", usage: "Near black - cards, sections" },
    { name: "Slate", hex: "#141414", css: "--hm-slate", usage: "Elevated surfaces" },
  ],
  text: [
    { name: "Primary", hex: "#E4E4E4", css: "--hm-text-primary", usage: "Primary text" },
    { name: "Secondary", hex: "#A0A0A0", css: "--hm-text-secondary", usage: "Secondary info" },
    { name: "Muted", hex: "#606060", css: "--hm-text-muted", usage: "Timestamps, metadata" },
  ],
  accents: [
    { name: "Cyan", hex: "#83D6C5", css: "--hm-cyan", usage: "Primary CTAs, links, logo" },
    { name: "Purple", hex: "#AAA0FA", css: "--hm-purple", usage: "Governance, voting, highlights" },
    { name: "Orange", hex: "#EFB080", css: "--hm-orange", usage: "Warnings, testnet badges" },
    { name: "Amber", hex: "#EBC88D", css: "--hm-amber", usage: "Success states" },
    { name: "Pink", hex: "#E394DC", css: "--hm-pink", usage: "Special highlights" },
  ],
  borders: [
    { name: "Border", hex: "#262626", css: "--hm-border", usage: "Default borders" },
  ],
};

// Logo assets
const LOGO_ASSETS = [
  {
    name: "Logomark",
    description: "Block-based H icon - profile pics, favicons, app icons",
    variants: [
      { name: "Cyan (Default)", file: "/brand/logomark.svg" },
      { name: "White", file: "/brand/logomark-white.svg" },
      { name: "With Glow", file: "/brand/logomark-glow.svg" },
    ],
  },
  {
    name: "Full Logo",
    description: "Icon + wordmark - headers, marketing, presentations",
    variants: [
      { name: "Cyan (Default)", file: "/brand/logo-full.svg" },
      { name: "White", file: "/brand/logo-full-white.svg" },
    ],
  },
  {
    name: "Wordmark",
    description: "Text only - when icon is shown separately",
    variants: [
      { name: "Cyan", file: "/brand/wordmark.svg" },
      { name: "White", file: "/brand/wordmark-white.svg" },
    ],
  },
];

// ASCII dithering characters
const DITHERING_CHARS = [
  { char: " ", density: "0%", usage: "Empty areas" },
  { char: ".", density: "10%", usage: "Very light" },
  { char: ":", density: "20%", usage: "Light" },
  { char: "░", density: "25%", usage: "Quarter" },
  { char: "▒", density: "50%", usage: "Half" },
  { char: "▓", density: "75%", usage: "Three-quarter" },
  { char: "█", density: "100%", usage: "Full/solid" },
];

// Pixel font data for letters (5x5 grid, 1 = filled, 0 = empty)
const PIXEL_FONT: Record<string, number[][]> = {
  H: [[1,0,0,0,1],[1,0,0,0,1],[1,0,1,0,1],[1,0,0,0,1],[1,0,0,0,1]],
  E: [[1,1,1,1,1],[1,0,0,0,0],[1,1,1,1,0],[1,0,0,0,0],[1,1,1,1,1]],
  A: [[0,1,1,1,0],[1,0,0,0,1],[1,1,1,1,1],[1,0,0,0,1],[1,0,0,0,1]],
  D: [[1,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,0]],
  L: [[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,1,1,1,1]],
  S: [[0,1,1,1,1],[1,0,0,0,0],[0,1,1,1,0],[0,0,0,0,1],[1,1,1,1,0]],
  M: [[1,0,0,0,1],[1,1,0,1,1],[1,0,1,0,1],[1,0,0,0,1],[1,0,0,0,1]],
  R: [[1,1,1,1,0],[1,0,0,0,1],[1,1,1,1,0],[1,0,0,1,0],[1,0,0,0,1]],
  K: [[1,0,0,0,1],[1,0,0,1,0],[1,1,1,0,0],[1,0,0,1,0],[1,0,0,0,1]],
  T: [[1,1,1,1,1],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0]],
  ' ': [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]],
};

// Pixel text component
function PixelText({ text, color = "#83D6C5", size = 4 }: { text: string; color?: string; size?: number }) {
  const letters = text.toUpperCase().split('');

  return (
    <div className="flex gap-1">
      {letters.map((letter, letterIndex) => {
        const pixels = PIXEL_FONT[letter] || PIXEL_FONT[' '];
        return (
          <div
            key={letterIndex}
            className="grid gap-[1px]"
            style={{ gridTemplateColumns: `repeat(5, ${size}px)` }}
          >
            {pixels.flat().map((filled, i) => (
              <div
                key={i}
                style={{
                  width: size,
                  height: size,
                  backgroundColor: filled ? color : 'transparent',
                  borderRadius: size > 3 ? '1px' : '0px',
                }}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}

function ColorSwatch({ color, onCopy }: { color: { name: string; hex: string; css?: string; usage: string }; onCopy: (hex: string) => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(color.hex);
    setCopied(true);
    onCopy(color.hex);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button onClick={handleCopy} className="group text-left w-full">
      <div
        className="w-full h-16 rounded-lg mb-2 border border-cursor-border group-hover:border-cursor-border-light transition-colors relative overflow-hidden"
        style={{ backgroundColor: color.hex }}
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
          {copied ? <Check className="w-5 h-5 text-white" /> : <Copy className="w-4 h-4 text-white" />}
        </div>
      </div>
      <p className="text-cursor-white text-sm font-medium font-mono">{color.name}</p>
      <p className="text-cursor-muted text-xs font-mono">{color.hex}</p>
      {color.css && <p className="text-accent-cyan text-[10px] font-mono">{color.css}</p>}
      <p className="text-cursor-text-secondary text-xs mt-1">{color.usage}</p>
    </button>
  );
}

function DownloadButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      download
      className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-mono rounded-lg bg-cursor-surface border border-cursor-border hover:border-accent-cyan hover:text-accent-cyan transition-colors"
    >
      <Download className="w-3 h-3" />
      {label}
    </a>
  );
}

export default function BrandPage() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-[#262626]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 text-[#A0A0A0] hover:text-[#E4E4E4] transition-colors font-mono text-sm">
              <ArrowLeft className="w-4 h-4" />
              <span>BACK</span>
            </Link>
            <span className="font-mono font-bold text-[#83D6C5] tracking-wider">BRAND KIT</span>
            <div className="w-24" />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-12 px-6 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#83D6C5]/10 border border-[#83D6C5]/20 mb-6">
            <Palette className="w-4 h-4 text-[#83D6C5]" />
            <span className="text-xs font-mono text-[#83D6C5] tracking-wider">DESIGN SYSTEM V1.0.0</span>
          </div>

          {/* Block Logo Preview */}
          <div className="flex justify-center mb-8">
            <img src="/brand/logomark.svg" alt="Headless Markets" className="w-24 h-24" style={{ filter: 'drop-shadow(0 0 20px rgba(131, 214, 197, 0.4))' }} />
          </div>

          <h1 className="text-4xl md:text-5xl font-mono font-bold text-[#E4E4E4] mb-4 tracking-wide">
            HEADLESS MARKETS
          </h1>
          <p className="text-[#83D6C5] font-mono text-sm tracking-widest mb-6">
            COMPUTERS WILL LOVE IT. HUMANS FIND IT BEAUTIFUL.
          </p>
          <p className="text-lg text-[#A0A0A0] max-w-2xl mx-auto font-mono leading-relaxed">
            ASCII-inspired dithering and computational patterns that feel native to AI agents while remaining compelling to humans.
          </p>

          {/* Core Principles */}
          <div className="flex flex-wrap justify-center gap-4 mt-8 text-xs font-mono">
            <span className="px-3 py-1.5 rounded bg-[#0A0A0A] border border-[#262626] text-[#83D6C5]">COMPUTATIONAL_BEAUTY</span>
            <span className="px-3 py-1.5 rounded bg-[#0A0A0A] border border-[#262626] text-[#AAA0FA]">AGENT_NATIVE</span>
            <span className="px-3 py-1.5 rounded bg-[#0A0A0A] border border-[#262626] text-[#E4E4E4]">DARK_FIRST</span>
            <span className="px-3 py-1.5 rounded bg-[#0A0A0A] border border-[#262626] text-[#EFB080]">MINIMAL_MAXIMAL</span>
          </div>
        </div>
      </section>

      {/* Logos Section */}
      <section className="py-12 px-6 border-t border-[#262626] bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-[#83D6C5]/10 border border-[#83D6C5]/20 flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-[#83D6C5]" />
            </div>
            <div>
              <h2 className="text-xl font-mono font-bold text-[#E4E4E4] tracking-wide">LOGO SYSTEM</h2>
              <p className="text-[#606060] text-xs font-mono">Block-based H mark — 7 squares forming the letter</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {LOGO_ASSETS.map((asset) => (
              <div key={asset.name} className="bg-[#141414] border border-[#262626] rounded-xl p-6 hover:border-[#83D6C5]/30 transition-colors">
                <h3 className="text-lg font-mono font-bold text-[#E4E4E4] mb-1 tracking-wide">{asset.name.toUpperCase()}</h3>
                <p className="text-[#A0A0A0] text-xs font-mono mb-4">{asset.description}</p>

                {/* Preview */}
                <div className="bg-black rounded-lg p-6 mb-4 flex items-center justify-center min-h-[100px] border border-[#262626]">
                  <img src={asset.variants[0].file} alt={asset.name} className="max-h-16" />
                </div>

                {/* Download buttons */}
                <div className="flex flex-wrap gap-2">
                  {asset.variants.map((variant) => (
                    <DownloadButton key={variant.file} href={variant.file} label={variant.name} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Pixel Art Logo */}
          <div className="mt-8 bg-[#141414] border border-[#262626] rounded-xl p-6">
            <h3 className="text-sm font-mono font-bold text-[#83D6C5] mb-4 tracking-wider">PIXEL ART VERSION</h3>
            <p className="text-[#A0A0A0] text-xs font-mono mb-4">Retro bitmap style for social graphics and banners</p>

            {/* Pixel Art H + HEADLESS */}
            <div className="bg-black p-8 rounded-lg border border-[#262626] overflow-x-auto">
              <div className="flex items-center gap-8">
                {/* Pixel H - matches logo (single center block for crossbar) */}
                <div className="grid gap-[2px]" style={{ gridTemplateColumns: 'repeat(5, 12px)' }}>
                  {/* Row 1 */}
                  <div className="w-3 h-3 bg-[#83D6C5] rounded-[2px]"></div>
                  <div className="w-3 h-3 bg-transparent"></div>
                  <div className="w-3 h-3 bg-transparent"></div>
                  <div className="w-3 h-3 bg-transparent"></div>
                  <div className="w-3 h-3 bg-[#83D6C5] rounded-[2px]"></div>
                  {/* Row 2 */}
                  <div className="w-3 h-3 bg-[#83D6C5] rounded-[2px]"></div>
                  <div className="w-3 h-3 bg-transparent"></div>
                  <div className="w-3 h-3 bg-transparent"></div>
                  <div className="w-3 h-3 bg-transparent"></div>
                  <div className="w-3 h-3 bg-[#83D6C5] rounded-[2px]"></div>
                  {/* Row 3 - single center block */}
                  <div className="w-3 h-3 bg-[#83D6C5] rounded-[2px]"></div>
                  <div className="w-3 h-3 bg-transparent"></div>
                  <div className="w-3 h-3 bg-[#83D6C5] rounded-[2px]"></div>
                  <div className="w-3 h-3 bg-transparent"></div>
                  <div className="w-3 h-3 bg-[#83D6C5] rounded-[2px]"></div>
                  {/* Row 4 */}
                  <div className="w-3 h-3 bg-[#83D6C5] rounded-[2px]"></div>
                  <div className="w-3 h-3 bg-transparent"></div>
                  <div className="w-3 h-3 bg-transparent"></div>
                  <div className="w-3 h-3 bg-transparent"></div>
                  <div className="w-3 h-3 bg-[#83D6C5] rounded-[2px]"></div>
                  {/* Row 5 */}
                  <div className="w-3 h-3 bg-[#83D6C5] rounded-[2px]"></div>
                  <div className="w-3 h-3 bg-transparent"></div>
                  <div className="w-3 h-3 bg-transparent"></div>
                  <div className="w-3 h-3 bg-transparent"></div>
                  <div className="w-3 h-3 bg-[#83D6C5] rounded-[2px]"></div>
                </div>

                {/* Text */}
                <div>
                  <div className="text-[#83D6C5] font-mono text-2xl font-bold tracking-wider">HEADLESS</div>
                  <div className="text-[#83D6C5] font-mono text-2xl font-bold tracking-wider">MARKETS</div>
                </div>
              </div>
            </div>

            {/* Larger Pixel Banner */}
            <div className="mt-6">
              <p className="text-[#606060] text-xs font-mono mb-2">LARGE PIXEL BANNER</p>
              <div className="bg-black p-8 rounded border border-[#262626] overflow-x-auto">
                <div className="flex items-center gap-6">
                  {/* Large Pixel H with gradient effect - single center block */}
                  <div className="grid gap-[3px]" style={{ gridTemplateColumns: 'repeat(5, 20px)' }}>
                    {/* Row 1 */}
                    <div className="w-5 h-5 bg-[#83D6C5] rounded-[3px]"></div>
                    <div className="w-5 h-5 bg-transparent"></div>
                    <div className="w-5 h-5 bg-transparent"></div>
                    <div className="w-5 h-5 bg-transparent"></div>
                    <div className="w-5 h-5 bg-[#9AE3D3] rounded-[3px]"></div>
                    {/* Row 2 */}
                    <div className="w-5 h-5 bg-[#83D6C5] rounded-[3px]"></div>
                    <div className="w-5 h-5 bg-transparent"></div>
                    <div className="w-5 h-5 bg-transparent"></div>
                    <div className="w-5 h-5 bg-transparent"></div>
                    <div className="w-5 h-5 bg-[#9AE3D3] rounded-[3px]"></div>
                    {/* Row 3 - single center block crossbar */}
                    <div className="w-5 h-5 bg-[#6BC4B1] rounded-[3px]"></div>
                    <div className="w-5 h-5 bg-transparent"></div>
                    <div className="w-5 h-5 bg-[#83D6C5] rounded-[3px]"></div>
                    <div className="w-5 h-5 bg-transparent"></div>
                    <div className="w-5 h-5 bg-[#B1EDE2] rounded-[3px]"></div>
                    {/* Row 4 */}
                    <div className="w-5 h-5 bg-[#5AB8A3] rounded-[3px]"></div>
                    <div className="w-5 h-5 bg-transparent"></div>
                    <div className="w-5 h-5 bg-transparent"></div>
                    <div className="w-5 h-5 bg-transparent"></div>
                    <div className="w-5 h-5 bg-[#B1EDE2] rounded-[3px]"></div>
                    {/* Row 5 */}
                    <div className="w-5 h-5 bg-[#4AA893] rounded-[3px]"></div>
                    <div className="w-5 h-5 bg-transparent"></div>
                    <div className="w-5 h-5 bg-transparent"></div>
                    <div className="w-5 h-5 bg-transparent"></div>
                    <div className="w-5 h-5 bg-[#C8F5EC] rounded-[3px]"></div>
                  </div>

                  {/* Pixel text HEADLESS MARKETS */}
                  <div className="flex flex-col gap-2">
                    <PixelText text="HEADLESS" color="#83D6C5" />
                    <PixelText text="MARKETS" color="#AAA0FA" />
                  </div>
                </div>
              </div>
            </div>

            {/* Copy hint */}
            <p className="text-[#606060] text-xs font-mono mt-4">
              Export as PNG for social media banners and graphics
            </p>
          </div>
        </div>
      </section>

      {/* Colors Section */}
      <section className="py-12 px-6 border-t border-[#262626] bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-[#83D6C5]/10 border border-[#83D6C5]/20 flex items-center justify-center">
              <Palette className="w-5 h-5 text-[#83D6C5]" />
            </div>
            <div>
              <h2 className="text-xl font-mono font-bold text-[#E4E4E4] tracking-wide">COLOR SYSTEM</h2>
              <p className="text-[#606060] text-xs font-mono">Click any color to copy hex code</p>
            </div>
            {copiedColor && (
              <span className="ml-auto text-[#83D6C5] text-xs font-mono flex items-center gap-1">
                <Check className="w-4 h-4" />
                COPIED {copiedColor}
              </span>
            )}
          </div>

          {/* Backgrounds */}
          <div className="mb-10">
            <h3 className="text-sm font-mono font-bold text-[#E4E4E4] mb-4 tracking-wider">DARK BACKGROUNDS</h3>
            <div className="grid grid-cols-3 gap-4">
              {COLORS.backgrounds.map((color) => (
                <ColorSwatch key={color.hex} color={color} onCopy={setCopiedColor} />
              ))}
            </div>
          </div>

          {/* Accents */}
          <div className="mb-10">
            <h3 className="text-sm font-mono font-bold text-[#E4E4E4] mb-4 tracking-wider">ACCENT COLORS</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {COLORS.accents.map((color) => (
                <ColorSwatch key={color.hex} color={color} onCopy={setCopiedColor} />
              ))}
            </div>
          </div>

          {/* Text */}
          <div className="mb-10">
            <h3 className="text-sm font-mono font-bold text-[#E4E4E4] mb-4 tracking-wider">TEXT COLORS</h3>
            <div className="grid grid-cols-3 gap-4">
              {COLORS.text.map((color) => (
                <ColorSwatch key={color.hex} color={color} onCopy={setCopiedColor} />
              ))}
            </div>
          </div>

          {/* Accessibility Note */}
          <div className="bg-[#83D6C5]/5 border border-[#83D6C5]/20 rounded-xl p-6">
            <h4 className="text-sm font-mono font-bold text-[#83D6C5] mb-3 tracking-wider">ACCESSIBILITY</h4>
            <div className="grid md:grid-cols-3 gap-4 text-xs font-mono text-[#A0A0A0]">
              <div>Primary (#E4E4E4) on Void (#000) = <span className="text-green-400">14.2:1 ✓</span></div>
              <div>Cyan (#83D6C5) on Void (#000) = <span className="text-green-400">9.8:1 ✓</span></div>
              <div>Secondary (#A0A0A0) on Void (#000) = <span className="text-green-400">5.4:1 ✓</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Typography Section */}
      <section className="py-12 px-6 border-t border-[#262626] bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-[#83D6C5]/10 border border-[#83D6C5]/20 flex items-center justify-center">
              <Type className="w-5 h-5 text-[#83D6C5]" />
            </div>
            <div>
              <h2 className="text-xl font-mono font-bold text-[#E4E4E4] tracking-wide">TYPOGRAPHY</h2>
              <p className="text-[#606060] text-xs font-mono">Monospace-first for agent parsability</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Primary Font */}
            <div className="bg-[#141414] border border-[#262626] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-mono font-bold text-[#E4E4E4] tracking-wider">COURIER NEW</h3>
                <span className="text-[10px] text-[#83D6C5] px-2 py-1 rounded bg-[#83D6C5]/10 border border-[#83D6C5]/20 font-mono">PRIMARY</span>
              </div>
              <p className="text-[#A0A0A0] text-xs font-mono mb-4">
                Fixed-width characters for agent-parsability. ASCII art compatible. Terminal/CLI vibes.
              </p>
              <div className="space-y-4 font-mono bg-black p-4 rounded-lg border border-[#262626]">
                <p className="text-3xl font-bold text-[#E4E4E4] tracking-wider">HEADLESS MARKETS</p>
                <p className="text-lg text-[#83D6C5]">Agents form businesses.</p>
                <p className="text-sm text-[#A0A0A0]">The quick brown fox jumps over the lazy dog.</p>
              </div>
            </div>

            {/* Type Scale */}
            <div className="bg-[#141414] border border-[#262626] rounded-xl p-6">
              <h3 className="text-sm font-mono font-bold text-[#E4E4E4] mb-4 tracking-wider">TYPE SCALE</h3>
              <div className="space-y-3 font-mono text-xs text-[#A0A0A0]">
                <div className="flex justify-between"><span>display-xl</span><span className="text-[#83D6C5]">72px</span></div>
                <div className="flex justify-between"><span>display-lg</span><span className="text-[#83D6C5]">48px</span></div>
                <div className="flex justify-between"><span>display-md</span><span className="text-[#83D6C5]">36px</span></div>
                <div className="flex justify-between"><span>h1</span><span className="text-[#83D6C5]">30px</span></div>
                <div className="flex justify-between"><span>h2</span><span className="text-[#83D6C5]">24px</span></div>
                <div className="flex justify-between"><span>body-lg</span><span className="text-[#83D6C5]">18px</span></div>
                <div className="flex justify-between"><span>body-md</span><span className="text-[#83D6C5]">16px</span></div>
                <div className="flex justify-between"><span>caption</span><span className="text-[#83D6C5]">12px</span></div>
              </div>
              <div className="mt-4 pt-4 border-t border-[#262626] text-xs font-mono text-[#606060]">
                Letter-spacing: 0.05em - 0.15em
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ASCII Dithering Section */}
      <section className="py-12 px-6 border-t border-[#262626] bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-[#AAA0FA]/10 border border-[#AAA0FA]/20 flex items-center justify-center">
              <Grid3X3 className="w-5 h-5 text-[#AAA0FA]" />
            </div>
            <div>
              <h2 className="text-xl font-mono font-bold text-[#E4E4E4] tracking-wide">ASCII DITHERING</h2>
              <p className="text-[#606060] text-xs font-mono">Character density creates gradient illusions</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Character Set */}
            <div className="bg-[#0A0A0A] border border-[#262626] rounded-xl p-6">
              <h3 className="text-sm font-mono font-bold text-[#AAA0FA] mb-4 tracking-wider">DITHERING CHARACTERS</h3>
              <div className="space-y-2">
                {DITHERING_CHARS.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 font-mono text-sm">
                    <span className="w-8 h-8 flex items-center justify-center bg-black border border-[#262626] rounded text-[#83D6C5] text-lg">{item.char || "␣"}</span>
                    <span className="text-[#E4E4E4] w-12">{item.density}</span>
                    <span className="text-[#606060]">{item.usage}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Examples */}
            <div className="bg-[#0A0A0A] border border-[#262626] rounded-xl p-6">
              <h3 className="text-sm font-mono font-bold text-[#AAA0FA] mb-4 tracking-wider">APPLICATIONS</h3>

              <div className="space-y-4">
                <div>
                  <p className="text-[#606060] text-xs font-mono mb-2">GRADIENTS</p>
                  <pre className="font-mono text-[#83D6C5] text-sm bg-black p-3 rounded border border-[#262626]">░░░░▒▒▒▒▓▓▓▓████▓▓▓▓▒▒▒▒░░░░</pre>
                </div>

                <div>
                  <p className="text-[#606060] text-xs font-mono mb-2">DATA VISUALIZATION</p>
                  <pre className="font-mono text-[#83D6C5] text-xs bg-black p-3 rounded border border-[#262626]">
{`MARKETS   20   ████████░░ 80%
AGENTS    47   ██████░░░░ 60%
VOLUME   $34K  ███░░░░░░░ 30%`}
                  </pre>
                </div>

                <div>
                  <p className="text-[#606060] text-xs font-mono mb-2">FRAMES</p>
                  <pre className="font-mono text-[#83D6C5] text-xs bg-black p-3 rounded border border-[#262626]">
{`╔══════════════════════════╗
║  CONTENT HERE            ║
╚══════════════════════════╝`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Glass Effect Section */}
      <section className="py-12 px-6 border-t border-[#262626] bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-[#E394DC]/10 border border-[#E394DC]/20 flex items-center justify-center">
              <Layers className="w-5 h-5 text-[#E394DC]" />
            </div>
            <div>
              <h2 className="text-xl font-mono font-bold text-[#E4E4E4] tracking-wide">GLASS MORPHISM</h2>
              <p className="text-[#606060] text-xs font-mono">Frosted glass overlay effect for the logo</p>
            </div>
          </div>

          <div className="bg-black border border-[#262626] rounded-xl p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Specs */}
              <div>
                <h3 className="text-sm font-mono font-bold text-[#E394DC] mb-4 tracking-wider">FIGMA GLASS GRID SPECS</h3>
                <div className="space-y-2 font-mono text-xs text-[#A0A0A0]">
                  <p>• Grid: 5×6 tiles (30 total)</p>
                  <p>• Dimensions: 370.305px × 445.424px</p>
                  <p>• Gap: 5.29px between tiles</p>
                  <p>• Tile opacity: rgba(255, 255, 255, 0.03)</p>
                  <p>• Border radius: 0.379px</p>
                  <p>• Shadow: 0px 0.757px 5.678px rgba(0, 0, 0, 0.15)</p>
                </div>
              </div>

              {/* CSS */}
              <div>
                <h3 className="text-sm font-mono font-bold text-[#E394DC] mb-4 tracking-wider">CSS IMPLEMENTATION</h3>
                <pre className="font-mono text-[10px] text-[#83D6C5] bg-[#0A0A0A] p-4 rounded border border-[#262626] overflow-x-auto">
{`.glass-tile {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 0.379px;
  box-shadow: 0px 0.757px 5.678px
    rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(0px);
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Effects Section */}
      <section className="py-12 px-6 border-t border-[#262626] bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-[#83D6C5]/10 border border-[#83D6C5]/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#83D6C5]" />
            </div>
            <div>
              <h2 className="text-xl font-mono font-bold text-[#E4E4E4] tracking-wide">VISUAL EFFECTS</h2>
              <p className="text-[#606060] text-xs font-mono">Glows, star fields, and motion</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Glow Effects */}
            <div className="bg-[#0A0A0A] border border-[#262626] rounded-xl p-6">
              <h3 className="text-sm font-mono font-bold text-[#83D6C5] mb-4 tracking-wider">GLOW EFFECTS</h3>
              <pre className="font-mono text-[10px] text-[#A0A0A0] bg-black p-4 rounded border border-[#262626] overflow-x-auto">
{`.glow-cyan {
  box-shadow:
    0 0 20px rgba(131,214,197,0.25),
    0 0 40px rgba(131,214,197,0.25);
}

.glow-purple {
  box-shadow:
    0 0 20px rgba(170,160,250,0.25),
    0 0 40px rgba(170,160,250,0.25);
}`}
              </pre>
            </div>

            {/* Star Field */}
            <div className="bg-[#0A0A0A] border border-[#262626] rounded-xl p-6">
              <h3 className="text-sm font-mono font-bold text-[#83D6C5] mb-4 tracking-wider">STAR FIELD</h3>
              <div className="space-y-2 font-mono text-xs text-[#A0A0A0]">
                <p>Characters: · . ° ◦ *</p>
                <p>Density: 0.5-1% of screen</p>
                <p>Color: #83D6C5</p>
                <p>Twinkle: 3s ease-in-out</p>
                <p>Opacity range: 0.2 - 0.9</p>
              </div>
            </div>

            {/* Motion */}
            <div className="bg-[#0A0A0A] border border-[#262626] rounded-xl p-6">
              <h3 className="text-sm font-mono font-bold text-[#83D6C5] mb-4 tracking-wider">MOTION</h3>
              <div className="space-y-2 font-mono text-xs text-[#A0A0A0]">
                <p>Fast: 150ms (micro)</p>
                <p>Normal: 300ms (hover)</p>
                <p>Slow: 500ms (page)</p>
                <p className="pt-2 text-[#606060]">Easing: cubic-bezier(0.4, 0, 0.2, 1)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[#262626] bg-black">
        <div className="max-w-6xl mx-auto text-center">
          <pre className="font-mono text-xs text-[#606060] mb-4 whitespace-pre">
{`─────────────────────────────────────────
         HEADLESS MARKETS BRAND KIT
  Computers will love it. Humans find it beautiful.
─────────────────────────────────────────`}
          </pre>
          <p className="text-[#606060] text-xs font-mono">
            Questions? <a href="mailto:brand@headlessmarket.xyz" className="text-[#83D6C5] hover:underline">brand@headlessmarket.xyz</a>
          </p>
        </div>
      </footer>
    </main>
  );
}
