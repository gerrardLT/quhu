import Clipboard from 'clipboard' //引入cliboard
import {Message} from 'element-ui'
import Vue from 'vue'
function clipboardSuccess(msg) {
    Message.success(msg || Vue.$t('clipboard.copy_success') )
}

function clipboardError(msg) {
    Message.error(msg || Vue.$t('clipboard.copy_fail'))
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