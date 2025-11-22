"use client"

import Image from "next/image"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
  className?: string
}

export function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const sizeMap = {
    sm: { image: 80 },
    md: { image: 140 },
    lg: { image: 200 },
  }

  const config = sizeMap[size]

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative flex items-center justify-center transition-transform duration-300 hover:scale-110" 
           style={{ width: config.image, height: config.image }}>
        <Image
          src="/logo-pecinogp.png"
          alt="PecinoGP Logo"
          width={config.image}
          height={config.image}
          className="object-contain drop-shadow-lg"
          priority
        />
      </div>
    </div>
  )
}

export function LogoMinimal() {
  return (
    <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center transition-transform duration-300 hover:scale-110">
      <Image
        src="/logo-pecinogp.png"
        alt="PecinoGP"
        width={160}
        height={160}
        className="object-contain drop-shadow-lg"
        priority
      />
    </div>
  )
}
