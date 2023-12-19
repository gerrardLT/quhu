export function encrypt(text, k) {
  let result = ''
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) + k)
  }
  return result
}

export function decrypt(text, k, type) {
  let result = ''

  for (let i = 0; i < text.length; i++) {
    if (text.codePointAt(i) > 0xffff) {
        result += String.fromCodePoint(text.codePointAt(i))
        i++
    } else {
        result += String.fromCodePoint(text.codePointAt(i) - k)
    }
      

  }
  return result
}
