# ⚡ Alstom RCIS - Rework Intelligence System

**Power Module ESD Line Rework Intelligence System**

A digital intelligence platform for manufacturing analytics and root cause tracking in PM Line production.

## 🎯 Overview

Alstom RCIS is an industrial-grade, dashboard-focused system designed for tracking and analyzing rework data in Power Module (PM) manufacturing lines. The platform provides real-time insights into defect patterns, root causes, and corrective actions.

### Key Features

- **📊 Rework Data Tracking** - Comprehensive logging and management of rework records
- **🔍 Root Cause Pattern Detection** - AI-assisted identification of recurring issues
- **✅ Corrective Action Management** - Track and monitor improvement initiatives
- **⚠️ Recurring Defect Highlighting** - Automatic detection of systematic problems
- **🔥 Risk Heat Maps** - Visual representation of defect concentration by station and type
- **📚 Digital Knowledge Base** - Centralized repository of best practices and lessons learned

## 🏗️ Architecture

```
Alstom-RCIS/
├── backend/              # Node.js/Express API server
│   ├── src/
│   │   ├── models/       # Database models and schemas
│   │   ├── routes/       # API route handlers
│   │   ├── controllers/  # Business logic controllers
│   │   └── utils/        # Utility functions
│   └── data/             # SQLite database storage
│
└── frontend/             # React dashboard application
    ├── public/           # Static assets
    └── src/
        ├── components/   # Reusable UI components
        ├── pages/        # Page components
        ├── services/     # API service layer
        └── utils/        # Helper functions
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the server
npm start

# For development with auto-reload
npm run dev
```

The backend API will be available at `http://localhost:3001`

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The dashboard will be available at `http://localhost:3000`

## 📡 API Endpoints

### Rework Management
- `GET /api/rework` - List all rework records
- `GET /api/rework/:id` - Get specific rework record
- `POST /api/rework` - Create new rework record
- `PUT /api/rework/:id` - Update rework record
- `DELETE /api/rework/:id` - Delete rework record

### Root Cause Analysis
- `GET /api/root-cause` - List root causes
- `GET /api/root-cause/patterns` - Get aggregated patterns
- `POST /api/root-cause` - Create root cause entry

### Corrective Actions
- `GET /api/corrective-action` - List corrective actions
- `POST /api/corrective-action` - Create new action
- `PUT /api/corrective-action/:id` - Update action status

### Analytics
- `GET /api/analytics/summary` - Dashboard statistics
- `GET /api/analytics/defect-trends` - Defect trends by type
- `GET /api/analytics/heat-map` - Risk heat map data
- `GET /api/analytics/recurring-defects` - Recurring defect analysis
- `GET /api/analytics/time-series` - Time-based trends
- `GET /api/analytics/top-stations` - Station performance metrics

## 💾 Database Schema

The system uses SQLite with the following main tables:

- **rework_records** - Core rework data
- **root_causes** - Root cause associations
- **corrective_actions** - Improvement action tracking
- **defect_patterns** - Pattern recognition data
- **knowledge_base** - Knowledge management entries

## 🎨 Design Principles

- **Clean & Minimal** - Industrial-grade UI with focus on data clarity
- **Dashboard-Focused** - Quick access to critical metrics
- **Dark Theme** - Reduces eye strain in manufacturing environments
- **Responsive** - Works on desktop, tablet, and mobile devices

## 🔒 Security Considerations

- Input validation on all API endpoints
- Parameterized SQL queries to prevent injection attacks
- CORS configuration for secure cross-origin requests
- Environment-based configuration management

## 📊 Usage Examples

### Creating a Rework Record

```javascript
POST /api/rework
{
  "module_id": "PM-12345",
  "line_number": "Line-A",
  "defect_type": "Soldering",
  "defect_description": "Cold solder joint on capacitor C12",
  "severity": "high",
  "station": "SMT-01",
  "operator_id": "OP-456",
  "date_detected": "2024-02-14"
}
```

### Querying Analytics

```javascript
GET /api/analytics/summary
Response:
{
  "total_reworks": 245,
  "open_reworks": 12,
  "resolved_reworks": 233,
  "pending_actions": 8,
  "total_patterns": 15,
  "high_severity": 23
}
```

## 🛠️ Development

### Backend Development

```bash
cd backend
npm run dev  # Starts with nodemon for auto-reload
```

### Frontend Development

```bash
cd frontend
npm start  # Starts React development server
```

## 📈 Future Enhancements

- Real-time notifications for critical defects
- Advanced ML-based pattern recognition
- Integration with manufacturing execution systems (MES)
- Export functionality for reports
- Multi-language support
- Role-based access control

## 📝 License

Internal use only - Alstom Manufacturing

## 👥 Support

For technical support or feature requests, contact the Manufacturing IT team.

---

**Built for Alstom PM Line Manufacturing Excellence**