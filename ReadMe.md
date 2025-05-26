# RentHub 🏠

A modern apartment rental platform that connects landlords and tenants in an intuitive, user-friendly environment.

## 📋 About RentHub

In today's fast-paced world, finding and renting an apartment can be complex and time-consuming. RentHub solves this by providing a seamless platform where users can post available apartments for rent, express interest, and engage in discussions.

## ✨ Key Features

- **User Authentication**: Secure registration and login system for landlords and tenants
- **Property Listings**: Create detailed apartment listings with descriptions, photos, and rental terms
- **Interest Expression**: Mark properties as favorites or send direct inquiries
- **Comments & Replies**: Interactive discussion system on each listing
- **Advanced Search & Filters**: Find properties by location, price range, amenities, and more
- **Responsive Design**: Optimized for all devices - desktop, tablet, and mobile

## 🖼️ Application Screens

- **Home Screen**: Featured carousel and paginated listing section with sort functionality
- **Property Details**: Comprehensive view of property information with comment section
- **User Registration**: Secure signup process with form validation
- **Create Listing**: Detailed form for adding new property listings
- **Search Results**: Filtered view of properties matching user criteria

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm (v9 or later)
- Angular CLI (v19.1.7)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/rent-hub.git
   cd rent-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the backend mock server**
   ```bash
   npm run server
   ```

4. **Start the development server**
   ```bash
   ng serve
   ```

5. Navigate to `http://localhost:4200/` in your browser

## 📁 Project Structure

```
src/
├── app/
│   ├── core/         # Core services, guards, and models
│   ├── features/     # Feature modules (listings, auth, etc.)
│   │   ├── auth/     # Authentication components
│   │   ├── home/     # Home page components
│   │   ├── listings/ # Listing-related components
│   │   └── property/ # Property creation and management
│   ├── shared/       # Shared components and directives
│   └── ...
├── assets/           # Static files (images, fonts)
└── ...
```

## 🛠️ Development Tools

### Code scaffolding

To generate a new component:
```bash
ng generate component component-name
```

For other Angular schematics:
```bash
ng generate --help
```

### Building

```bash
ng build
```

Build artifacts will be stored in the dist directory.

### Running tests

Unit tests:
```bash
ng test
```

End-to-end tests:
```bash
ng e2e
```

## 🔗 Links

- [Deployed Application](https://rent-hub-assignment.netlify.app/)
- [Deployed Backend](https://angularassignment-zrnn.onrender.com)

## 🔐 Demo Credentials

- **Account**
  - Email: admin@admin.com
  - Password: admin1234

- **Tenant Account**
  - Email: jane.smith@example.com
  - Password: password123

## 📝 Bonus Features Implemented

- Preview and Submit screen for new property listings
- Image gallery with multiple photo uploads
- Interactive property map integration
- Real-time comment notifications

## 📊 Evaluation Criteria Met

- ✅ Application Deployed
- ✅ Auth Guards Implemented
- ✅ Complete Routing Implementation
- ✅ Comprehensive Form Validation
- ✅ Intuitive User Interface
- ✅ Responsive Design
- ✅ Code Quality and Best Practices
