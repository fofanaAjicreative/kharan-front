export const useGlobalLoading = () => {


    const loading = useState( 'global-loading', () => false )

    function showLoading() {
        loading.value = true
    }

    function hideLoading() {
        loading.value = false
    }

    return { 
        loading,
        showLoading,
        hideLoading
    }



}