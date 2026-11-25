export const useText = () => {

    const truncate = ( text: string , length = 80 ) => {
        if (!text) return ''
        return (text.length > length) ? text.slice(0, length) + '...' : text ;
    }

    return {  truncate   }

}