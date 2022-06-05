export function checkCode(code: number): number {
    const res = Math.floor(code / 10) % 10
    if (res == 0) {
        return 200
    } else {
        return 500
    }
}
