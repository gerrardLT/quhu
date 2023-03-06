import Clipboard from 'clipboard' //引入cliboard
import {Message} from 'element-ui'
function clipboardSuccess(msg) {
    Message.success(msg || '复制成功')
}

function clipboardError(msg) {
    Message.error(msg || '复制失败')
}

export default function handleClipboard(text, event, msg) {
  const clipboard = new Clipboard(event.target, {
    text: () => text,
  })
  clipboard.on('success', () => {
    clipboardSuccess(msg)
    clipboard.destroy()
  })
  clipboard.on('error', () => {
    clipboardError(msg)
    clipboard.destroy()
  })
  clipboard.onClick(event)
}