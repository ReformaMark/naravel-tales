import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Info } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { UserRole } from "@/types/onboarding"

interface RoleSelectionStepProps {
  onSelect: (role: UserRole) => void
}

export function RoleSelectionStep({ onSelect }: RoleSelectionStepProps) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between h-full">
      <div className="md:w-1/3 flex flex-col items-center justify-center mb-4 md:mb-0">
        <Button className="w-64 mb-2" onClick={() => onSelect('teacher')}>
          Teacher
        </Button>
        <p className="text-sm text-center text-gray-600 w-64 hidden md:block">
          Manage sections, handle students, track scores, and provide feedback on game performance.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center space-y-4 mb-8 md:mb-0 md:w-1/3">
        <Popover>
          <PopoverTrigger className="flex flex-row items-center justify-center gap-3">
            <h2 className="text-2xl font-bold text-center">Select your role</h2>
            <Info className="w-4 h-4" />
          </PopoverTrigger>
          <PopoverContent>
            <p className="text-sm">Select your role to continue with the onboarding process.</p>
          </PopoverContent>
        </Popover>
        <div className="relative w-64 h-64">
          <Image
            src="/thinking-no-cloud.svg"
            alt="Question Mark"
            width={256} height={256}
          />
        </div>
      </div>
      <div className="md:w-1/3 md:flex hidden flex-col items-center justify-center">
        <Button className="w-64 mb-2" onClick={() => onSelect('parent')}>
          Parent
        </Button>
        <p className="text-sm text-center text-gray-600 w-64">
          View your child&apos;s game scores and teacher feedback to track their performance.
        </p>
      </div>
      <div className="md:hidden flex flex-col items-center space-y-4 w-full px-4 mt-8">
        <Button className="w-64 mb-2" onClick={() => onSelect('teacher')}>
          Teacher
        </Button>
        <Button className="w-64 mb-2" onClick={() => onSelect('parent')}>
          Parent
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <div className="flex items-center justify-center mt-4 cursor-pointer">
              <Info className="w-4 h-4 mr-2" />
              <span className="text-sm text-gray-600">Tap here for more information about each role</span>
            </div>
          </PopoverTrigger>
          <PopoverContent side="top" className="max-w-xs">
            <div className="space-y-2">
              <p className="font-semibold">Teacher:</p>
              <p className="text-sm">Manage sections, handle students, track scores, and provide feedback on game performance.</p>
              <p className="font-semibold mt-2">Parent:</p>
              <p className="text-sm">View your child&apos;s game scores and teacher feedback to track their performance.</p>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}