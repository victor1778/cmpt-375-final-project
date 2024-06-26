import Image from "next/image";
import React, {useRef, useState, useMemo} from "react";
import {Slider} from "@/components/ui/slider";

interface FileUploadedHandlerProps {
    file: File,
    handleBlurChanges?: (value: number) => void,
    sliderUpload?: (file: File, blur: number) => Promise<void>,
    isSliderChanging?: boolean,
    setSliderChanging?: (value: (((prevState: boolean) => boolean) | boolean)) => void
}

export default function FileUploadedHandler({
                                                file,
                                                handleBlurChanges,
                                                sliderUpload
                                            }: FileUploadedHandlerProps) {

    const [blur, setBlur] = useState(0);
    const timeoutId = useRef<NodeJS.Timeout | null>(null);

    const handleBlurChange = (event: { target: { value: number } }) => {
        console.log(event.target.value);
        const newBlur = parseInt(String(event.target.value));
        setBlur(newBlur);


        if (handleBlurChanges) {
            handleBlurChanges(newBlur);
            if (timeoutId.current) {
                clearTimeout(timeoutId.current);
            }
            timeoutId.current = setTimeout(() => {
                sliderUpload && sliderUpload(file, newBlur);
            }, 300);
        }
    }

    const url = useMemo(() => URL.createObjectURL(file), [file]);

    return (
        <div>
            <div className="rounded-2xl overflow-hidden">
                <Image
                    src={url}
                    alt="Uploaded file"
                    width={500}
                    height={500}
                    className="rounded-2xl scale-110"
                    style={{
                        filter: `blur(${blur}px)`,
                    }}
                />
            </div>


            <div className="flex items-center gap-2" style={{
                padding: "10px"
            }}>
                <Slider defaultValue={[0]} max={64} step={1}
                 className={`w-full`}
                  onValueChange={(value) => handleBlurChange({target: {value: value[0]}})}/>
            <p className="font-medium text-white">{blur}</p></div>
        </div>
    );
}