# AI Garage Manager 🚗🤖

An intelligent garage management system with a chat-first interface powered by AI. Manage your vehicles, track maintenance, monitor inventory, and get smart recommendations through natural language conversations.

## Features

### 🤖 AI-Powered Chat Interface
- Natural language processing for garage management tasks
- Intelligent responses and recommendations
- Context-aware conversations about vehicles and maintenance

### 🚗 Vehicle Management
- Track multiple vehicles with detailed information
- Monitor mileage, service history, and status
- Automatic maintenance scheduling and reminders

### 🔧 Maintenance Tracking
- Complete service history for each vehicle
- Automated maintenance reminders
- Cost tracking and analysis
- Service provider management

### 📦 Inventory Management
- Parts and supplies inventory tracking
- Low stock alerts and reorder suggestions
- Cost management and supplier information
- Location tracking for organized storage

### 📊 Smart Analytics
- Performance insights and cost analysis
- Predictive maintenance recommendations
- Usage patterns and optimization suggestions
- Monthly and yearly reporting

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

## Usage

### Getting Started
1. The AI will greet you with a welcome message
2. Try asking questions like:
   - "What's my garage status?"
   - "Check maintenance schedule"
   - "Show inventory levels"
   - "Add a new vehicle"
   - "Schedule oil change"

### Sample Interactions
- **"How many vehicles do I have?"** - Get a count and list of your vehicles
- **"What maintenance is due?"** - Check upcoming and overdue services
- **"Show me low inventory items"** - Review parts that need restocking
- **"Add a 2021 Toyota Prius"** - Start the process to add a new vehicle
- **"Schedule maintenance for my Honda"** - Set up service appointments

## Technology Stack

- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Build Tool:** Vite
- **Storage:** Local Storage (upgradeable to database)
- **AI Processing:** Simulated natural language processing (expandable to real AI APIs)

## Project Structure

```
src/
├── components/          # React components
│   ├── ChatInterface.tsx    # Main chat UI
│   ├── Sidebar.tsx         # Navigation and stats
│   └── QuickActions.tsx    # Action buttons and insights
├── services/           # Business logic
│   └── aiService.ts        # AI processing and data management
├── types/              # TypeScript definitions
│   └── index.ts           # Data models and interfaces
├── hooks/              # Custom React hooks
│   └── useLocalStorage.ts  # Local storage management
└── App.tsx            # Main application component
```

## Features in Detail

### Smart Recommendations
The AI analyzes your garage data to provide:
- Maintenance timing optimization
- Cost-saving opportunities
- Inventory management suggestions
- Performance improvements

### Data Management
- Local storage for immediate use
- Easy migration path to databases
- Export capabilities for reports
- Backup and restore functionality

### Responsive Design
- Works on desktop, tablet, and mobile
- Optimized chat interface for all screen sizes
- Touch-friendly interactions
- Dark mode support (coming soon)

## Customization

The application is designed to be easily customizable:

1. **AI Responses:** Modify `src/services/aiService.ts` to customize AI behavior
2. **Styling:** Update `tailwind.config.js` for theme changes
3. **Data Models:** Extend types in `src/types/index.ts` for additional fields
4. **Components:** Add new components for specialized features

## Future Enhancements

- [ ] Real AI integration (OpenAI, Claude, etc.)
- [ ] Cloud storage and synchronization
- [ ] Mobile app companion
- [ ] Integration with service providers
- [ ] Advanced analytics and reporting
- [ ] Multi-garage support
- [ ] Calendar integration
- [ ] Photo documentation
- [ ] Barcode scanning for parts
- [ ] Cost comparison and recommendations

## Contributing

This is a demonstration project showcasing modern web development practices and AI-driven user interfaces. Feel free to fork and enhance!

## License

MIT License - feel free to use this project as a starting point for your own garage management solution.

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**
