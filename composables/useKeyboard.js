import { useEffect, useState } from 'react'
import { Keyboard } from 'react-native'

const useKeyboard = () => {
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false)

    const onKeyboardDidShow = () => setIsKeyboardOpen(true)
    const onKeyboardDidHide = () => setIsKeyboardOpen(false)

    useEffect(() => {
        const a = Keyboard.addListener('keyboardDidShow', onKeyboardDidShow)
        const b = Keyboard.addListener('keyboardDidHide', onKeyboardDidHide)

        return () => {
           a.remove();
           b.remove();
        }
    }, [])

    return [isKeyboardOpen]
}

export default useKeyboard
