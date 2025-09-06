# API Documentation

Dokumentation der geplanten API-Endpoints für die 9to6 Project Management App.

## 🔗 Base URL

```
Production: https://api.9to6.de/v1
Development: http://localhost:3000/v1
```

## 🔐 Authentication

Alle API-Calls benötigen ein gültiges JWT Token von Supabase Auth.

```javascript
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

## 👥 Clients API

### GET /clients
Alle Kunden abrufen

**Request:**
```javascript
GET /clients?page=1&limit=20&search=musterfirma
```

**Response:**
```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "company_name": "Musterfirma GmbH",
      "contact_person": "Max Mustermann",
      "email": "max@musterfirma.de",
      "phone": "+49 30 12345678",
      "address": {
        "street": "Musterstraße 123",
        "city": "Berlin",
        "postal_code": "10115",
        "country": "Deutschland"
      },
      "tax_id": "DE123456789",
      "created_at": "2025-01-15T10:00:00Z",
      "updated_at": "2025-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

### POST /clients
Neuen Kunden erstellen

**Request:**
```json
{
  "company_name": "Neue Firma GmbH",
  "contact_person": "Anna Schmidt",
  "email": "anna@neuefirma.de",
  "phone": "+49 40 12345678",
  "address": {
    "street": "Neue Straße 456",
    "city": "Hamburg",
    "postal_code": "20095",
    "country": "Deutschland"
  },
  "tax_id": "DE987654321"
}
```

### GET /clients/{id}
Einzelnen Kunden abrufen

### PUT /clients/{id}
Kunden aktualisieren

### DELETE /clients/{id}
Kunden löschen

## 📁 Projects API

### GET /projects
Alle Projekte abrufen

**Request:**
```javascript
GET /projects?status=in_progress&client_id=123&type=onetime
```

**Response:**
```json
{
  "data": [
    {
      "id": "456e7890-e89b-12d3-a456-426614174001",
      "client_id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Website Relaunch",
      "description": "Kompletter Relaunch mit Elementor",
      "status": "in_progress",
      "project_type": "onetime",
      "elementor_details": {
        "template_type": "business",
        "pages": 8,
        "features": ["contact_form", "gallery", "blog"]
      },
      "start_date": "2025-01-10",
      "end_date": "2025-02-15",
      "total_value": 3500.00,
      "client": {
        "company_name": "Musterfirma GmbH",
        "contact_person": "Max Mustermann"
      },
      "created_at": "2025-01-15T10:00:00Z",
      "updated_at": "2025-01-15T10:00:00Z"
    }
  ]
}
```

### POST /projects
Neues Projekt erstellen

### GET /projects/{id}
Einzelnes Projekt abrufen

### PUT /projects/{id}
Projekt aktualisieren

### DELETE /projects/{id}
Projekt löschen

## 📄 Quotes API

### GET /quotes
Alle Angebote abrufen

**Response:**
```json
{
  "data": [
    {
      "id": "789e1234-e89b-12d3-a456-426614174002",
      "client_id": "123e4567-e89b-12d3-a456-426614174000",
      "project_id": "456e7890-e89b-12d3-a456-426614174001",
      "quote_number": "AN-20250115-1234",
      "date": "2025-01-15",
      "valid_until": "2025-02-14",
      "items": [
        {
          "id": "item1",
          "description": "Elementor Website Entwicklung",
          "quantity": 1,
          "unit_price": 2500.00,
          "total": 2500.00,
          "tax_rate": 0.19
        }
      ],
      "subtotal": 2500.00,
      "tax_amount": 475.00,
      "total": 2975.00,
      "status": "sent",
      "notes": "Angebot gültig für 30 Tage",
      "client": {
        "company_name": "Musterfirma GmbH",
        "contact_person": "Max Mustermann"
      },
      "created_at": "2025-01-15T10:00:00Z",
      "updated_at": "2025-01-15T10:00:00Z"
    }
  ]
}
```

### POST /quotes
Neues Angebot erstellen

**Request:**
```json
{
  "client_id": "123e4567-e89b-12d3-a456-426614174000",
  "project_id": "456e7890-e89b-12d3-a456-426614174001",
  "date": "2025-01-15",
  "valid_until": "2025-02-14",
  "items": [
    {
      "description": "Elementor Website Entwicklung",
      "quantity": 1,
      "unit_price": 2500.00,
      "tax_rate": 0.19
    }
  ],
  "notes": "Angebot gültig für 30 Tage"
}
```

### GET /quotes/{id}
Einzelnes Angebot abrufen

### PUT /quotes/{id}
Angebot aktualisieren

### POST /quotes/{id}/send
Angebot versenden

### POST /quotes/{id}/accept
Angebot annehmen

### POST /quotes/{id}/reject
Angebot ablehnen

### GET /quotes/{id}/pdf
Angebot als PDF herunterladen

## 🧾 Invoices API

### GET /invoices
Alle Rechnungen abrufen

### POST /invoices
Neue Rechnung erstellen

### POST /invoices/from-quote/{quote_id}
Rechnung aus Angebot erstellen

### GET /invoices/{id}
Einzelne Rechnung abrufen

### PUT /invoices/{id}
Rechnung aktualisieren

### POST /invoices/{id}/send
Rechnung versenden

### POST /invoices/{id}/mark-paid
Rechnung als bezahlt markieren

### GET /invoices/{id}/pdf
Rechnung als PDF herunterladen

## 📊 Analytics API

### GET /analytics/dashboard
Dashboard-Statistiken

**Response:**
```json
{
  "monthly_revenue": 12450.00,
  "active_projects": 8,
  "total_clients": 24,
  "pending_quotes": 5,
  "unpaid_invoices": {
    "count": 3,
    "total_amount": 3250.00
  },
  "revenue_trend": [
    { "month": "2024-12", "revenue": 11200.00 },
    { "month": "2025-01", "revenue": 12450.00 }
  ]
}
```

### GET /analytics/revenue
Umsatzanalysen

### GET /analytics/projects
Projektanalysen

### GET /analytics/clients
Kundenanalysen

## 🛠 Service Templates API

### GET /service-templates
Alle Dienstleistungsvorlagen abrufen

**Response:**
```json
{
  "data": [
    {
      "id": "template1",
      "name": "Elementor Basic Website",
      "description": "Einfache Website mit Elementor (bis zu 5 Seiten)",
      "type": "onetime",
      "base_price": 1500.00,
      "items": [
        {
          "description": "Elementor Website Entwicklung (5 Seiten)",
          "quantity": 1,
          "unit_price": 1200.00,
          "tax_rate": 0.19
        },
        {
          "description": "SEO Grundkonfiguration",
          "quantity": 1,
          "unit_price": 300.00,
          "tax_rate": 0.19
        }
      ],
      "created_at": "2025-01-15T10:00:00Z"
    }
  ]
}
```

### POST /service-templates
Neue Vorlage erstellen

### GET /service-templates/{id}
Einzelne Vorlage abrufen

### PUT /service-templates/{id}
Vorlage aktualisieren

### DELETE /service-templates/{id}
Vorlage löschen

## 📧 Email API

### POST /emails/send-quote
Angebot per E-Mail versenden

**Request:**
```json
{
  "quote_id": "789e1234-e89b-12d3-a456-426614174002",
  "to": "kunde@firma.de",
  "subject": "Ihr Angebot von 9to6",
  "message": "Anbei erhalten Sie unser Angebot...",
  "include_pdf": true
}
```

### POST /emails/send-invoice
Rechnung per E-Mail versenden

### POST /emails/send-reminder
Zahlungserinnerung versenden

## 🔧 System API

### GET /health
System-Status prüfen

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T10:00:00Z",
  "database": "connected",
  "email_service": "operational"
}
```

### GET /settings
Systemeinstellungen abrufen

### PUT /settings
Systemeinstellungen aktualisieren

## 📱 Webhooks

### POST /webhooks/payment
Payment-Status Updates von externen Anbietern

### POST /webhooks/email
E-Mail-Status Updates (gesendet, geöffnet, etc.)

## ❌ Fehlerbehandlung

Alle API-Endpoints verwenden standardisierte HTTP-Status-Codes:

- `200` - Erfolg
- `201` - Erstellt
- `400` - Ungültige Anfrage
- `401` - Nicht authentifiziert
- `403` - Keine Berechtigung
- `404` - Nicht gefunden
- `422` - Validierungsfehler
- `500` - Server-Fehler

**Fehler-Response:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Die Eingabedaten sind ungültig",
    "details": {
      "email": ["E-Mail-Adresse ist ungültig"],
      "phone": ["Telefonnummer ist erforderlich"]
    }
  },
  "timestamp": "2025-01-15T10:00:00Z",
  "request_id": "req_123456789"
}
```

## 🔍 Rate Limiting

- **Standard**: 1000 Requests pro Stunde
- **Upload**: 100 Requests pro Stunde
- **PDF-Generation**: 500 Requests pro Stunde

**Headers:**
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642678800
```

## 📝 Beispiel-Client (JavaScript)

```javascript
class NineToSixAPI {
  constructor(baseURL, token) {
    this.baseURL = baseURL;
    this.token = token;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    
    return response.json();
  }

  // Clients
  async getClients(params = {}) {
    const query = new URLSearchParams(params);
    return this.request(`/clients?${query}`);
  }

  async createClient(data) {
    return this.request('/clients', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Quotes
  async getQuotes(params = {}) {
    const query = new URLSearchParams(params);
    return this.request(`/quotes?${query}`);
  }

  async createQuote(data) {
    return this.request('/quotes', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async downloadQuotePDF(id) {
    return this.request(`/quotes/${id}/pdf`, {
      headers: { 'Accept': 'application/pdf' }
    });
  }
}

// Verwendung
const api = new NineToSixAPI('https://api.9to6.de/v1', 'your-jwt-token');

try {
  const clients = await api.getClients({ limit: 10 });
  console.log(clients);
} catch (error) {
  console.error('API Error:', error.message);
}
```

---

**Note**: Diese API-Dokumentation beschreibt die geplante Implementierung. Aktuelle Endpoints können in der nächsten Version abweichen.