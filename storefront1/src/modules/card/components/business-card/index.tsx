"use client"

import React, { useState, useEffect } from "react"
import { BusinessCardData } from "@lib/data/business-card"

export default function BusinessCard({ card }: { card: BusinessCardData }) {
  const [showModal, setShowModal] = useState<boolean>(false)
  const [modalStep, setModalStep] = useState<"choose" | "email">("choose")
  const [recipientEmail, setRecipientEmail] = useState<string>("")
  const [emailSent, setEmailSent] = useState<boolean>(false)
  const [isScrolled, setIsScrolled] = useState<boolean>(false)

  // Listen to scroll to stick action bar at top smoothly like qrco.de
  useEffect(() => {
    const handleScroll = () => {
      // Once scrolled past the avatar & name (approx 180px), stick the bar
      if (window.scrollY > 180) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!card || !card.is_active) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#222943] p-6 text-white text-center">
        <div className="max-w-md bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20">
          <h1 className="text-xl font-semibold mb-2">Digital Card Unavailable</h1>
          <p className="text-gray-300 text-sm">
            This digital business card is currently inactive or under maintenance.
          </p>
        </div>
      </div>
    )
  }

  // Exact fixed theme colors from qrco.de/bh2StJ
  const primaryBg = "#222943" // Dark Navy Blue
  const accentColor = "#C7A88C" // Dolgins Copper / Gold Accent
  const fullName = `${card.first_name} ${card.last_name}`.trim()
  const cleanPhone = card.phone.replace(/[^\d+]/g, "")
  const cleanWebsite = card.website.replace(/^https?:\/\//, "").replace(/\/$/, "")

  // Address
  const fullAddress = `${card.street}, ${card.city}, ${card.state} ${card.zip}, ${card.country}`
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${card.company} ${fullAddress}`
  )}`

  // Direct VCF Download
  const handleSaveToPhone = () => {
    const link = document.createElement("a")
    link.href = "/api/vcard"
    link.setAttribute("download", `${card.first_name.toLowerCase()}-${card.last_name.toLowerCase()}.vcf`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setShowModal(false)
    setModalStep("choose")
  }

  // Send by Email
  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault()
    if (!recipientEmail) return

    const subject = encodeURIComponent(`Contact Details: ${fullName} - ${card.company}`)
    const body = encodeURIComponent(
      `Hello,\n\nHere are the contact details for ${fullName}:\n\n` +
      `Name: ${fullName}\n` +
      `Company: ${card.company}\n` +
      `Title: ${card.bio}\n` +
      `Mobile: ${card.phone}\n` +
      `Email: ${card.email}\n` +
      `Website: https://${cleanWebsite}\n` +
      `Address: ${card.street}, ${card.city}, ${card.state} ${card.zip}\n\n` +
      `Digital Card: ${typeof window !== "undefined" ? window.location.href : "https://dolgins.com/card"}\n`
    )

    window.open(`mailto:${recipientEmail}?subject=${subject}&body=${body}`, "_blank")
    setEmailSent(true)
    setTimeout(() => {
      setEmailSent(false)
      setShowModal(false)
      setModalStep("choose")
      setRecipientEmail("")
    }, 1800)
  }

  return (
    <div className="min-h-screen w-full bg-[#f7f7f7] font-sans text-[#323032] antialiased relative">
      {/* 
        TOP HEADER: Full-bleed width #222943 across the top (Exact match to qrco.de/bh2StJ)
      */}
      <header
        style={{ backgroundColor: primaryBg }}
        className="w-full text-white text-center pt-10 sm:pt-14 relative"
      >
        <div className="max-w-[570px] mx-auto px-4">
          {/* Avatar (Diamond logo with 4 dots above) */}
          <div className="w-[95px] h-[95px] mx-auto rounded-full overflow-hidden flex items-center justify-center">
            {card.avatar_url ? (
              <img
                src={card.avatar_url}
                alt={fullName}
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src="https://qrcgcustomers.s3-eu-west-1.amazonaws.com/account51902472/59042606_1.png?0.2004734367969231"
                alt={fullName}
                className="w-full h-full object-contain"
              />
            )}
          </div>

          {/* Full Name */}
          <h1 className="text-[24px] sm:text-[26px] font-normal tracking-normal text-white pt-5 pb-4">
            {fullName}
          </h1>
        </div>

        {/* 
          ACTION BAR: CALL | EMAIL | DIRECTIONS
          Sits directly at the bottom of the navy header, and becomes sticky when scrolled!
        */}
        <div
          style={{ backgroundColor: primaryBg }}
          className={`w-full border-t border-white/15 transition-all duration-200 z-40 ${
            isScrolled ? "fixed top-0 left-0 right-0 shadow-lg" : "relative"
          }`}
        >
          <div className="max-w-[570px] mx-auto grid grid-cols-3 divide-x divide-white/15 h-[62px]">
            {/* 1. CALL */}
            <a
              href={`tel:${cleanPhone}`}
              className="flex flex-col items-center justify-center hover:bg-black/15 active:bg-black/25 transition-colors group cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-[18px] h-[18px] text-white group-hover:scale-105 transition-transform mb-1"
              >
                <path
                  fillRule="evenodd"
                  d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                  clipRule="evenodd"
                />
              </svg>
              <small className="text-[10px] tracking-wider text-white uppercase font-medium">
                CALL
              </small>
            </a>

            {/* 2. EMAIL */}
            <a
              href={`mailto:${card.email}?subject=From my vCard`}
              className="flex flex-col items-center justify-center hover:bg-black/15 active:bg-black/25 transition-colors group cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-[18px] h-[18px] text-white group-hover:scale-105 transition-transform mb-1"
              >
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
              <small className="text-[10px] tracking-wider text-white uppercase font-medium">
                EMAIL
              </small>
            </a>

            {/* 3. DIRECTIONS */}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center hover:bg-black/15 active:bg-black/25 transition-colors group cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-[18px] h-[18px] text-white group-hover:scale-105 transition-transform mb-1"
              >
                <path
                  fillRule="evenodd"
                  d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              </svg>
              <small className="text-[10px] tracking-wider text-white uppercase font-medium">
                DIRECTIONS
              </small>
            </a>
          </div>
        </div>
      </header>

      {/* 
        CARD BODY: 570px wide, centered on #f7f7f7 with subtle drop shadow
      */}
      <main className="max-w-[570px] w-full mx-auto bg-white mb-20 sm:mb-24 shadow-[0_5px_40px_7px_rgba(0,0,0,0.08)]">
        {/* Bio / Summary Row */}
        {card.bio && (
          <div className="px-6 py-5">
            <h4 className="text-[15px] sm:text-[16px] text-[#323032] font-normal leading-relaxed m-0">
              {card.bio}
            </h4>
          </div>
        )}

        {/* Separator */}
        <div className="border-b border-[#eaeaea]" />

        {/* Mobile Phone Row */}
        {card.phone && (
          <div className="relative py-4 pr-6 pl-16 hover:bg-gray-50/50 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-[#b3b4bb] absolute left-5 top-5"
            >
              <path
                fillRule="evenodd"
                d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                clipRule="evenodd"
              />
            </svg>
            <h4 className="text-[15px] font-normal text-[#323032] m-0">
              <a href={`tel:${cleanPhone}`} className="hover:text-[#222943]">
                {card.phone}
              </a>
            </h4>
            <small className="block text-[13px] text-[#82848f] mt-0.5">Mobile</small>
          </div>
        )}

        {/* Separator */}
        <div className="border-b border-[#eaeaea]" />

        {/* Email Row */}
        {card.email && (
          <div className="relative py-4 pr-6 pl-16 hover:bg-gray-50/50 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-[#b3b4bb] absolute left-5 top-5"
            >
              <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
              <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
            </svg>
            <h4 className="text-[15px] font-normal text-[#323032] m-0">
              <a href={`mailto:${card.email}?subject=From my vCard`} className="hover:text-[#222943]">
                {card.email}
              </a>
            </h4>
            <small className="block text-[13px] text-[#82848f] mt-0.5">Email</small>
          </div>
        )}

        {/* Separator */}
        <div className="border-b border-[#eaeaea]" />

        {/* Company Row */}
        {card.company && (
          <div className="relative py-5 pr-6 pl-16">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-[#b3b4bb] absolute left-5 top-5"
            >
              <path
                fillRule="evenodd"
                d="M7.5 5.25a3 3 0 013-3h3a3 3 0 013 3v.75h3.75A2.25 2.25 0 0122.5 8.25v10.5a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18.75V8.25A2.25 2.25 0 013.75 6H7.5v-.75zm3-.75a1.5 1.5 0 00-1.5 1.5v.75h6v-.75a1.5 1.5 0 00-1.5-1.5h-3z"
                clipRule="evenodd"
              />
            </svg>
            <h4 className="text-[15px] font-normal text-[#323032] m-0">
              {card.company}
            </h4>
          </div>
        )}

        {/* Separator */}
        <div className="border-b border-[#eaeaea]" />

        {/* Address Row */}
        {card.street && (
          <div className="relative py-5 pr-6 pl-16">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-[#b3b4bb] absolute left-5 top-5"
            >
              <path
                fillRule="evenodd"
                d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                clipRule="evenodd"
              />
            </svg>
            <div className="text-[15px] font-normal text-[#323032] leading-snug space-y-0.5">
              <h4>{card.street}</h4>
              <h4>
                {card.city}
                {card.state && `, ${card.state}`} {card.zip}
              </h4>
              <h4>{card.country}</h4>
            </div>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: accentColor }}
              className="inline-block pt-3 text-[13px] font-semibold uppercase tracking-wider hover:opacity-80 transition cursor-pointer"
            >
              SHOW ON MAP
            </a>
          </div>
        )}

        {/* Separator */}
        <div className="border-b border-[#eaeaea]" />

        {/* Website Row */}
        {card.website && (
          <div className="relative py-4 pr-6 pl-16 hover:bg-gray-50/50 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-[#b3b4bb] absolute left-5 top-5"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM6.262 6.072a8.25 8.25 0 0110.565-.086A16.035 16.035 0 0012 5.25a16.035 16.035 0 00-4.827.822h-.911zm-1.8 4.678h2.09c-.067.818-.102 1.65-.102 2.5 0 .85.035 1.682.102 2.5h-2.09a8.286 8.286 0 010-5zm3.602 0h7.872a14.538 14.538 0 01.176 2.5 14.538 14.538 0 01-.176 2.5H8.064a14.538 14.538 0 01-.176-2.5 14.538 14.538 0 01.176-2.5zm9.38 0h2.09a8.286 8.286 0 010 5h-2.09c.067-.818.102-1.65.102-2.5 0-.85-.035-1.682-.102-2.5zm-1.8 7.178a8.25 8.25 0 01-10.565.086A16.035 16.035 0 0012 18.75a16.035 16.035 0 004.827-.822h.911z"
                clipRule="evenodd"
              />
            </svg>
            <h4 className="text-[15px] font-normal text-[#323032] m-0">
              <a
                href={`https://${cleanWebsite}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#222943]"
              >
                {cleanWebsite}
              </a>
            </h4>
            <small className="block text-[13px] text-[#82848f] mt-0.5">Website</small>
          </div>
        )}

        {/* 
          DESKTOP DOWNLOAD BUTTON (Image 3):
          Visible on screens >= 640px, centered block button inside the card body!
        */}
        <div className="hidden sm:block p-8 pt-10 pb-12 text-center">
          <button
            type="button"
            onClick={() => {
              setModalStep("choose")
              setShowModal(true)
            }}
            style={{ backgroundColor: accentColor }}
            className="w-full max-w-[340px] h-[52px] mx-auto rounded-[3px] text-white font-medium text-[14px] tracking-wider uppercase flex items-center justify-center gap-2.5 shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:opacity-95 active:scale-[0.99] transition cursor-pointer"
          >
            {/* User + icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-white"
            >
              <path d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z" />
            </svg>
            <span>DOWNLOAD VCARD</span>
          </button>
        </div>
      </main>

      {/* 
        MOBILE FLOATING ACTION BUTTON (FAB) (Image 4):
        Visible on screens < 640px, fixed at bottom-right corner!
      */}
      <div className="sm:hidden fixed bottom-5 right-5 z-50">
        <button
          type="button"
          onClick={() => {
            setModalStep("choose")
            setShowModal(true)
          }}
          style={{ backgroundColor: accentColor }}
          className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-[0_6px_20px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          aria-label="Download vCard"
        >
          {/* User + icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 text-white"
          >
            <path d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z" />
          </svg>
        </button>
      </div>

      {/* 
        MODAL POPUP: Save Contact Data (Exact match to Image 1)
      */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-7 max-w-sm w-full relative text-left">
            {/* Close 'X' Button */}
            <button
              type="button"
              onClick={() => {
                setShowModal(false)
                setModalStep("choose")
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition p-1 cursor-pointer"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {modalStep === "choose" ? (
              <div>
                {/* Modal Title in Copper/Gold Accent */}
                <h3
                  style={{ color: accentColor }}
                  className="text-sm font-semibold tracking-normal"
                >
                  Save Contact Data
                </h3>
                <p className="text-gray-700 text-sm mt-1 mb-6">
                  How would you like to save contact data?
                </p>

                {/* Options List */}
                <div className="space-y-4">
                  {/* Option 1: Send by Email */}
                  <button
                    type="button"
                    onClick={() => setModalStep("email")}
                    className="w-full flex items-center gap-4 py-2 hover:opacity-80 transition group text-left cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-gray-800">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6 text-gray-800"
                      >
                        <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                        <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                      </svg>
                    </div>
                    <span className="text-[15px] font-medium text-gray-800">
                      Send by Email
                    </span>
                  </button>

                  {/* Option 2: Save to My Phone */}
                  <button
                    type="button"
                    onClick={handleSaveToPhone}
                    className="w-full flex items-center gap-4 py-2 hover:opacity-80 transition group text-left cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-gray-800">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        className="w-6 h-6 text-gray-800"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 13.5l3 3m0 0l3-3m-3 3v-6m1.06-4.19l-7.06.002A2.25 2.25 0 002.75 8.56v10.88A2.25 2.25 0 005 21.69h14a2.25 2.25 0 002.25-2.25V8.56a2.25 2.25 0 00-2.25-2.25h-2.94"
                        />
                      </svg>
                    </div>
                    <span className="text-[15px] font-medium text-gray-800">
                      Save to My Phone
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {/* Back button */}
                <button
                  type="button"
                  onClick={() => setModalStep("choose")}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 mb-3 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="w-3.5 h-3.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                  </svg>
                  <span>Back</span>
                </button>

                <h3
                  style={{ color: accentColor }}
                  className="text-sm font-semibold tracking-normal"
                >
                  Send by Email
                </h3>
                <p className="text-gray-600 text-xs mt-1 mb-4">
                  Send contact details directly using your email client.
                </p>

                {emailSent ? (
                  <div className="py-6 text-center text-green-600 font-medium text-sm">
                    Opening your email client...
                  </div>
                ) : (
                  <form onSubmit={handleSendEmail} className="space-y-4">
                    <input
                      type="email"
                      required
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      placeholder="Enter Email Address"
                      className="w-full px-3.5 py-2.5 rounded border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-[#C7A88C]"
                    />

                    <button
                      type="submit"
                      style={{ backgroundColor: accentColor }}
                      className="w-full py-2.5 rounded text-white font-medium text-sm tracking-wider uppercase hover:opacity-90 active:scale-[0.99] transition cursor-pointer"
                    >
                      SEND
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
