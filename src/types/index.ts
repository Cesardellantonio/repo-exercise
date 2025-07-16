export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  vin?: string;
  licensePlate?: string;
  mileage: number;
  color?: string;
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  lastService?: Date;
  nextService?: Date;
  status: 'active' | 'maintenance' | 'storage' | 'sold';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  type: 'oil_change' | 'tire_rotation' | 'brake_inspection' | 'tune_up' | 'repair' | 'other';
  description: string;
  cost: number;
  mileage: number;
  performedBy: string;
  date: Date;
  nextDue?: Date;
  parts?: string[];
  notes?: string;
  createdAt: Date;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'oil' | 'filters' | 'tires' | 'tools' | 'parts' | 'fluids' | 'other';
  brand?: string;
  partNumber?: string;
  quantity: number;
  minQuantity: number;
  unitPrice: number;
  location?: string;
  supplier?: string;
  lastRestocked?: Date;
  expiryDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type: 'text' | 'action' | 'data';
  metadata?: {
    vehicleId?: string;
    maintenanceId?: string;
    inventoryId?: string;
    actionType?: string;
    confidence?: number;
  };
}

export interface AIAction {
  type: 'schedule_maintenance' | 'add_vehicle' | 'update_inventory' | 'search_vehicles' | 'get_recommendations';
  parameters: Record<string, any>;
  confidence: number;
}

export interface Notification {
  id: string;
  type: 'maintenance_due' | 'low_inventory' | 'inspection_due' | 'service_reminder' | 'info';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export interface GarageStats {
  totalVehicles: number;
  activeVehicles: number;
  overdueMaintenance: number;
  lowInventoryItems: number;
  monthlyMaintenanceCost: number;
  upcomingServices: number;
}