import React from "react"
import Layout from "@/components/Layout"
// import Image from 'next/image'; // Uncomment if using next/image

export default function HelpCenter() {
  return (
    <Layout title="Help Center">
      <div className="flex flex-col items-center">
        {/* HERO SECTION */}
        <section className="w-full max-w-4xl text-center py-24 px-4">
          <div className="w-full h-48 bg-[#1C0F0A]/80 rounded-2xl mb-8 flex items-center justify-center text-yellow-400 text-3xl font-bold shadow-lg border border-[#FFF8F0]/10">
            [Signal Interference… Loading Support]
          </div>
          <h1 className="text-5xl font-extrabold   hover-glow mb-4">
            Help Center
          </h1>
          <p className="text-lg text-[#FFF8F0]/80 mb-6 max-w-2xl mx-auto">
            Got a glitch? We’re here to clear the signal. Browse our FAQs or
            reach out directly.
          </p>
        </section>

        {/* FAQ SECTION */}
        <section className="w-full max-w-3xl py-14 px-4">
          <h2 className="text-3xl font-bold mb-10 text-yellow-400 hover-glow text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {/* FAQ Item 1 */}
            <div className="bg-[#1C0F0A] border border-[#FFF8F0]/10 rounded-xl shadow p-6">
              <h3 className="font-semibold text-lg text-yellow-400 hover-glow mb-2">
                🔑 How do I create an account?
              </h3>
              <p className="text-[#FFF8F0]/80">
                Click the <strong>Sign Up</strong> button in the top bar. A few
                steps and you're in.
              </p>
            </div>

            {/* FAQ Item 2 */}
            <div className="bg-[#1C0F0A] border border-[#FFF8F0]/10 rounded-xl shadow p-6">
              <h3 className="font-semibold text-lg text-yellow-400 hover-glow mb-2">
                🔒 How do I reset my password?
              </h3>
              <p className="text-[#FFF8F0]/80">
                On the login page, click <strong>Forgot Password?</strong> and
                follow the link we send you.
              </p>
            </div>

            {/* FAQ Item 3 */}
            <div className="bg-[#1C0F0A] border border-[#FFF8F0]/10 rounded-xl shadow p-6">
              <h3 className="font-semibold text-lg text-yellow-400 hover-glow mb-2">
                💬 Where can I get support?
              </h3>
              <p className="text-[#FFF8F0]/80">
                Reach us at{" "}
                <a
                  href="mailto:support@echoshock.com"
                  className="underline text-yellow-300 hover:text-yellow-400"
                >
                  support@echoshock.com
                </a>{" "}
                or use the chat widget in the bottom-right corner.
              </p>
            </div>
          </div>
        </section>

        {/* CONTACT / CTA */}
        <section className="w-full max-w-2xl text-center py-20 px-4">
          <h3 className="text-3xl font-bold mb-4 text-yellow-400 hover-glow">
            Still need help?
          </h3>
          <p className="text-[#FFF8F0]/80 mb-6">
            We’re always here for you. If your question isn’t covered above,
            don’t hesitate to reach out.
          </p>
          <a
            href="mailto:support@echoshock.com"
            className="inline-block bg-yellow-900 border border-[#FFF8F0]/30   hover:bg-[#FFF8F0]/10 hover-glow font-semibold py-3 px-8 rounded-full shadow transition text-2xl"
          >
            Contact Support
          </a>
        </section>
      </div>
    </Layout>
  )
}
