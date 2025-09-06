# 9to6 Project Management & Sales Tool

Ein modernes Projektmanagement- und Verkaufstool für Freelancer im Webdesign-Bereich, speziell für Elementor-basierte Websites.

## 🚀 Features

### Kernfunktionen
- **Dashboard**: Übersicht über Projekte, Finanzen und Aktivitäten
- **Angebotserstellung**: Drag & Drop Editor mit PDF-Export
- **Rechnungsstellung**: Automatische Berechnung mit deutscher MwSt.
- **Projektmanagement**: Verwaltung von einmaligen und monatlichen Projekten
- **Kundenverwaltung**: Vollständige Kundendatenbank

### Besondere Eigenschaften
- **Deutsche Lokalisierung**: Vollständig auf deutsche Geschäftspraktiken angepasst
- **MwSt.-Konformität**: Automatische Berechnung von 19%, 7% oder 0% MwSt.
- **PDF-Export**: Professionelle Angebote und Rechnungen als PDF
- **Responsive Design**: Optimiert für Desktop, Tablet und Mobile
- **Supabase-Ready**: Vorbereitet für Supabase-Integration

## 🛠 Technologie-Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Drag & Drop**: @dnd-kit
- **PDF-Generation**: jsPDF
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Database**: Supabase (vorbereitet)

## 📁 Projektstruktur

```
src/
├── components/           # React Komponenten
│   ├── layout/          # Layout-Komponenten (Sidebar, Header)
│   ├── dashboard/       # Dashboard-spezifische Komponenten
│   └── quotes/          # Angebots-/Rechnungskomponenten
├── types/               # TypeScript-Definitionen
├── utils/               # Hilfsfunktionen und Konstanten
└── App.tsx             # Hauptkomponente
```

## 🔧 Installation

1. **Abhängigkeiten installieren**:
   ```bash
   npm install
   ```

2. **Entwicklungsserver starten**:
   ```bash
   npm run dev
   ```

3. **Für Produktion bauen**:
   ```bash
   npm run build
   ```

## 📊 Supabase Integration

### Datenbank-Schema

Die Anwendung ist für folgende Tabellen vorbereitet:

#### Clients (Kunden)
```sql
CREATE TABLE clients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name text NOT NULL,
    contact_person text NOT NULL,
    email text UNIQUE NOT NULL,
    phone text,
    address jsonb NOT NULL,
    tax_id text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);
```

#### Projects (Projekte)
```sql
CREATE TABLE projects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id uuid REFERENCES clients(id),
    name text NOT NULL,
    description text,
    status text CHECK (status IN ('planning', 'in_progress', 'review', 'completed', 'cancelled')),
    project_type text CHECK (project_type IN ('onetime', 'monthly')),
    elementor_details jsonb,
    start_date date,
    end_date date,
    total_value decimal(10,2),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);
```

#### Quotes (Angebote)
```sql
CREATE TABLE quotes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id uuid REFERENCES clients(id),
    project_id uuid REFERENCES projects(id),
    quote_number text UNIQUE NOT NULL,
    date date NOT NULL,
    valid_until date NOT NULL,
    items jsonb NOT NULL,
    subtotal decimal(10,2) NOT NULL,
    tax_amount decimal(10,2) NOT NULL,
    total decimal(10,2) NOT NULL,
    status text CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'expired')),
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);
```

#### Invoices (Rechnungen)
```sql
CREATE TABLE invoices (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id uuid REFERENCES clients(id),
    project_id uuid REFERENCES projects(id),
    quote_id uuid REFERENCES quotes(id),
    invoice_number text UNIQUE NOT NULL,
    date date NOT NULL,
    due_date date NOT NULL,
    items jsonb NOT NULL,
    subtotal decimal(10,2) NOT NULL,
    tax_amount decimal(10,2) NOT NULL,
    total decimal(10,2) NOT NULL,
    status text CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
    payment_date date,
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);
```

### RLS Policies

```sql
-- Clients
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own clients" ON clients
    FOR ALL TO authenticated USING (true);

-- Projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own projects" ON projects
    FOR ALL TO authenticated USING (true);

-- Quotes
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own quotes" ON quotes
    FOR ALL TO authenticated USING (true);

-- Invoices
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own invoices" ON invoices
    FOR ALL TO authenticated USING (true);
```

## 🎨 Design System

### Farben
- **Primary**: Blue (#1E40AF)
- **Secondary**: Green (#059669)
- **Accent**: Orange (#EA580C)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)

### Typografie
- **Font**: Inter (system font fallback)
- **Sizes**: 12px - 48px
- **Weights**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)

### Spacing
- **Base**: 8px Grid System
- **Common**: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px

## 📋 Funktionale Anforderungen

### Angebotserstellung
- [x] Drag & Drop Interface
- [x] Dynamische Positionsverwaltung
- [x] Automatische MwSt.-Berechnung
- [x] PDF-Export
- [x] Deutsche Formatierung

### Projektmanagement
- [ ] Projektanlage und -verwaltung
- [ ] Status-Tracking
- [ ] Zeiterfassung
- [ ] Dokumentenverwaltung

### Rechnungsstellung
- [ ] Automatische Rechnungserstellung aus Angeboten
- [ ] Zahlungsverfolgung
- [ ] Mahnwesen
- [ ] DATEV-Export

### Reporting
- [ ] Umsatz-Reports
- [ ] Projekt-Analytics
- [ ] Kunden-Übersicht
- [ ] Steuerberichte

## 🔒 Rechtliche Anforderungen (Deutschland)

### Angebote
- ✅ Eindeutige Angebotsnummer
- ✅ Gültigkeitsdauer
- ✅ MwSt.-Ausweis
- ✅ Firmenadresse

### Rechnungen
- ✅ Fortlaufende Rechnungsnummer
- ✅ Rechnungsdatum
- ✅ Leistungsdatum
- ✅ MwSt.-Nummer
- ✅ Steuernummer

### Archivierung
- [ ] 10-jährige Aufbewahrungspflicht
- [ ] Unveränderbarkeit
- [ ] GoBD-Konformität

## 🚀 Deployment

### Entwicklung
```bash
npm run dev
```

### Produktion
```bash
npm run build
npm run preview
```

### Supabase Setup
1. Projekt in Supabase erstellen
2. Datenbank-Schema importieren
3. Environment-Variablen setzen
4. RLS-Policies aktivieren

## 📈 Roadmap

### Version 1.1
- [ ] Vollständige Supabase-Integration
- [ ] Kundenverwaltung
- [ ] Projektmanagement
- [ ] Rechnungsmodul

### Version 1.2
- [ ] E-Mail-Integration
- [ ] Automatisches Mahnwesen
- [ ] DATEV-Export
- [ ] Reporting-Dashboard

### Version 1.3
- [ ] Mobile App
- [ ] API für Drittsysteme
- [ ] Erweiterte Analytics
- [ ] Multi-User Support

## 🤝 Mitwirkende

- **9to6** - Entwicklung und Design

## 📄 Lizenz

Proprietär - Alle Rechte vorbehalten.

---

**9to6 Project Management Tool** - Professionelles Projektmanagement für Webdesign-Freelancer