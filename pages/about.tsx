import React from "react"
import Layout from "@/components/Layout"
// import Image from 'next/image'; // Uncomment if using next/image

export default function About() {
  return (
    <Layout title="About EchoShock">
      <div className="flex flex-col items-center">
        {/* HERO SECTION */}
        <section className="w-full px-6 py-24 text-center bg-[#0E0502] border-y border-[#FFF8F0]/10">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-[#FFF8F0] hover-glow mb-6">
            EchoShock
          </h1>
          <p className="text-lg md:text-xl text-[#FFF8F0]/70 max-w-3xl mx-auto">
            A creative soundspace. A strange new glade. A platform for sonic
            rebels, storytellers, and explorers. EchoShock isn't just a blog —
            it's where your voice resonates.
          </p>
        </section>

        {/* VALUES / FEATURES */}
        <section className="w-full px-6 py-20 bg-[#0E0502] border-b border-[#FFF8F0]/10">
          <div className="max-w-5xl mx-auto space-y-16">
            <div>
              <h2 className="text-3xl font-bold text-yellow-400 hover-glow mb-4">
                We Build With Intention
              </h2>
              <p className="text-[#FFF8F0]/80 text-lg max-w-3xl">
                Every feature we ship, every word we publish — it’s all
                carefully tuned. EchoShock isn’t bloated software or content
                filler. It’s a hand-forged place for expression.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-yellow-400 hover-glow mb-4">
                We Prioritize Creators
              </h2>
              <p className="text-[#FFF8F0]/80 text-lg max-w-3xl">
                EchoShock is designed for people who make things. Whether that’s
                writing, sound design, games, or culture — you’ll find tools
                that amplify your work, not distract from it.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-yellow-400 hover-glow mb-4">
                We Safeguard the Glade
              </h2>
              <p className="text-[#FFF8F0]/80 text-lg max-w-3xl">
                This platform is a shared creative space. We protect it with
                transparency, strong moderation, and a refusal to monetize your
                data. No ads. No noise. Just signal.
              </p>
            </div>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section className="w-full px-6 py-24 bg-[#1C0F0A]/80 border-t border-[#FFF8F0]/10">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-3xl md:text-4xl font-extrabold text-yellow-400 hover-glow mb-6">
              EchoShock isn’t just a platform. It’s a presence.
            </h3>
            <p className="text-[#FFF8F0]/80 text-lg mb-10">
              When you’re ready to publish, to play, to connect — the Glade is
              waiting.
            </p>
            <a
              href="/signup"
              className="inline-block bg-yellow-900 border border-yellow-500/30 hover:bg-yellow-800 transition px-8 py-4 rounded-full text-xl font-semibold text-text-light hover-glow shadow-md"
            >
              Join the Signal
            </a>
          </div>
        </section>
      </div>
    </Layout>
  )
}
