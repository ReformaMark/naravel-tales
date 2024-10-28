'use client'

import { isValidName, isValidPassword } from '@/lib/utils'
import { FormData, UserRole, UserType } from '@/types/onboarding'
import { useAuthActions } from '@convex-dev/auth/react'
import { useConvexAuth } from 'convex/react'
import { useAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useEmailCheck } from '../api/use-email-check'
import { useRoleCheck } from '../api/use-role-check'
import { loginModalURLSyncAtom } from '../loginModal'
import { LoginModal } from './login-modal'
import { ProgressFooter } from './progress-footer'
import { RegistrationForm } from './registration-form'
import { RoleSelectionStep } from './role-selection-step'
import { UserTypeStep } from './user-type-step'

const steps = [
    'userTypeCheck',
    'selectRole',
    'registration',
    'dashboard'
] as const

export interface ValidationErrors {
    fname?: string;
    lname?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

export default function OnboardingFlow() {
    const [currentStep, setCurrentStep] = useState(0)
    const [, setUserType] = useState<UserType>(null)
    const [role, setRole] = useState<UserRole>(null)
    const [formData, setFormData] = useState<FormData>({
        fname: '',
        lname: '',
        email: '',
        password: '',
        confirmPassword: '',
        inviteCode: '',
    })
    const [, setIsLoginModalOpen] = useAtom(loginModalURLSyncAtom)
    const { signIn } = useAuthActions()
    const router = useRouter()
    const { isAuthenticated } = useConvexAuth();
    const { data: roleCheck } = useRoleCheck()
    const [errors, setErrors] = useState<ValidationErrors>({})
    const [pending, setPending] = useState<boolean>(false);
    const emailExists = useEmailCheck(formData.email)

    useEffect(() => {
        if (isAuthenticated) {
            if (role === "teacher" && roleCheck === "teacher") {
                router.push('/teachers')
            } else if (role === "parent" && roleCheck === "parent") {
                router.push('/parent')
            }
        }
    }, [isAuthenticated, role, roleCheck, router])

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
        signIn("google")
    }

    const validateForm = async (): Promise<boolean> => {
        const newErrors: ValidationErrors = {}

        if (!isValidName(formData.fname)) {
            newErrors.fname = "First name can only contain letters, hyphens, and periods"
        }

        if (!isValidName(formData.lname)) {
            newErrors.lname = "Last name can only contain letters, hyphens, and periods"
        }

        if (!formData.email) {
            newErrors.email = "Email is required"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address"
        } else {
            try {
                if (emailExists) {
                    newErrors.email = "This email is already registered"
                }
            } catch (error) {
                console.error('Error checking email:', error)
                newErrors.email = "Error checking email availability"
            }
        }

        if (!isValidPassword(formData.password)) {
            newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleRegistration = async (e: React.FormEvent) => {
        e.preventDefault()

        setPending(true)
        setErrors({})

        try {
            const isValid = await validateForm()
            if (!isValid) {
                setPending(false)
                return
            }

            await signIn("password", {
                email: formData.email,
                fname: formData.fname,
                lname: formData.lname,
                password: formData.password,
                role,
                onboarding: false,
                flow: "signUp"
            })
        } catch (error) {
            console.error(error)
            setErrors({
                email: "An error occurred during registration. Please try again."
            })
        } finally {
            setPending(false)
        }
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
                        errors={errors}
                        pending={pending}
                        role={role}
                        formData={formData}
                        onSubmit={handleRegistration}
                        onChange={handleInputChange}
                        onGoogleSignIn={handleGoogleLogin}
                    />
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
