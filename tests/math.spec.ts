import { add } from '../src/utils'

describe('Math utilities', () => {
    describe('add function', () => {
        test('should add two positive numbers', () => {
            expect(add(2, 3)).toBe(5)
            expect(add(10, 15)).toBe(25)
        })

        test('should add two negative numbers', () => {
            expect(add(-2, -3)).toBe(-5)
            expect(add(-10, -5)).toBe(-15)
        })

        test('should add positive and negative numbers', () => {
            expect(add(5, -3)).toBe(2)
            expect(add(-5, 3)).toBe(-2)
            expect(add(10, -10)).toBe(0)
        })

        test('should handle zero values', () => {
            expect(add(0, 5)).toBe(5)
            expect(add(5, 0)).toBe(5)
            expect(add(0, 0)).toBe(0)
        })

        test('should handle decimal numbers', () => {
            expect(add(1.5, 2.5)).toBe(4)
            expect(add(0.1, 0.2)).toBeCloseTo(0.3)
            expect(add(-1.5, 2.7)).toBeCloseTo(1.2)
        })

        test('should handle large numbers', () => {
            expect(add(1000000, 2000000)).toBe(3000000)
            expect(add(Number.MAX_SAFE_INTEGER, -1)).toBe(
                Number.MAX_SAFE_INTEGER - 1,
            )
        })

        test('should handle edge cases', () => {
            expect(add(Infinity, 5)).toBe(Infinity)
            expect(add(-Infinity, 5)).toBe(-Infinity)
            expect(add(Infinity, -Infinity)).toBeNaN()
        })
    })
})
