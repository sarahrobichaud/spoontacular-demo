import { useState, useEffect, useMemo } from 'react'

export function useDebounce<T>(
	value: T,
	delay = 500
): [T, boolean, (newValue: T) => void] {
	const [comparedValue, setComparedValue] = useState<T>(value)
	const [debouncedValue, setDebouncedValue] = useState<T>(value)

	useEffect(() => {
		setComparedValue(value)
	}, [value])

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value)
			setComparedValue(value)
		}, delay)

		return () => {
			clearTimeout(handler)
		}
	}, [value, delay])

	const same = useMemo(() => {
		return comparedValue === debouncedValue
	}, [comparedValue, debouncedValue])

	const reset = (newValue: T) => {
		setDebouncedValue(newValue)
		setComparedValue(newValue)
	}

	return [debouncedValue, !same, reset]
}
