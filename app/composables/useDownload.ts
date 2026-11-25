export function useDownload() {


  async function download(url: string, filename?: string) {


 
    try {
 
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error("Impossible de télécharger le fichier.")
      }

      const blob = await response.blob()

      const objectUrl = URL.createObjectURL(blob)

      const a = document.createElement("a")

      a.href = objectUrl

      a.download = filename || url.split("/").pop() || "document"

      document.body.appendChild(a)

      a.click()

      document.body.removeChild(a)

      URL.revokeObjectURL(objectUrl)

    } catch (error) {

      console.log()

    }

  }

  return {
    download
  }

}