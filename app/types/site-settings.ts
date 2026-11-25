
export interface SiteSettings {
  legal: {
    companyName: string
    commercialName: string
    legalForm: string
    registeredAddress: string
    registrationNumber: string
    taxNumber: string
    publicationDirector: string
  }

  hosting: {
    provider: string
    address: string
    website: string
  }

  contact: {
    email: string
    phone: string
    address: string
    supportHours: string
    responseTime: string
  }

  updatedAt?: string
}


export const defaultSiteSettings: SiteSettings = {

        legal: {
            companyName: '',
            commercialName: 'KHARAN',
            legalForm: '',
            registeredAddress: '',
            registrationNumber: '',
            taxNumber: '',
            publicationDirector: ''
        },


        hosting: {
            provider: '',
            address: '',
            website: ''
        },

        contact: {
            email: '',
            phone: '',
            address: '',
            supportHours: '',
            responseTime: ''
        }

        
}
