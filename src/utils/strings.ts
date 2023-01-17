
export function capitalise(s: string) {
    let first = s[0].toUpperCase()
    return first + s.slice(1)
}