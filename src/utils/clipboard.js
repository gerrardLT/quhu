import Clipboard from 'clipboard' //引入cliboard
import {Message} from 'element-ui'
import i18n from '@/language'
function clipboardSuccess(msg) {
    Message.success(msg || i18n.t('clip_board.copy_success'))
}

function clipboardError(msg) {
    Message.error(msg || i18n.t('clip_board.copy_fail'))
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