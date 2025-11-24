"use client"

import Image from "next/image"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
  className?: string
}

export function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const sizeMap = {
    sm: { image: 120 },
    md: { image: 200 },
    lg: { image: 280 },
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
    <div className="relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center transition-transform duration-300 hover:scale-110">
      <Image
        src="/logo-pecinogp.png"
        alt="PecinoGP"
        width={224}
        height={224}
        className="object-contain drop-shadow-lg"
        priority
      />
    </div>
  )
}
