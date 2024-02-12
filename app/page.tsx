"use client"
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Camera, Divide, FlipHorizontal, MoonIcon, PersonStanding, SunIcon, Video, Volume2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam';
import { toast } from "sonner"
import "@tensorflow/tfjs-backend-cpu"
import "@tensorflow/tfjs-backend-webgl"
import * as cocossd from '@tensorflow-models/coco-ssd'
import "@tensorflow/tfjs-backend-cpu"
import "@tensorflow/tfjs-backend-webgl"

type Props = {}

let interval: any = null;
let stopTimeout: any = null;
const HomePage = (props: Props) => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // state 
  const [mirrored, setMirrored] = useState<boolean>(true);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [autoRecordEnabled, setAutoRecordEnabled] = useState<boolean>(false)
  const [volume, setVolume] = useState(0.8);
  const [loading, setLoading] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  // initialize media recorder
  useEffect(() => {
    if (webcamRef && webcamRef.current) {
      const stream = (webcamRef.current.video as any).captureStream();
      if (stream) {
        mediaRecorderRef.current = new MediaRecorder(stream);

        mediaRecorderRef.current.ondataavailable = (e) => {
          if (e.data.size > 0) {
            const recordedBlob = new Blob([e.data], { type: 'video' });
            const videoURL = URL.createObjectURL(recordedBlob);

            const a = document.createElement('a');
            a.href = videoURL;
            a.download = `${formatDate(new Date())}.webm`;
            a.click();
          }
        };
        mediaRecorderRef.current.onstart = (e) => {
          setIsRecording(true);
        }
        mediaRecorderRef.current.onstop = (e) => {
          setIsRecording(false);
        }
      }
    }
  }, [webcamRef])


  useEffect(() => {
    setLoading(true);
    initModel();
  }, [])

  // load model 
  // set the model in a state varaible
  async function initModel() {
    const loadedModel: ObjectDetection = await cocossd.load({
      base: 'mobilenet_v2'
    });
    setModel(loadedModel);
  }

  useEffect(() => {
    if (model) {
      setLoading(false);
    }
  }, [model])


  async function runPrediction() {
    if (
      model
      && webcamRef.current
      && webcamRef.current.video
      && webcamRef.current.video.readyState === 4
    ) {
      const predictions: DetectedObject[] = await model.detect(webcamRef.current.video);

      resizeCanvas(canvasRef, webcamRef);
      drawOnCanvas(mirrored, predictions, canvasRef.current?.getContext('2d'))

      let isPerson: boolean = false;
      if (predictions.length > 0) {
        predictions.forEach((prediction) => {
          isPerson = prediction.class === 'person';
        })

        if (isPerson && autoRecordEnabled) {
          startRecording(true);
        }
      }
    }
  }

  useEffect(() => {
    interval = setInterval(() => {
      runPrediction();
    }, 100)

    return () => clearInterval(interval);
  }, [webcamRef.current, model, mirrored, autoRecordEnabled])

  return (

    <div className='flex h-screen'>
      {/* Left division - webcam and Canvas  */}
      <div className='relative'>
        <div className='relative h-screen w-full'>
          <Webcam ref={webcamRef}
            mirrored={mirrored}
            className='h-full w-full object-contain p-2'
          />
          <canvas ref={canvasRef}
            className='absolute top-0 left-0 h-full w-full object-contain'
          ></canvas>
        </div>
      </div>

      {/* Righ division - container for buttion panel and wiki secion  */}
      <div className='flex flex-row flex-1'>
        <div className='border-primary/5 border-2 max-w-xs flex flex-col gap-2 justify-between shadow-md rounded-md p-4'>
          {/* top secion  */}
          <div className='flex flex-col gap-2'>
            <ModeToggle />
            <Button
              variant={'outline'} size={'icon'}
              onClick={() => {
                setMirrored((prev) => !prev)
              }}
            ><FlipHorizontal /></Button>

            <Separator className='my-2' />
          </div>

          {/* Middle section  */}
          <div className='flex flex-col gap-2'>
            <Separator className='my-2' />
            <Button
              variant={'outline'} size={'icon'}
              onClick={userPromptScreenshot}
            >
              <Camera />
            </Button>
            <Button
              variant={isRecording ? 'destructive' : 'outline'} size={'icon'}
              onClick={userPromptRecord}
            >
              <Video />
            </Button>
            <Separator className='my-2' />
            <Button
              variant={autoRecordEnabled ? 'destructive' : 'outline'}
              size={'icon'}
              onClick={toggleAutoRecord}
            >
              {autoRecordEnabled ? <Rings color='white' height={45} /> : <PersonStanding />}

            </Button>
          </div>
          {/* Bottom Secion  */}
          <div className='flex flex-col gap-2'>
            <Separator className='my-2' />

            <Popover>
              <PopoverTrigger asChild>
                <Button variant={'outline'} size={'icon'}>
                  <Volume2 />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Slider
                  max={1}
                  min={0}
                  step={0.2}
                  defaultValue={[volume]}
                  onValueCommit={(val) => {
                    setVolume(val[0]);
                    beep(val[0]);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className='h-full flex-1 py-4 px-2 overflow-y-scroll'>
          <RenderFeatureHighlightsSection />
        </div>
      </div>
      {loading && <div className='z-50 absolute w-full h-full flex items-center justify-center bg-primary-foreground'>
        Getting things ready . . . <Rings height={50} color='red' />
      </div>}
    </div>
  )


  // handler functions

  function userPromptScreenshot() {

    // take picture
    if(!webcamRef.current){
      toast('Camera not found. Please refresh');
    }else{
      const imgSrc = webcamRef.current.getScreenshot();
      console.log(imgSrc);
      const blob = base64toBlob(imgSrc);

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${formatDate(new Date())}.png`
      a.click();
    }
    // save it to downloads

  }

  export default function RootLayout({ children }) {
    return (
      <html lang="en">
        <head />
        <body>
          <main>{children}</main>
          <Toaster />
        </body>
      </html>
    )
  }