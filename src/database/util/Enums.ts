
/**
 * Role użytkowników w systemie
 */
export enum Role {
    PATIENT = "PATIENT",
    DOCTOR = "DOCTOR",
    ADMIN = "ADMIN",
    UNKNOWN = "UNKNOWN"
}

/**
 * Status wizyty lekarskiej
 */
export enum AppointmentStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    FINISHED = 'finished'
}