export enum Role {
  ADMIN = 'ROLE_ADMIN',
  COACH = 'ROLE_COACH',
  USER = 'ROLE_USER',
 }


export enum ReservationFormat {
  ONLINE = 'online',
  IN_PERSON = 'in_person',
  BOTH = 'both',
}

export enum ReservationStatus {
    WAITING = 'waiting',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    CANCELED = 'canceled',
    COMPLETED = 'completed',
    AVAILABLE = 'available',
    EXPIRED = 'expired',
}

export enum PaymentStatus {
  WAITING = 'waiting',
  PAID = 'paid',
  FAILED = 'failed',
}