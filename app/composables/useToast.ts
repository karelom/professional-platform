/** 共用 Toast 提示 */
export function useToast() {
  const message = ref('')

  function show(msg: string, duration = 2000) {
    message.value = msg
    setTimeout(() => {
      message.value = ''
    }, duration)
  }

  return { message, show }
}
