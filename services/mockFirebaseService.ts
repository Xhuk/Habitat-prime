// This file mocks a Firebase backend service.
// In a real application, this would be replaced with actual Firebase SDK calls.
import {
  type AuthenticatedUser, type TodoItem, type Notification, type Payment, type BankTransaction,
  type ReconciliationHistory, type Amenity, type Booking, type Guard, type ChatMessage, type PropertyInfo,
  type HabitatConfig, type Provider, type PaymentRequest, type VisitorAuthorizationRequest,
  type AccessLogEntry, type QrCodePayload, type Rating, type Survey, type DirectoryContact, type SurveyOption,
  type ProviderVisit
} from '../types';
import { GoogleGenAI, Type } from "@google/genai";

// MOCK DATABASE
const MOCK_USERS: { [key: string]: AuthenticatedUser } = {
  'user-admin1': { id: 'user-admin1', name: 'Admin General', email: 'admin@habitat.app', role: 'admin', avatarUrl: 'https://i.pravatar.cc/150?u=admin', phone: '555-0101', contactPreferences: { email: true, phone: false } },
  'user-resident1': { id: 'user-resident1', name: 'Residente Demo', email: 'resident@comunidad.com', role: 'resident', property: 'Casa 42', avatarUrl: 'https://i.pravatar.cc/150?u=resident', phone: '555-0102', contactPreferences: { email: true, phone: true }, notificationSettings: { visits: true, payments: true, announcements: true, emergencies: true } },
  'user-guard1': { id: 'user-guard1', name: 'Guardia Nocturno', email: '', role: 'guardia', avatarUrl: 'https://i.pravatar.cc/150?u=guard', phone: '555-0103', contactPreferences: { email: false, phone: false } },
};

let MOCK_PAYMENTS: Payment[] = [
  { id: 'pay-1', residentId: 'user-resident1', residentName: 'Residente Demo', property: 'Casa 42', date: new Date(Date.now() - 86400000).toISOString(), amountReported: 1500.00, amountIA: 1500.00, receiptUrl: 'https://placehold.co/600x400/png', paymentMethod: 'transfer', status: 'pending' },
  { id: 'pay-2', residentId: 'user-resident1', residentName: 'Residente Demo', property: 'Casa 42', date: new Date(Date.now() - 172800000).toISOString(), amountReported: 250.00, amountIA: 250.00, receiptUrl: 'https://placehold.co/600x400/png', paymentMethod: 'stripe', transactionId: 'pi_12345', status: 'approved' },
  { id: 'pay-3', residentId: 'user-resident1', residentName: 'Residente Demo', property: 'Casa 42', date: new Date(Date.now() - 259200000).toISOString(), amountReported: 1500.00, amountIA: 1500.00, receiptUrl: 'https://placehold.co/600x400/png', paymentMethod: 'transfer', status: 'reconciled' },
];

let MOCK_BANK_TRANSACTIONS: BankTransaction[] = [
  { id: 'bt-1', date: new Date(Date.now() - 86400000).toISOString(), description: 'SPEI RECIBIDO RESIDENTE DEMO', amount: 1500.00, reference: 'REF123' },
  { id: 'bt-2', date: new Date(Date.now() - 259200000).toISOString(), description: 'TRANSFERENCIA DE TERCERO', amount: 250.00, reference: 'REF456' },
];

let MOCK_AMENITIES: Amenity[] = [
    { id: 'amen-1', name: 'Salón de Usos Múltiples', description: 'Ideal para eventos y reuniones. Equipado con mesas, sillas y proyector.', imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4b248q?q=80&w=1974&auto=format&fit=crop', cost: 500, bookingBlockHours: 4, maxRentalsPerDay: 2, capacity: 50, cleaningOptions: { type: 'extra_cost', extraCost: 250 } },
    { id: 'amen-2', name: 'Cancha de Pádel', description: 'Disfruta de un partido en nuestra cancha profesional.', imageUrl: 'https://images.unsplash.com/photo-1598453496352-70894275a5a2?q=80&w=2070&auto=format&fit=crop', cost: 100, bookingBlockHours: 1, maxRentalsPerDay: 8, capacity: 4, cleaningOptions: { type: 'included' } },
];

let MOCK_AUTHORIZATION_REQUESTS: VisitorAuthorizationRequest[] = [];
let MOCK_ACCESS_LOG: AccessLogEntry[] = [];
let MOCK_ACTIVE_QRS: QrCodePayload[] = [];
// FIX: Added initial mock notifications.
let MOCK_NOTIFICATIONS: Notification[] = [
    { id: 'notif-1', recipientId: 'user-admin1', title: 'Pago por Conciliar', description: 'Residente Demo ha enviado un pago de $1500.00', date: new Date(Date.now() - 3600000).toISOString(), isRead: false, type: 'payment' },
    { id: 'notif-2', recipientId: 'user-admin1', title: 'Nueva Reserva', description: 'Residente Demo ha reservado el Salón de Usos Múltiples', date: new Date(Date.now() - 7200000).toISOString(), isRead: true, type: 'booking' },
    { id: 'notif-3', recipientId: 'user-admin1', title: 'Acceso de proveedor', description: 'Plomería Express visitará hoy', date: new Date(Date.now() - 10800000).toISOString(), isRead: true, type: 'provider' },
    { id: 'notif-4', recipientId: 'user-admin1', title: 'Visita no anunciada', description: 'Juan Pérez está en caseta', date: new Date(Date.now() - 14400000).toISOString(), isRead: false, type: 'visit' },
];
let MOCK_PROVIDER_VISITS: ProviderVisit[] = [];


const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

// UTILITY
const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

// AUTH
export const getCurrentUser = async (): Promise<AuthenticatedUser | null> => {
    await simulateDelay(200);
    const userId = localStorage.getItem('habitatUser');
    return userId ? MOCK_USERS[userId] : null;
};

export const login = async (email: string, password: string): Promise<AuthenticatedUser> => {
    await simulateDelay(1000);
    const user = Object.values(MOCK_USERS).find(u => u.email === email);

    if (user) {
        if(user.role === 'admin' && password === 'admin') {
            localStorage.setItem('habitatUser', user.id);
            return user;
        }
        if(user.role === 'resident' && password === 'password') {
            localStorage.setItem('habitatUser', user.id);
            return user;
        }
    }
    throw new Error('Credenciales inválidas.');
};

export const loginWithAccessCode = async (code: string): Promise<AuthenticatedUser> => {
    await simulateDelay(1000);
    if (code === '123456') {
        const user = MOCK_USERS['user-guard1'];
        localStorage.setItem('habitatUser', user.id);
        return user;
    }
    throw new Error('Código de acceso incorrecto.');
};

export const logout = async (): Promise<void> => {
    await simulateDelay(200);
    localStorage.removeItem('habitatUser');
};

// FIX: Added getTodos and getNotifications functions.
// TODOS & NOTIFICATIONS (for Header)
export const getTodos = async (): Promise<TodoItem[]> => {
    await simulateDelay(300);
    const todos: TodoItem[] = [];
    const pendingPayments = MOCK_PAYMENTS.filter(p => p.status === 'pending').length;
    if (pendingPayments > 0) {
        todos.push({
            id: 'todo-payments',
            title: `${pendingPayments} ${pendingPayments === 1 ? 'pago' : 'pagos'} por conciliar`,
            description: 'Revisa y aprueba los pagos pendientes.',
            type: 'payment'
        });
    }
    const pendingBookings = MOCK_BOOKINGS.filter(b => b.status === 'pending' || b.status === 'pending_approval').length;
    if (pendingBookings > 0) {
        todos.push({
            id: 'todo-bookings',
            title: `${pendingBookings} ${pendingBookings === 1 ? 'reserva' : 'reservas'} por aprobar`,
            description: 'Confirma las nuevas solicitudes de amenidades.',
            type: 'booking'
        });
    }
    return todos;
};

export const getNotifications = async (): Promise<Notification[]> => {
    await simulateDelay(400);
    // In a real app this would be for the current user
    return MOCK_NOTIFICATIONS;
};


// PAYMENTS
export const getPayments = async (): Promise<Payment[]> => {
    await simulateDelay(1000);
    return MOCK_PAYMENTS.filter(p => p.status === 'pending');
};

export const getPaymentsForResident = async (residentId: string): Promise<Payment[]> => {
    await simulateDelay(800);
    return MOCK_PAYMENTS.filter(p => p.residentId === residentId);
};


export const approvePayment = async (id: string): Promise<void> => {
    await simulateDelay(500);
    const payment = MOCK_PAYMENTS.find(p => p.id === id);
    if (payment) {
        payment.status = 'approved';
        createNotification({
            recipientId: payment.residentId,
            title: 'Pago Aprobado',
            description: `Tu pago de $${payment.amountReported.toFixed(2)} ha sido aprobado.`,
            type: 'payment',
            isPush: true
        });
    }
};

export const rejectPayment = async (id: string): Promise<void> => {
    await simulateDelay(500);
    const payment = MOCK_PAYMENTS.find(p => p.id === id);
    if (payment) payment.status = 'rejected';
};

export const reconcilePayment = async (paymentId: string, transactionId: string, reconciledBy: string): Promise<void> => {
    await simulateDelay(800);
    const payment = MOCK_PAYMENTS.find(p => p.id === paymentId);
    if (payment) payment.status = 'reconciled';
};

export const getBankTransactions = async (): Promise<BankTransaction[]> => {
    await simulateDelay(500);
    return MOCK_BANK_TRANSACTIONS;
};

export const addBankTransactions = async (transactions: Omit<BankTransaction, 'id'>[]): Promise<void> => {
    await simulateDelay(500);
    const newTxs = transactions.map((t, i) => ({ ...t, id: `new-bt-${Date.now()}-${i}`}));
    MOCK_BANK_TRANSACTIONS.push(...newTxs);
};

export const getReconciliationHistory = async (): Promise<ReconciliationHistory[]> => {
    await simulateDelay(1200);
    return MOCK_PAYMENTS.filter(p => p.status === 'reconciled').map(p => ({
        id: `rh-${p.id}`,
        reconciledDate: new Date().toISOString(),
        residentName: p.residentName,
        property: p.property,
        amount: p.amountReported,
        reconciledBy: 'Admin User',
        paymentId: p.id,
        transactionId: 'bt-mock-id',
    }));
};

export const processImageWithGemini = async (imageUrl: string): Promise<number> => {
    await simulateDelay(1500); 
    const baseAmount = parseFloat((Math.random() * 100 + 1450).toFixed(2));
    return baseAmount;
};

export const processBankStatementWithGemini = async (fileContent: string): Promise<Omit<BankTransaction, 'id'>[]> => {
  await simulateDelay(2000);
  return [
    { date: new Date().toISOString(), description: 'IA: SPEI FROM NEW BANK', amount: 1500.00, reference: 'GEMINI1' },
    { date: new Date().toISOString(), description: 'IA: OXXO DEPOSIT', amount: 250.00, reference: 'GEMINI2' },
  ];
};

// AMENITIES & BOOKINGS
export const getAmenities = async (): Promise<Amenity[]> => {
    await simulateDelay(800);
    return MOCK_AMENITIES;
};

export const updateAmenity = async (amenity: Amenity): Promise<void> => {
    await simulateDelay(600);
    const index = MOCK_AMENITIES.findIndex(a => a.id === amenity.id);
    if (index > -1) {
        MOCK_AMENITIES[index] = amenity;
    }
};

let MOCK_BOOKINGS: Booking[] = [
    { id: 'book-1', amenityId: 'amen-1', amenityName: 'Salón de Usos Múltiples', residentId: 'user-resident1', residentName: 'Residente Demo', property: 'Casa 42', date: '2024-08-15', startTime: '15:00', endTime: '19:00', status: 'pending', cost: 500, cleaningCost: 250 },
];

export const getBookings = async (): Promise<Booking[]> => {
    await simulateDelay(700);
    return MOCK_BOOKINGS;
};

export const getAvailableSlots = async (amenity: Amenity, date: Date): Promise<string[]> => {
    await simulateDelay(500);
    // Mock logic: return some slots
    return ['09:00 - 10:00', '11:00 - 12:00', '15:00 - 16:00'];
};

export const createBooking = async (amenity: Amenity, date: string, timeSlot: string, userId: string): Promise<Booking> => {
    await simulateDelay(800);
    const [startTime, endTime] = timeSlot.split(' - ');
    const cleaningCost = amenity.cleaningOptions.type === 'extra_cost' ? amenity.cleaningOptions.extraCost || 0 : 0;
    const newBooking: Booking = {
        id: `book-${Date.now()}`,
        amenityId: amenity.id,
        amenityName: amenity.name,
        residentId: userId,
        residentName: MOCK_USERS[userId]?.name || 'Unknown',
        property: MOCK_USERS[userId]?.property || 'N/A',
        date,
        startTime,
        endTime,
        status: amenity.cost > 0 ? 'pending_payment' : 'pending',
        cost: amenity.cost,
        cleaningCost
    };
    MOCK_BOOKINGS.push(newBooking);
    createNotification({
        recipientId: 'admins',
        title: 'Nueva Reserva de Amenidad',
        description: `${newBooking.residentName} ha solicitado reservar ${newBooking.amenityName}.`,
        type: 'booking'
    });
    return newBooking;
};

export const addAmenityPaymentReceipt = async (bookingId: string, receiptUrl: string): Promise<void> => {
    await simulateDelay(500);
    const booking = MOCK_BOOKINGS.find(b => b.id === bookingId);
    if(booking) {
        booking.receiptUrl = receiptUrl;
        booking.status = 'pending_approval';
    }
};

export const createPayment = async(paymentRequest: PaymentRequest): Promise<void> => {
    await simulateDelay(1000);
    const resident = MOCK_USERS[paymentRequest.residentId];
    const newPayment: Payment = {
        id: `pay-${Date.now()}`,
        residentId: paymentRequest.residentId,
        residentName: resident?.name || 'Unknown',
        property: resident?.property || 'N/A',
        date: new Date().toISOString(),
        amountReported: paymentRequest.amount,
        amountIA: null,
        receiptUrl: paymentRequest.receiptUrl || undefined,
        paymentMethod: paymentRequest.paymentMethod,
        transactionId: paymentRequest.paymentMethod === 'stripe' ? `pi_${Date.now()}` : undefined,
        status: paymentRequest.paymentMethod === 'stripe' ? 'approved' : 'pending',
    };
    MOCK_PAYMENTS.unshift(newPayment);
    createNotification({
        recipientId: 'admins',
        title: 'Nuevo Pago Registrado',
        description: `${newPayment.residentName} ha registrado un pago de $${newPayment.amountReported.toFixed(2)}.`,
        type: 'payment'
    });
};

// CHAT
export const getChatMessages = async (contactId: string): Promise<ChatMessage[]> => {
    await simulateDelay(500);
    return [
        { id: 'msg-1', senderId: 'user-resident1', receiverId: 'user-admin1', text: 'Hola, tengo una duda sobre mi estado de cuenta.', timestamp: new Date(Date.now() - 5 * 60000).toISOString() },
        { id: 'msg-2', senderId: 'user-admin1', receiverId: 'user-resident1', text: '¡Hola! Claro, dime cuál es tu duda.', timestamp: new Date(Date.now() - 4 * 60000).toISOString() },
    ];
};

export const sendChatMessage = async (text: string, receiverId: string, sender: AuthenticatedUser): Promise<ChatMessage> => {
    await simulateDelay(300);
    const newMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        senderId: sender.id,
        receiverId,
        text,
        timestamp: new Date().toISOString(),
    };
    return newMessage;
};

// RESIDENT INFO
export const getPropertyInfo = async (userId: string): Promise<PropertyInfo> => {
    await simulateDelay(900);
    const user = MOCK_USERS[userId];
    if (!user || user.role !== 'resident') throw new Error("User not found or not a resident.");
    const balance = MOCK_PAYMENTS.filter(p => p.residentId === userId && (p.status === 'pending' || p.status === 'rejected')).reduce((sum, p) => sum + p.amountReported, 0);
    return {
        address: user.property || 'N/A',
        owner: user.name,
        residents: [user.name],
        outstandingBalance: balance,
        paymentHistory: MOCK_PAYMENTS.filter(p => p.residentId === userId),
    };
};

// CONFIG
let MOCK_CONFIG: HabitatConfig = {
    packageManagement: 'gate',
    accessControl: { 
        deliveryHours: 1, 
        socialVisitDefaultHours: 8,
        socialVisitMaxDays: 7,
        serviceDefaultHours: 8
    },
    stripe: { isEnabled: true, accountId: 'acct_123456789' }
};

export const getHabitatConfig = async (): Promise<HabitatConfig> => {
    await simulateDelay(200);
    return MOCK_CONFIG;
};

export const updateHabitatConfig = async (config: HabitatConfig): Promise<void> => {
    await simulateDelay(500);
    MOCK_CONFIG = config;
};

// GUARDS
export const getGuards = async (): Promise<Guard[]> => {
    await simulateDelay(600);
    return [
        { id: 'guard-1', name: 'Carlos Rodriguez', shift: 'day', lastCheckIn: new Date().toISOString(), status: 'active' },
        { id: 'guard-2', name: 'Luis Hernandez', shift: 'night', lastCheckIn: new Date(Date.now() - 8 * 3600000).toISOString(), status: 'active' },
    ];
};

// ACCESS
export const createVisitorAuthorizationRequest = async (visitorName: string, idPhotoUrl: string, residentId: string): Promise<void> => {
    await simulateDelay(800);
    const resident = Object.values(MOCK_USERS).find(u => u.id === residentId);
    if (!resident) throw new Error("Resident not found");

    const newRequest: VisitorAuthorizationRequest = {
        id: `auth-${Date.now()}`,
        visitorName,
        idPhotoUrl,
        visitDate: new Date().toISOString(),
        residentId,
        residentName: resident.name,
        property: resident.property || 'N/A',
        status: 'pending'
    };
    MOCK_AUTHORIZATION_REQUESTS.push(newRequest);

    createNotification({
        recipientId: residentId,
        title: 'Visita no anunciada',
        description: `${visitorName} se encuentra en caseta. ¿Autorizas el acceso?`,
        type: 'visit',
        isPush: true
    });
};

export const getPendingAuthorizationsForResident = async (residentId: string): Promise<VisitorAuthorizationRequest[]> => {
    await simulateDelay(500);
    return MOCK_AUTHORIZATION_REQUESTS.filter(r => r.residentId === residentId && r.status === 'pending');
};

export const getAllAuthorizationRequests = async (): Promise<VisitorAuthorizationRequest[]> => {
    await simulateDelay(700);
    return MOCK_AUTHORIZATION_REQUESTS;
}

export const updateAuthorizationStatus = async (requestId: string, status: 'approved' | 'rejected'): Promise<void> => {
    await simulateDelay(500);
    const request = MOCK_AUTHORIZATION_REQUESTS.find(r => r.id === requestId);
    if (request) {
        request.status = status;
        createNotification({
            recipientId: 'guards',
            title: `Acceso ${status === 'approved' ? 'Aprobado' : 'Rechazado'}`,
            description: `El acceso para ${request.visitorName} a la propiedad ${request.property} fue ${status === 'approved' ? 'aprobado' : 'rechazado'}.`,
            type: 'visit'
        });
    }
};

export const logAccessEvent = async(log: Omit<AccessLogEntry, 'id' | 'timestamp'>): Promise<void> => {
    await simulateDelay(200);
    const newLog: AccessLogEntry = {
        ...log,
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
    };
    MOCK_ACCESS_LOG.unshift(newLog); // Add to the top
};

export const getAccessLog = async(): Promise<AccessLogEntry[]> => {
    await simulateDelay(500);
    return MOCK_ACCESS_LOG;
};

export const getResidents = async (): Promise<{ id: string, name: string, property: string }[]> => {
    await simulateDelay(400);
    return Object.values(MOCK_USERS)
        .filter(u => u.role === 'resident')
        .map(u => ({ id: u.id, name: u.name, property: u.property || 'N/A' }));
};

export const getActiveQrsForResident = async (residentId: string): Promise<QrCodePayload[]> => {
    await simulateDelay(400);
    return MOCK_ACTIVE_QRS.filter(qr => qr.residentName === MOCK_USERS[residentId]?.name);
}


// PROVIDERS
let MOCK_PROVIDERS: Provider[] = [
    { id: 'prov-1', name: 'Plomería Express', serviceCategory: 'Plomería', contactName: 'Mario Lopez', phone: '555-1234', isWhitelisted: true, averageRating: 4.8, ratings: [{userId: 'user-resident1', userName: 'Residente Demo', rating: 5, tags: ['A tiempo', 'Trabajo impecable']}], servesCommunity: true, servesResidents: true, tagCounts: { 'A tiempo': 1, 'Trabajo impecable': 1 } },
    { id: 'prov-2', name: 'Jardinería El Trébol', serviceCategory: 'Jardinería', contactName: 'Ana Martinez', phone: '555-5678', isWhitelisted: true, averageRating: 4.5, ratings: [{userId: 'user-resident1', userName: 'Residente Demo', rating: 4, comment: 'Buen servicio'}], servesCommunity: true, servesResidents: false },
    { id: 'prov-3', name: 'Internet Rápido SA', serviceCategory: 'Internet', contactName: 'Luis García', phone: '555-9012', isWhitelisted: false, averageRating: 3.5, ratings: [{userId: 'user-resident1', userName: 'Residente Demo', rating: 3, comment: 'Tardaron mucho en instalar'}], servesCommunity: false, servesResidents: true },
];

export const getProviders = async(): Promise<Provider[]> => {
    await simulateDelay(700);
    return MOCK_PROVIDERS;
};

export const addProvider = async(providerData: Omit<Provider, 'id' | 'ratings' | 'averageRating'>): Promise<Provider> => {
    await simulateDelay(500);
    const newProvider: Provider = {
        ...providerData,
        id: `prov-${Date.now()}`,
        ratings: [],
        averageRating: 0,
    };
    MOCK_PROVIDERS.push(newProvider);
    return newProvider;
};

export const updateProviderWhitelistStatus = async(providerId: string, isWhitelisted: boolean): Promise<void> => {
    await simulateDelay(300);
    const provider = MOCK_PROVIDERS.find(p => p.id === providerId);
    if(provider) {
        provider.isWhitelisted = isWhitelisted;
    }
};

export const addProviderRating = async(providerId: string, rating: Rating): Promise<void> => {
    await simulateDelay(600);
    const provider = MOCK_PROVIDERS.find(p => p.id === providerId);
    if (provider) {
        provider.ratings.push(rating);
        provider.averageRating = provider.ratings.reduce((acc, r) => acc + r.rating, 0) / provider.ratings.length;
        
        // Update tag counts
        if (rating.tags) {
            if (!provider.tagCounts) provider.tagCounts = {};
            rating.tags.forEach(tag => {
                provider.tagCounts![tag] = (provider.tagCounts![tag] || 0) + 1;
            });
        }
    }
};

// COMMUNITY
let MOCK_SURVEYS: Survey[] = [
    { id: 'surv-1', question: '¿De qué color pintamos la fachada?', options: [ {id: 'opt1', text: 'Blanco', votes: 15}, {id: 'opt2', text: 'Beige', votes: 25} ], status: 'closed', totalVotes: 40 },
    { id: 'surv-2', question: '¿Deberíamos instalar un nuevo gimnasio?', options: [ {id: 'opt3', text: 'Sí, es necesario', votes: 30}, {id: 'opt4', text: 'No, es muy costoso', votes: 10} ], status: 'active', totalVotes: 40 },
];
let MOCK_ANNOUNCEMENTS = [
    { id: 1, title: 'Mantenimiento de Alberca', date: new Date(Date.now() - 86400000 * 2).toISOString(), content: 'Se realizará mantenimiento a la alberca el próximo Lunes. No estará disponible de 9am a 5pm.', author: 'Admin General' },
];
let MOCK_DIRECTORY_CONTACTS: DirectoryContact[] = [
    { id: 'dir-1', category: 'Administración', name: 'Admin General', role: 'Administrador', phone: '555-0101', email: 'admin@habitat.app' },
    { id: 'dir-2', category: 'Seguridad', name: 'Caseta Principal', role: 'Vigilancia', phone: '555-0103', email: 'seguridad@habitat.app' },
];

export const getAnnouncements = async () => {
    await simulateDelay(400);
    return MOCK_ANNOUNCEMENTS;
};
export const getSurveys = async (): Promise<Survey[]> => {
    await simulateDelay(500);
    return MOCK_SURVEYS;
};
export const getDirectory = async(): Promise<DirectoryContact[]> => {
    await simulateDelay(300);
    return MOCK_DIRECTORY_CONTACTS;
};

export const submitSurveyVote = async(surveyId: string, optionId: string): Promise<void> => {
    await simulateDelay(400);
    const survey = MOCK_SURVEYS.find(s => s.id === surveyId);
    const option = survey?.options.find(o => o.id === optionId);
    if(option) {
        option.votes += 1;
        survey!.totalVotes += 1;
    }
};

export const deleteCommunication = async(id: number): Promise<void> => {
    await simulateDelay(300);
    MOCK_ANNOUNCEMENTS = MOCK_ANNOUNCEMENTS.filter(a => a.id !== id);
};

export const addSurvey = async(question: string, options: string[]): Promise<void> => {
    await simulateDelay(500);
    const newSurvey: Survey = {
        id: `surv-${Date.now()}`,
        question,
        options: options.map((opt, i) => ({ id: `opt-${Date.now()}-${i}`, text: opt, votes: 0 })),
        status: 'active',
        totalVotes: 0
    };
    MOCK_SURVEYS.push(newSurvey);
};
export const closeSurvey = async(id: string): Promise<void> => {
    await simulateDelay(300);
    const survey = MOCK_SURVEYS.find(s => s.id === id);
    if(survey) survey.status = 'closed';
};
export const deleteSurvey = async(id: string): Promise<void> => {
    await simulateDelay(300);
    MOCK_SURVEYS = MOCK_SURVEYS.filter(s => s.id !== id);
};

export const addDirectoryContact = async(contact: Omit<DirectoryContact, 'id'>): Promise<void> => {
    await simulateDelay(400);
    MOCK_DIRECTORY_CONTACTS.push({ ...contact, id: `dir-${Date.now()}` });
};
export const updateDirectoryContact = async(contact: DirectoryContact): Promise<void> => {
    await simulateDelay(400);
    const index = MOCK_DIRECTORY_CONTACTS.findIndex(c => c.id === contact.id);
    if(index > -1) MOCK_DIRECTORY_CONTACTS[index] = contact;
};
export const deleteDirectoryContact = async(id: string): Promise<void> => {
    await simulateDelay(300);
    MOCK_DIRECTORY_CONTACTS = MOCK_DIRECTORY_CONTACTS.filter(c => c.id !== id);
};

// NOTIFICATIONS
const createNotification = (details: Omit<Notification, 'id' | 'date' | 'isRead'>) => {
    const user = MOCK_USERS[details.recipientId];
    if (details.isPush && user?.role === 'resident') {
        const settings = user.notificationSettings;
        if(details.type === 'visit' && !settings?.visits) return;
        if(details.type === 'payment' && !settings?.payments) return;
        if(details.type === 'announcement' && !settings?.announcements) return;
    }

    const newNotif: Notification = {
        ...details,
        id: `notif-${Date.now()}`,
        date: new Date().toISOString(),
        isRead: false
    };
    MOCK_NOTIFICATIONS.unshift(newNotif);
};

export const getNotificationsForUser = async(userId: string): Promise<Notification[]> => {
    await simulateDelay(500);
    const user = MOCK_USERS[userId];
    if (!user) return [];
    return MOCK_NOTIFICATIONS.filter(n => 
        n.recipientId === userId || 
        n.recipientId === 'all' ||
        (n.recipientId === 'admins' && user.role === 'admin') ||
        (n.recipientId === 'guards' && user.role === 'guardia')
    );
};

export const markNotificationAsRead = async (id: string): Promise<void> => {
    await simulateDelay(100);
    const notif = MOCK_NOTIFICATIONS.find(n => n.id === id);
    if(notif) notif.isRead = true;
};

export const markAllNotificationsAsRead = async (userId: string): Promise<void> => {
    await simulateDelay(300);
    const user = MOCK_USERS[userId];
    if (!user) return;
    MOCK_NOTIFICATIONS.forEach(n => {
         if(n.recipientId === userId || n.recipientId === 'all' || (n.recipientId === 'admins' && user.role === 'admin') || (n.recipientId === 'guards' && user.role === 'guardia')) {
            n.isRead = true;
        }
    });
};

export const getUserNotificationSettings = async (userId: string): Promise<AuthenticatedUser['notificationSettings']> => {
    await simulateDelay(300);
    return MOCK_USERS[userId]?.notificationSettings;
};

export const updateUserNotificationSettings = async (userId: string, settings: AuthenticatedUser['notificationSettings']): Promise<void> => {
    await simulateDelay(400);
    if (MOCK_USERS[userId]) {
        MOCK_USERS[userId].notificationSettings = settings;
    }
};

export const scheduleProviderVisit = async (visit: Omit<ProviderVisit, 'id'>): Promise<void> => {
    await simulateDelay(500);
    MOCK_PROVIDER_VISITS.push({ ...visit, id: `pvis-${Date.now()}` });
    createNotification({
        recipientId: 'guards',
        title: 'Visita de Proveedor Agendada',
        description: `${visit.providerName} visitará el ${visit.date} a las ${visit.time}.`,
        type: 'provider'
    });
     createNotification({
        recipientId: 'admins',
        title: 'Visita de Proveedor Agendada',
        description: `${visit.providerName} visitará el ${visit.date} a las ${visit.time}.`,
        type: 'provider'
    });
};

export const getProviderVisits = async(): Promise<ProviderVisit[]> => {
    await simulateDelay(600);
    return MOCK_PROVIDER_VISITS;
};

// LICENSE
const MOCK_LICENSES: Record<string, number> = {
  'HAV-YEAR-DEMO-ADMIN': 365,
  'HAV-MONTH-DEMO-ADMIN': 30,
};

export const validateAndApplyLicenseKey = async (key: string): Promise<{ expiresAt: string }> => {
  await simulateDelay(1000);
  const durationDays = MOCK_LICENSES[key];
  if (durationDays === undefined) {
    throw new Error('La clave de licencia no es válida o ya ha sido utilizada.');
  }
  const now = new Date();
  // Set time to the end of the day for consistency
  now.setHours(23, 59, 59, 999);
  const expiryDate = new Date(now.setDate(now.getDate() + durationDays));
  
  return { expiresAt: expiryDate.toISOString() };
};