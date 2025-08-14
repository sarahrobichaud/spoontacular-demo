import { useState, useEffect, useRef, useCallback } from 'react'

export interface DebounceResult<T> {
    value: T
    debouncedValue: T
    isDebouncing: boolean
    flush: () => void
    cancel: () => void
    reset: (newValue: T) => void
}

export function useAdvancedDebounce<T>(
    value: T,
    delay: number = 500
): DebounceResult<T> {
    const [debouncedValue, setDebouncedValue] = useState<T>(value)
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const valueRef = useRef<T>(value)

    const isDebouncing = value !== debouncedValue

    useEffect(() => {
        valueRef.current = value

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
            setDebouncedValue(valueRef.current)
        }, delay)

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [value, delay])

    const flush = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        setDebouncedValue(valueRef.current)
    }, [])

    const cancel = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        setDebouncedValue(value)
    }, [value])

    const reset = useCallback((newValue: T) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        valueRef.current = newValue
        setDebouncedValue(newValue)
    }, [])

    return {
        value,
        debouncedValue,
        isDebouncing,
        flush,
        cancel,
        reset
    }
}