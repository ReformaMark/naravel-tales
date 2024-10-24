import { Button } from "@/components/ui/button"
import { UserType } from "@/types/onboarding"
import Image from "next/image"

interface UserTypeStepProps {
    onSelect: (type: UserType) => void
}

export function UserTypeStep({ onSelect }: UserTypeStepProps) {
    return (
        <div className="flex flex-col md:flex-row items-center justify-between h-full">
            <div className="md:w-1/3 flex justify-center mb-4 md:mb-0">
                <Button className="w-64" onClick={() => onSelect('new')}>
                    New User
                </Button>
            </div>
            <div className="flex flex-col items-center justify-center space-y-4 mb-8 md:mb-0 md:w-1/3">
                <h2 className="text-2xl font-bold mb-4 text-center">Are you a new or existing user?</h2>
                <div className="relative w-64 h-64">
                    <Image
                        src="/thinking-no-cloud.svg"
                        alt="Question Mark"
                        width={256} height={256}
                    />
                </div>
            </div>
            <div className="md:w-1/3 md:flex hidden justify-center">
                <Button className="w-64" onClick={() => onSelect('existing')}>
                    Existing User
                </Button>
            </div>
            <div className="md:hidden flex flex-col items-center space-y-4 w-full px-4 mt-8">
                <Button className="w-64" onClick={() => onSelect('new')}>
                    New User
                </Button>
                <Button className="w-64" onClick={() => onSelect('existing')}>
                    Existing User
                </Button>
            </div>
        </div>
    )
}