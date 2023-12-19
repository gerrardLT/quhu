const COLONS_REGEX = new RegExp(
    '([^:]+)?(:[a-zA-Z0-9-_+]+:(:skin-tone-[2-6]:)?)',
    'g'
  )
  
  /**
   * Replace emojis insdie the `text` with `<span>`s.
   */
  export function wrapEmoji(text) {
    return text.replace(COLONS_REGEX, function(match, p1, p2) {
      const before = p1 || ''
      // We add "data-text='{emoji.native}'", don't replace it
      if (before.endsWith('alt="') || before.endsWith('data-text="')) {
        return match
      }
      let emoji = emojiIndex.findEmoji(p2)
      if (!emoji) {
        return match
      }
      return before + emojiToHtml(emoji)
    })
    return text;
  }
  
  /**
   * Convert Emoji to HTML to represent it as an image.
   */
  export function emojiToHtml(emoji) {
    let style = `background-position: ${emoji.getPosition()}`
    // The src="data:image..." is needed to prevent border around img tags.
    return `<img data-text="${emoji.native}" alt="${
      emoji.colons
    }" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" class='emoji-text' style="${style}">`
  }
  