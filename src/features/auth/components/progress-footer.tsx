import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface ProgressFooterProps {
    currentStep: number
    totalSteps: number
    onBack?: () => void
    showBack?: boolean
}

export function ProgressFooter({
    currentStep,
    totalSteps,
    onBack,
    showBack = true
}: ProgressFooterProps) {
    return (
        <footer className="h-16 bg-white border-t border-gray-200 flex items-center px-4 sticky bottom-0">
            {showBack && onBack && (
                <Button variant="ghost" onClick={onBack} className="mr-4">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
            )}
            <div className="flex-grow bg-gray-200 h-2 rounded-full">
                <div
                    className="bg-[#A594F9] h-full rounded-full transition-all duration-300 ease-in-out"
                    style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                />
            </div>
        </footer>
    )
}
