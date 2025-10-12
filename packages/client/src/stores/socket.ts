import io from 'socket.io-client'
import { ref } from 'vue'
import { defineStore } from 'pinia'

const MAX_LOG = 10
const socket = io('http://localhost:8080')

type LogType = 'listen' | 'on' | 'off' | 'emit' | 'user'
export type Log = {
  logType: LogType
  text: string
}

export const useSocketStore = defineStore('socket', () => {
  const logList = ref<Array<Log>>([])

  const on = (id: string, callback: (...arg: Array<any>) => void) => {
    push('listen', id)
    socket.on(id, (arg) => {
      push('on', `${id}, ${arg}`)
      callback(arg)
    })
  }

  const off = (id: string) => {
    push('off', id)
    socket.off(id)
  }

  const emit = (id: string, ...arg: Array<any>) => {
    push('emit', `${id} ${arg}`)
    socket.emit(id, ...arg)
  }

  const push = (logType: LogType, text: string) => {
    logList.value.push({ logType, text })

    if (logList.value.length > MAX_LOG) {
      logList.value.shift()
    }
  }

  return { on, off, emit, logList, push }
})
