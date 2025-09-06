// Core Types for 9to6 Project Management App

export interface Client {
  id: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone?: string;
  address: {
    street: string;
    city: string;
    postal_code: string;
    country: string;
  };
  tax_id?: string; // Steuernummer
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  client_id: string;
  name: string;
  description?: string;
  status: 'planning' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  project_type: 'onetime' | 'monthly';
  elementor_details?: {
    template_type: string;
    pages: number;
    features: string[];
  };
  start_date?: string;
  end_date?: string;
  total_value: number;
  created_at: string;
  updated_at: string;
}

export interface QuoteInvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
  tax_rate: number; // German MwSt. (19% standard)
}

export interface Quote {
  id: string;
  client_id: string;
  project_id?: string;
  quote_number: string;
  date: string;
  valid_until: string;
  items: QuoteInvoiceItem[];
  subtotal: number;
  tax_amount: number;
  total: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  client_id: string;
  project_id?: string;
  quote_id?: string;
  invoice_number: string;
  date: string;
  due_date: string;
  items: QuoteInvoiceItem[];
  subtotal: number;
  tax_amount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  payment_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ServiceTemplate {
  id: string;
  name: string;
  description: string;
  type: 'onetime' | 'monthly';
  base_price: number;
  items: Omit<QuoteInvoiceItem, 'id' | 'total'>[];
  created_at: string;
}