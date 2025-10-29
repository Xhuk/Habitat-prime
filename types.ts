export type Role = 'admin' | 'resident' | 'guardia';

export type View =
  | 'dashboard'
  | 'pagos'
  | 'conciliaciones'
  | 'reservas'
  | 'amenidades'
  | 'comunidad'
  | 'proveedores'
  | 'guardias'
  | 'directorio'
  | 'chat'
  | 'configuracion'
  | 'financiero';

export type ResidentView = 
  | 'inicio' 
  | 'accesos' 
  | 'finanzas' 
  | 'comunidad' 
  | 'más' 
  | 'paqueteria' 
  | 'amenidades' 
  | 'soporte' 
  | 'perfil'
  | 'notificaciones'
  | 'marketplace';


export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl: string;
  phone: string;
  property?: string;
  contactPreferences: {
    email: boolean;
    phone: boolean;
  };
   notificationSettings?: {
    visits: boolean;
    payments: boolean;
    announcements: boolean;
    emergencies: boolean;
  };
}

export interface TodoItem {
  id: string;
  title: string;
  description: string;
  type: 'payment' | 'booking' | 'task';
}

export interface Notification {
  id: string;
  recipientId: 'all' | 'admins' | 'guards' | string; // User ID or role
  title: string;
  description: string;
  date: string; // ISO string
  isRead: boolean;
  isPush?: boolean;
  type: 'payment' | 'booking' | 'announcement' | 'package' | 'visit' | 'provider';
}

export interface Payment {
  id: string;
  residentId: string;
  residentName: string;
  property: string;
  date: string; // ISO string
  amountReported: number;
  amountIA: number | null;
  receiptUrl?: string;
  paymentMethod: 'stripe' | 'transfer';
  transactionId?: string;
  status: 'pending' | 'reconciled' | 'rejected' | 'approved';
}

export interface BankTransaction {
  id: string;
  date: string; // ISO string
  description: string;
  amount: number;
  reference: string;
}

export interface CleaningOptions {
  type: 'included' | 'extra_cost' | 'self_clean';
  extraCost?: number;
  selfCleanInstructions?: string;
}

export interface Amenity {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  cost: number;
  bookingBlockHours: number;
  maxRentalsPerDay: number;
  capacity: number;
  cleaningOptions: CleaningOptions;
}

export interface Booking {
  id: string;
  amenityId: string;
  amenityName: string;
  residentId: string;
  residentName: string;
  property: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  status: 'confirmed' | 'pending' | 'cancelled' | 'pending_payment' | 'pending_approval';
  cost: number;
  cleaningCost: number;
  receiptUrl?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string; // ISO string
}

export interface ReconciliationHistory {
    id: string;
    reconciledDate: string; // ISO string
    residentName: string;
    property: string;
    amount: number;
    reconciledBy: string;
    paymentId: string;
    transactionId: string;
}

export interface PropertyInfo {
    address: string;
    owner: string;
    residents: string[];
    outstandingBalance: number;
    paymentHistory: Payment[];
}

export interface AccessControlConfig {
    deliveryHours: number;
    socialVisitDefaultHours: number;
    socialVisitMaxDays: number;
    serviceDefaultHours: number;
}

export interface HabitatConfig {
    packageManagement: 'gate' | 'direct';
    accessControl: AccessControlConfig;
    stripe: {
        isEnabled: boolean;
        accountId: string;
    };
}

export interface Guard {
    id: string;
    name: string;
    shift: 'day' | 'night' | 'mixed';
    lastCheckIn: string; // ISO string
    status: 'active' | 'inactive' | 'on-break';
}

export interface VisitorAuthorizationRequest {
    id: string;
    visitorName: string;
    idPhotoUrl: string;
    visitDate: string; // ISO string
    residentId: string;
    residentName: string;
    property: string;
    status: 'pending' | 'approved' | 'rejected';
}

export interface QrCodePayload {
    type: 'visitor' | 'delivery' | 'service';
    name?: string;
    residentName: string;
    property: string;
    validFrom: string; // ISO Date
    validUntil: string; // ISO Date
    days?: number[]; // For service, 0=Sun, 1=Mon...
    timeFrom?: string; // HH:mm
    timeTo?: string; // HH:mm
    status?: 'active' | 'used' | 'expired';
}

export interface AccessLogEntry {
    id: string;
    timestamp: string; // ISO string
    qrData: string;
    result: 'granted' | 'denied';
    reason?: string;
    guardName: string;
}

export interface Rating {
    userId: string;
    userName: string;
    rating: number;
    comment?: string;
    tags?: string[];
}

export interface Provider {
    id: string;
    name: string;
    serviceCategory: string;
    contactName: string;
    phone: string;
    description?: string;
    isWhitelisted: boolean;
    ratings: Rating[];
    averageRating: number;
    servesCommunity: boolean;
    servesResidents: boolean;
    tagCounts?: Record<string, number>;
}

export interface PaymentRequest {
    residentId: string;
    amount: number;
    paymentMethod: 'stripe' | 'transfer';
    receiptUrl?: string;
}

export interface SurveyOption {
    id: string;
    text: string;
    votes: number;
}

export interface Survey {
    id: string;
    question: string;
    options: SurveyOption[];
    status: 'active' | 'closed';
    totalVotes: number;
}

export interface DirectoryContact {
    id?: string;
    category: string;
    name: string;
    role: string;
    phone: string;
    email: string;
}

export interface ProviderVisit {
    id: string;
    providerId: string;
    providerName: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:mm
    notes?: string;
}

export interface LicenseInfo {
  key: string;
  expiresAt: string; // ISO Date string
}
