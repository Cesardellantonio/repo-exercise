import { v4 as uuidv4 } from 'uuid';
import { AIAction, ChatMessage, Vehicle, MaintenanceRecord, InventoryItem } from '../types';

// Simulated AI responses - in a real app, this would connect to an AI service
const AI_RESPONSES = {
  greeting: [
    "Hello! I'm your AI garage manager. How can I help you today?",
    "Hi there! I'm here to help manage your garage. What would you like to do?",
    "Welcome to your smart garage! What can I assist you with?"
  ],
  
  maintenance: [
    "I'd be happy to help with maintenance scheduling. What vehicle needs service?",
    "Let me check your maintenance records and schedule. Which car are we working on?",
    "Maintenance is crucial for vehicle longevity. What type of service do you need?"
  ],
  
  inventory: [
    "I can help you manage your parts and supplies. What are you looking for?",
    "Let me check your inventory levels. What items do you need to update?",
    "Keeping track of parts is important. How can I help with your inventory?"
  ],
  
  vehicles: [
    "I can help you manage your vehicle information. What would you like to know?",
    "Let me pull up your garage details. Which vehicle are you asking about?",
    "I have access to all your vehicle data. What do you need to update?"
  ]
};

export class AIService {
  private vehicles: Vehicle[] = [];
  private maintenance: MaintenanceRecord[] = [];
  private inventory: InventoryItem[] = [];

  constructor() {
    this.loadData();
  }

  private loadData() {
    // Load data from localStorage or initialize with sample data
    const savedVehicles = localStorage.getItem('garage_vehicles');
    const savedMaintenance = localStorage.getItem('garage_maintenance');
    const savedInventory = localStorage.getItem('garage_inventory');

    if (savedVehicles) {
      this.vehicles = JSON.parse(savedVehicles);
    } else {
      this.initSampleData();
    }

    if (savedMaintenance) {
      this.maintenance = JSON.parse(savedMaintenance);
    }

    if (savedInventory) {
      this.inventory = JSON.parse(savedInventory);
    }
  }

  private initSampleData() {
    // Add some sample vehicles for demonstration
    this.vehicles = [
      {
        id: uuidv4(),
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        mileage: 45000,
        fuelType: 'gasoline',
        status: 'active',
        licensePlate: 'ABC-123',
        color: 'Silver',
        createdAt: new Date('2023-01-15'),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        make: 'Honda',
        model: 'Civic',
        year: 2019,
        mileage: 52000,
        fuelType: 'gasoline',
        status: 'active',
        licensePlate: 'XYZ-789',
        color: 'Blue',
        lastService: new Date('2024-10-15'),
        nextService: new Date('2025-04-15'),
        createdAt: new Date('2023-03-10'),
        updatedAt: new Date()
      }
    ];

    this.inventory = [
      {
        id: uuidv4(),
        name: 'Motor Oil 5W-30',
        category: 'oil',
        brand: 'Mobil 1',
        quantity: 12,
        minQuantity: 3,
        unitPrice: 24.99,
        location: 'Shelf A-1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Air Filter',
        category: 'filters',
        brand: 'K&N',
        quantity: 2,
        minQuantity: 5,
        unitPrice: 45.99,
        location: 'Shelf B-2',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    this.saveData();
  }

  private saveData() {
    localStorage.setItem('garage_vehicles', JSON.stringify(this.vehicles));
    localStorage.setItem('garage_maintenance', JSON.stringify(this.maintenance));
    localStorage.setItem('garage_inventory', JSON.stringify(this.inventory));
  }

  async processMessage(message: string): Promise<ChatMessage> {
    const lowercaseMessage = message.toLowerCase();
    let response = '';
    let actionType = '';

    // Simple keyword-based AI simulation
    if (this.containsKeywords(lowercaseMessage, ['hello', 'hi', 'hey', 'start'])) {
      response = this.getRandomResponse(AI_RESPONSES.greeting);
      actionType = 'greeting';
    } else if (this.containsKeywords(lowercaseMessage, ['maintenance', 'service', 'oil change', 'repair'])) {
      response = await this.handleMaintenanceQuery(lowercaseMessage);
      actionType = 'maintenance';
    } else if (this.containsKeywords(lowercaseMessage, ['inventory', 'parts', 'stock', 'supplies'])) {
      response = await this.handleInventoryQuery(lowercaseMessage);
      actionType = 'inventory';
    } else if (this.containsKeywords(lowercaseMessage, ['vehicle', 'car', 'truck', 'mileage'])) {
      response = await this.handleVehicleQuery(lowercaseMessage);
      actionType = 'vehicles';
    } else if (this.containsKeywords(lowercaseMessage, ['add', 'new', 'create'])) {
      response = await this.handleAddQuery(lowercaseMessage);
      actionType = 'add';
    } else if (this.containsKeywords(lowercaseMessage, ['status', 'overview', 'summary', 'dashboard'])) {
      response = await this.handleStatusQuery();
      actionType = 'status';
    } else {
      response = "I understand you're asking about garage management. Could you be more specific? I can help with vehicles, maintenance, inventory, or general garage status.";
      actionType = 'clarification';
    }

    return {
      id: uuidv4(),
      content: response,
      sender: 'ai',
      timestamp: new Date(),
      type: 'text',
      metadata: {
        actionType,
        confidence: 0.8
      }
    };
  }

  private containsKeywords(message: string, keywords: string[]): boolean {
    return keywords.some(keyword => message.includes(keyword));
  }

  private getRandomResponse(responses: string[]): string {
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private async handleMaintenanceQuery(message: string): Promise<string> {
    if (message.includes('schedule') || message.includes('due')) {
      const overdueCount = this.vehicles.filter(v => 
        v.nextService && new Date(v.nextService) < new Date()
      ).length;
      
      if (overdueCount > 0) {
        return `You have ${overdueCount} vehicle(s) with overdue maintenance. Would you like me to show you the details or help schedule service appointments?`;
      } else {
        return "All your vehicles are up to date with maintenance! The next scheduled service is in a few weeks. Would you like to see the upcoming maintenance schedule?";
      }
    }
    
    if (message.includes('oil')) {
      return "Oil changes are typically needed every 3,000-5,000 miles depending on your vehicle. Which car needs an oil change? I can help you schedule it and check if we have the right oil in inventory.";
    }
    
    return this.getRandomResponse(AI_RESPONSES.maintenance);
  }

  private async handleInventoryQuery(message: string): Promise<string> {
    const lowItems = this.inventory.filter(item => item.quantity <= item.minQuantity);
    
    if (message.includes('low') || message.includes('order')) {
      if (lowItems.length > 0) {
        const itemNames = lowItems.map(item => item.name).join(', ');
        return `You're running low on: ${itemNames}. Would you like me to create a shopping list or help you reorder these items?`;
      } else {
        return "Your inventory levels look good! All items are above minimum quantities.";
      }
    }
    
    if (message.includes('check') || message.includes('level')) {
      return `You currently have ${this.inventory.length} different items in inventory. ${lowItems.length} items are running low. Would you like to see the full inventory report?`;
    }
    
    return this.getRandomResponse(AI_RESPONSES.inventory);
  }

  private async handleVehicleQuery(message: string): Promise<string> {
    if (message.includes('how many') || message.includes('list')) {
      const activeVehicles = this.vehicles.filter(v => v.status === 'active').length;
      return `You have ${activeVehicles} active vehicles in your garage: ${this.vehicles.map(v => `${v.year} ${v.make} ${v.model}`).join(', ')}. Which one would you like to know more about?`;
    }
    
    if (message.includes('mileage')) {
      const avgMileage = Math.round(this.vehicles.reduce((sum, v) => sum + v.mileage, 0) / this.vehicles.length);
      return `Your vehicles have an average mileage of ${avgMileage.toLocaleString()} miles. Would you like specific mileage information for any particular vehicle?`;
    }
    
    return this.getRandomResponse(AI_RESPONSES.vehicles);
  }

  private async handleAddQuery(message: string): Promise<string> {
    if (message.includes('vehicle') || message.includes('car')) {
      return "I'd be happy to help you add a new vehicle! I'll need some information: make, model, year, current mileage, and license plate. You can tell me these details in your next message.";
    }
    
    if (message.includes('maintenance') || message.includes('service')) {
      return "To add a maintenance record, I'll need: which vehicle, type of service, cost, mileage when performed, and who did the work. What service was completed?";
    }
    
    if (message.includes('inventory') || message.includes('part')) {
      return "To add inventory items, I'll need: item name, category, quantity, minimum stock level, and price. What would you like to add to inventory?";
    }
    
    return "I can help you add vehicles, maintenance records, or inventory items. What would you like to add?";
  }

  private async handleStatusQuery(): Promise<string> {
    const activeVehicles = this.vehicles.filter(v => v.status === 'active').length;
    const overdueCount = this.vehicles.filter(v => 
      v.nextService && new Date(v.nextService) < new Date()
    ).length;
    const lowInventoryCount = this.inventory.filter(item => item.quantity <= item.minQuantity).length;
    
    return `📊 **Garage Status Summary:**
    
🚗 **Vehicles:** ${activeVehicles} active
⚠️ **Overdue Maintenance:** ${overdueCount} vehicles
📦 **Low Inventory:** ${lowInventoryCount} items
💰 **Monthly Costs:** Calculating from recent maintenance...

${overdueCount > 0 ? "⚡ You have overdue maintenance that needs attention!" : "✅ All maintenance is up to date!"}
${lowInventoryCount > 0 ? `📋 You need to restock ${lowInventoryCount} items.` : "✅ Inventory levels are good!"}

What would you like to focus on first?`;
  }

  getVehicles(): Vehicle[] {
    return this.vehicles;
  }

  getInventory(): InventoryItem[] {
    return this.inventory;
  }

  getMaintenance(): MaintenanceRecord[] {
    return this.maintenance;
  }

  addVehicle(vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>): Vehicle {
    const newVehicle: Vehicle = {
      ...vehicle,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.vehicles.push(newVehicle);
    this.saveData();
    return newVehicle;
  }

  updateVehicle(id: string, updates: Partial<Vehicle>): Vehicle | null {
    const index = this.vehicles.findIndex(v => v.id === id);
    if (index !== -1) {
      this.vehicles[index] = { ...this.vehicles[index], ...updates, updatedAt: new Date() };
      this.saveData();
      return this.vehicles[index];
    }
    return null;
  }

  addMaintenanceRecord(record: Omit<MaintenanceRecord, 'id' | 'createdAt'>): MaintenanceRecord {
    const newRecord: MaintenanceRecord = {
      ...record,
      id: uuidv4(),
      createdAt: new Date()
    };
    
    this.maintenance.push(newRecord);
    this.saveData();
    return newRecord;
  }

  updateInventoryItem(id: string, updates: Partial<InventoryItem>): InventoryItem | null {
    const index = this.inventory.findIndex(item => item.id === id);
    if (index !== -1) {
      this.inventory[index] = { ...this.inventory[index], ...updates, updatedAt: new Date() };
      this.saveData();
      return this.inventory[index];
    }
    return null;
  }
}

export const aiService = new AIService();