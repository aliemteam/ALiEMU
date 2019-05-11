/**
 * Used to set intent-based styles on various components across the project.
 */
export const enum Intent {
    PRIMARY = 'primary',
    SECONDARY = 'secondary',
    SUCCESS = 'success',
    WARNING = 'warning',
    DANGER = 'danger',
}

/**
 * Course status enum used in `User.course_progress`.
 */
export const enum CourseStatus {
    COMPLETED = 'COMPLETED',
    STARTED = 'STARTED',
}

export const UserTitles: readonly string[] = [
    'Physician',
    'Pharmacist',
    'Physician Assistant',
    'Nurse Practitioner',
    'Nurse',
    'Physical Therapist',
    'Occupational Therapist',
    'Prehospital Provider',
    'Respiratory Therapist',
    'Other',
];

export const UserPracticeLevels: readonly string[] = [
    'Student',
    'Resident',
    'Fellow',
    'Non-Trainee Practitioner',
    'Other',
];
