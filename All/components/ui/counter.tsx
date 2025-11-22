"use client"

import { useEffect, useRef } from "react"
import { animate, motion } from "framer-motion"

type CounterProps = {
  from: number
  to: number
  className?: string
  format?: (value: number) => string
}

export function Counter({ from, to, className, format }: CounterProps) {
  const nodeRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const node = nodeRef.current
    if (!node) return

    const controls = animate(from, to, {
      duration: 5,
      onUpdate(value) {
        node.textContent = format ? format(value) : value.toFixed(0)
      },
    })

    return () => controls.stop()
  }, [from, to, format])

  return <p className={className} ref={nodeRef} />
}
