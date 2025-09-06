// Constants and Configuration for German Business

export const COMPANY_INFO = {
  name: '9to6',
  tagline: 'Professional Web Design Services',
  address: {
    street: 'Muster Straße 123',
    city: 'Berlin',
    postal_code: '10115',
    country: 'Deutschland'
  },
  contact: {
    email: 'kontakt@9to6.de',
    phone: '+49 30 12345678',
    website: 'www.9to6.de'
  },
  tax: {
    vat_id: 'DE123456789', // Umsatzsteuer-ID
    tax_number: '12/345/67890' // Steuernummer
  }
};

export const TAX_RATES = {
  STANDARD: 0.19, // 19% MwSt.
  REDUCED: 0.07,  // 7% ermäßigter Satz
  EXEMPT: 0       // 0% steuerbefreit
};

export const PROJECT_STATUSES = {
  planning: 'Planung',
  in_progress: 'In Bearbeitung',
  review: 'Überprüfung',
  completed: 'Abgeschlossen',
  cancelled: 'Abgebrochen'
};

export const PAYMENT_STATUSES = {
  draft: 'Entwurf',
  sent: 'Versendet',
  paid: 'Bezahlt',
  overdue: 'Überfällig',
  cancelled: 'Storniert',
  accepted: 'Angenommen',
  rejected: 'Abgelehnt',
  expired: 'Abgelaufen'
};

export const SERVICE_TEMPLATES = [
  {
    id: 'elementor-basic',
    name: 'Elementor Basic Website',
    description: 'Einfache Website mit Elementor (bis zu 5 Seiten)',
    type: 'onetime' as const,
    base_price: 1500,
    items: [
      {
        description: 'Elementor Website Entwicklung (5 Seiten)',
        quantity: 1,
        unit_price: 1200,
        tax_rate: TAX_RATES.STANDARD
      },
      {
        description: 'SEO Grundkonfiguration',
        quantity: 1,
        unit_price: 300,
        tax_rate: TAX_RATES.STANDARD
      }
    ]
  },
  {
    id: 'elementor-premium',
    name: 'Elementor Premium Website',
    description: 'Professionelle Website mit erweiterten Features',
    type: 'onetime' as const,
    base_price: 3500,
    items: [
      {
        description: 'Elementor Pro Website (bis zu 15 Seiten)',
        quantity: 1,
        unit_price: 2500,
        tax_rate: TAX_RATES.STANDARD
      },
      {
        description: 'Custom Design & Branding',
        quantity: 1,
        unit_price: 800,
        tax_rate: TAX_RATES.STANDARD
      },
      {
        description: 'SEO Optimierung & Analytics',
        quantity: 1,
        unit_price: 200,
        tax_rate: TAX_RATES.STANDARD
      }
    ]
  },
  {
    id: 'monthly-maintenance',
    name: 'Monatliche Wartung',
    description: 'Regelmäßige Website-Wartung und Support',
    type: 'monthly' as const,
    base_price: 99,
    items: [
      {
        description: 'Website Wartung & Updates',
        quantity: 1,
        unit_price: 79,
        tax_rate: TAX_RATES.STANDARD
      },
      {
        description: 'Backup & Security Monitoring',
        quantity: 1,
        unit_price: 20,
        tax_rate: TAX_RATES.STANDARD
      }
    ]
  }
];