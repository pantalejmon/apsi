
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

export enum Errors {
    WRONG_CREDENTIALS = "wrong_credential",
    PERMISSION_DENIED = "permission_denied",
    OTHER_ERROR = "other_error"
}
