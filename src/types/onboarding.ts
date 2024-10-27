export type UserType = 'new' | 'existing' | null
export type UserRole = 'teacher' | 'parent' | null

export interface FormData {
    fname: string;
    lname: string;
    email: string;
    password: string;
    confirmPassword: string;
    inviteCode: string;
}

export interface OnboardingStepProps {
    onNext: () => void
    onBack?: () => void
}