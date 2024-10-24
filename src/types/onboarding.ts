export type UserType = 'new' | 'existing' | null
export type UserRole = 'teacher' | 'parent' | null

export interface FormData {
    name: string
    email: string
    password: string
    inviteCode: string
}

export interface OnboardingStepProps {
    onNext: () => void
    onBack?: () => void
}