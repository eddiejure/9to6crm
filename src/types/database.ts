export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          company_name: string | null
          role: 'user' | 'admin' | 'superadmin'
          tax_number: string | null
          vat_id: string | null
          address: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          company_name?: string | null
          role?: 'user' | 'admin' | 'superadmin'
          tax_number?: string | null
          vat_id?: string | null
          address?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          company_name?: string | null
          role?: 'user' | 'admin' | 'superadmin'
          tax_number?: string | null
          vat_id?: string | null
          address?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          user_id: string
          company_name: string
          contact_person: string
          email: string
          phone: string | null
          address: Json
          tax_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_name: string
          contact_person: string
          email: string
          phone?: string | null
          address: Json
          tax_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company_name?: string
          contact_person?: string
          email?: string
          phone?: string | null
          address?: Json
          tax_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          client_id: string
          name: string
          description: string | null
          status: 'planning' | 'in_progress' | 'review' | 'completed' | 'cancelled'
          project_type: 'onetime' | 'monthly'
          elementor_details: Json | null
          start_date: string | null
          end_date: string | null
          total_value: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          client_id: string
          name: string
          description?: string | null
          status?: 'planning' | 'in_progress' | 'review' | 'completed' | 'cancelled'
          project_type: 'onetime' | 'monthly'
          elementor_details?: Json | null
          start_date?: string | null
          end_date?: string | null
          total_value?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          client_id?: string
          name?: string
          description?: string | null
          status?: 'planning' | 'in_progress' | 'review' | 'completed' | 'cancelled'
          project_type?: 'onetime' | 'monthly'
          elementor_details?: Json | null
          start_date?: string | null
          end_date?: string | null
          total_value?: number
          created_at?: string
          updated_at?: string
        }
      }
      quotes: {
        Row: {
          id: string
          user_id: string
          client_id: string
          project_id: string | null
          quote_number: string
          date: string
          valid_until: string
          items: Json
          subtotal: number
          tax_amount: number
          total: number
          status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          client_id: string
          project_id?: string | null
          quote_number: string
          date: string
          valid_until: string
          items: Json
          subtotal: number
          tax_amount: number
          total: number
          status?: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          client_id?: string
          project_id?: string | null
          quote_number?: string
          date?: string
          valid_until?: string
          items?: Json
          subtotal?: number
          tax_amount?: number
          total?: number
          status?: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          user_id: string
          client_id: string
          project_id: string | null
          quote_id: string | null
          invoice_number: string
          date: string
          due_date: string
          items: Json
          subtotal: number
          tax_amount: number
          total: number
          status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
          payment_date: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          client_id: string
          project_id?: string | null
          quote_id?: string | null
          invoice_number: string
          date: string
          due_date: string
          items: Json
          subtotal: number
          tax_amount: number
          total: number
          status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
          payment_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          client_id?: string
          project_id?: string | null
          quote_id?: string | null
          invoice_number?: string
          date?: string
          due_date?: string
          items?: Json
          subtotal?: number
          tax_amount?: number
          total?: number
          status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
          payment_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}