export const useConfirm = () => {

  const dialog = useState( 'confirm-dialog', () => false )

  const title = useState( 'confirm-title', () => '' )
  const text = useState( 'confirm-text', () => '' )

  const resolver = useState<any>( 'confirm-resolver', () => null )

    const confirm = (
        options: {
        title: string
        text: string
        }
    ) => {

    title.value = options.title
    text.value = options.text

    dialog.value = true ;
    return new Promise<boolean>((resolve) => { resolver.value = resolve })
  }

  const accept = () => {
    dialog.value = false
    resolver.value?.(true)
  }

  const cancel = () => {
    dialog.value = false
    resolver.value?.(false)
  }

  return {
    dialog,
    title,
    text,
    confirm,
    accept,
    cancel
  }
}