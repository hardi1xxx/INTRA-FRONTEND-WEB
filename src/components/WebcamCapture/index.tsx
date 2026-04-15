import 'react-image-crop/dist/ReactCrop.css'

import { ReactEventHandler, SyntheticEvent, useRef, useState } from "react";
import { Dialogs } from "../dialog"
import Webcam from "react-webcam";
import ReactCrop, { Crop } from 'react-image-crop';
import { Box, Button } from "@mui/material";
import { Camera, Cancel, Check, RestartAlt, Transform } from "@mui/icons-material"
import { blobToBase64 } from '../helper';

type WebcamCaptureType = {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    onSubmit: (capturedImage: string) => void
  }

const WebcamCapture = ({open, setOpen, onSubmit}: WebcamCaptureType) => {
    const ref = useRef<Webcam>(null)
    const [image, setImage] = useState<HTMLImageElement>()
    const [capturedImage, setCapturedImage] = useState<string | null>()
    const [isCropProcess, setIsCropProcess] = useState<boolean>()
    const [crop, setCrop] = useState<Crop>({
        unit: '%',
        width: 50,
        height: 50,
        x: 25,
        y: 25
    })

    const capture = () => {
        var image = ref.current?.getScreenshot()

        setCapturedImage(image)
    }

    const submitCrop = () => {
        setIsCropProcess(false)
        const canvas = document.createElement('canvas');
        const scaleX = (image?.naturalWidth || 0) / (image?.width || 0);
        const scaleY = (image?.naturalHeight || 0) / (image?.height || 0);
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');
    
        ctx?.drawImage(
          image || new HTMLImageElement,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width,
          crop.height
        );
    
        return new Promise((resolve, reject) => {
          canvas.toBlob(blob => {
            if (!blob) {
              //reject(new Error('Canvas is empty'));
              console.error('Canvas is empty');
              return;
            }
            blobToBase64(blob).then((value) => {
                setCapturedImage(value as string)
                setIsCropProcess(false)
            })
            
            
          }, 'image/png');
        });
    }

    const retake = () => {
        setCapturedImage(undefined)
    }

    const onImageLoaded = (image : HTMLImageElement) => {
        
        var cropNew = {...crop}

        cropNew.width = (image.width) <= (image.height) ? image.width : image.height;
        cropNew.height = (image.width) <= (image.height) ? image.width : image.height;
        cropNew.y = (image.height - cropNew.height) / ((image.width) == (image.height) ? 1 : (image.height) > (image.width) ? 2 : 1) ;
        cropNew.x = (image.width - cropNew.width) / ((image.width) == (image.height) ? 1 : (image.width) > (image.height) ? 2  : 2) ;
        
        cropNew.unit = "px"
        setCrop(cropNew)
        setImage(image)
        
        return false; // Return false if you set crop state in here.
    };

    const submit = () => {
        onSubmit(capturedImage || '')
        setImage(undefined)
        setCapturedImage(undefined)
        setIsCropProcess(undefined)
        setOpen(false)
    }

    return(
        <Dialogs
            open={open}
            title={`Webcam Capture`}
            setOpen={setOpen}
        >
            {
                !capturedImage && <Webcam 
                    audio={false}
                    height={'auto'}
                    ref = {ref}
                    screenshotFormat="image/jpeg"
                    width={'100%'}
                    videoConstraints={{
                        width: 1280,
                        height: 720,
                        facingMode: "user"
                    }}
                />
            }
            {
                capturedImage && !isCropProcess && <Box style={{height: 'auto', width: 'auto'}} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                    <img src={capturedImage} />
                </Box>
            }
            {
                isCropProcess && <Box style={{height: 'auto', width: 'auto'}} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                    <ReactCrop
                        crop={crop}
                        aspect={1}
                        circularCrop={true}
                        onChange={(crop,percentageCrop) => setCrop(crop)} 
                        ruleOfThirds = {true}
                    >
                        <img src={capturedImage || undefined} onLoad={(event) => onImageLoaded(event.currentTarget)} />
                    </ReactCrop>
                </Box>
            }
            <Box display={'flex'} justifyContent={'end'} width={'100%'} marginTop={'1rem'} gap={'1rem'}>
                <div>
                    {
                        !capturedImage && <Button color="success" variant='contained' size="small" type="button" sx={{ mr: 1 }} onClick={capture} startIcon={<Camera />}>
                        Capture
                        </Button>
                    }
                    {
                        capturedImage && !isCropProcess && <Button color="info" variant='contained' size="small" type="button" sx={{ mr: 1 }} onClick={() => setIsCropProcess(true)} startIcon={<Transform />}>
                        Crop
                        </Button>
                    }
                    {
                        capturedImage && isCropProcess && <Button color="info" variant='contained' size="small" type="button" sx={{ mr: 1 }} onClick={submitCrop} startIcon={<Transform />}>
                        Submit Crop
                        </Button>
                    }
                    {
                        capturedImage && isCropProcess && <Button color="warning" variant='contained' size="small" type="button" sx={{ mr: 1 }} onClick={() => setIsCropProcess(false)} startIcon={<Cancel />}>
                        Cancel Crop
                        </Button>
                    }
                    {
                        capturedImage && !isCropProcess && <Button color="warning" variant='contained' size="small" type="button" sx={{ mr: 1 }} onClick={retake} startIcon={<RestartAlt />}>
                        Re-take
                        </Button>
                    }
                    {
                        capturedImage && !isCropProcess && <Button
                            color="primary"
                            variant='contained'
                            size="small"
                            type="submit"
                            startIcon={<Check />}
                            onClick={submit}>
                            Submit
                            </Button>
                    }
                </div>
            </Box>
        </Dialogs>
    )
}

export default WebcamCapture