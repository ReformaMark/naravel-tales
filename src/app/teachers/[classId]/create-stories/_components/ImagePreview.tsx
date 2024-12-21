import Image from "next/image";

export const ImagePreview = ({ image }: { image: File | null }) => {
    if (!image) return null;

    return (
        <div className="relative h-full w-full">
            <Image
                src={URL.createObjectURL(image)}
                alt="Story Image preview"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
            />
        </div>
    );
};