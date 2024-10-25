'use client'

import { FormData, UserRole, UserType } from '@/types/onboarding'
import { useState } from 'react'
import { useAtom } from 'jotai'
import { loginModalURLSyncAtom } from '../loginModal'
import { UserTypeStep } from './user-type-step'
import { RoleSelectionStep } from './role-selection-step'
import { RegistrationForm } from './registration-form'
import { ProgressFooter } from './progress-footer'
import { LoginModal } from './login-modal'

const steps = [
    'userTypeCheck',
    'selectRole',
    'registration',
    'verification',
    'dashboard'
] as const

export default function OnboardingFlow() {
    const [currentStep, setCurrentStep] = useState(0)
    const [, setUserType] = useState<UserType>(null)
    const [role, setRole] = useState<UserRole>(null)
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        password: '',
        inviteCode: '',
    })
    const [, setIsLoginModalOpen] = useAtom(loginModalURLSyncAtom)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prevData => ({ ...prevData, [name]: value }))
    }

    const handleUserTypeSelection = (type: UserType) => {
        setUserType(type)
        if (type === 'new') {
            setCurrentStep(1)
        } else {
            setIsLoginModalOpen(true)
        }
    }

    const handleRoleSelection = (selectedRole: UserRole) => {
        setRole(selectedRole)
        setCurrentStep(2)
    }

    const handleGoogleLogin = () => {
        console.log("Google login clicked")
    }

    const handleRegistration = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Registration data:', formData)
        setCurrentStep(3)
    }

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        }
    }

    const renderStep = () => {
        switch (steps[currentStep]) {
            case 'userTypeCheck':
                return <UserTypeStep onSelect={handleUserTypeSelection} />
            case 'selectRole':
                return <RoleSelectionStep onSelect={handleRoleSelection} />
            case 'registration':
                return role && (
                    <RegistrationForm
                        role={role}
                        formData={formData}
                        onSubmit={handleRegistration}
                        onChange={handleInputChange}
                        onGoogleSignIn={handleGoogleLogin}
                    />
                )
            case 'verification':
                return (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">Email Verification</h2>
                        <p>Please check your email and click the verification link to complete your registration.</p>
                    </div>
                )
            case 'dashboard':
                return (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">Welcome!</h2>
                        <p>Redirecting to your dashboard...</p>
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <div className="flex flex-col h-screen bg-white">
            <main className="flex-grow flex flex-col md:flex-row items-center justify-center p-4">
                {renderStep()}
            </main>
            <ProgressFooter
                currentStep={currentStep}
                totalSteps={steps.length}
                onBack={handleBack}
                showBack={currentStep > 0}
            />
            <LoginModal />
        </div>
    )
}
