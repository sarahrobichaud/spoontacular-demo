import { useState, useRef, type RefObject, useEffect } from 'react'

interface ParallaxOptions {
	pitchFactor?: number
	yawFactor?: number
	perspective?: number
	resetOnLeave?: boolean
	easingFactor?: number
}

interface ParallaxResult {
	ref: RefObject<HTMLDivElement | null>
	transform: string
	handleMouseMove: (e: React.MouseEvent) => void
	handleMouseLeave: () => void
	pitch: number
	yaw: number
}

export function useParallax({
	pitchFactor = 20,
	yawFactor = 20,
	perspective = 1000,
	resetOnLeave = true,
	easingFactor = 0.4,
}: ParallaxOptions = {}): ParallaxResult {
	const ref = useRef<HTMLDivElement>(null)
	const [pitch, setPitch] = useState(0)
	const [yaw, setYaw] = useState(0)
	const [targetPitch, setTargetPitch] = useState(0)
	const [targetYaw, setTargetYaw] = useState(0)
	const animationFrameId = useRef<number | null>(null)

	useEffect(() => {
		const updatePosition = () => {
			setPitch(prev => prev + (targetPitch - prev) * easingFactor)
			setYaw(prev => prev + (targetYaw - prev) * easingFactor)

			animationFrameId.current = requestAnimationFrame(updatePosition)
		}

		animationFrameId.current = requestAnimationFrame(updatePosition)

		return () => {
			if (animationFrameId.current) {
				cancelAnimationFrame(animationFrameId.current)
			}
		}
	}, [targetPitch, targetYaw, easingFactor])

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!ref.current) return

		const rect = ref.current.getBoundingClientRect()

		const centerX = rect.left + rect.width / 2
		const centerY = rect.top + rect.height / 2

		const mouseX = e.clientX - centerX
		const mouseY = e.clientY - centerY

		const newYaw = (mouseX / (rect.width / 2)) * yawFactor
		const newPitch = -(mouseY / (rect.height / 2)) * pitchFactor

		setTargetPitch(newPitch)
		setTargetYaw(newYaw)
	}

	const handleMouseLeave = () => {
		if (resetOnLeave) {
			setTargetPitch(0)
			setTargetYaw(0)
		}
	}

	const transform = `perspective(${perspective}px) rotateX(${pitch}deg) rotateY(${yaw}deg)`

	return { ref, transform, handleMouseMove, handleMouseLeave, pitch, yaw }
}
