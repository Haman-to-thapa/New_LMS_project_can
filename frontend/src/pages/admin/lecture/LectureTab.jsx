import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { useEditLectureMutation, useGetCourseLectureQuery, useRemoveLectureMutation } from '@/featureSlice/api/courseApi'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'

const LectureTab = () => {

  const [lectureTitle, setLectureTitle] = useState('')
  const [uploadVideInfo, setUploadVideoInfo] = useState(null)
  const [isFree, setIsFree] = useState(false);
  const [mediaProgress, setMediaProgress] = useState(false)
  const [uploadProgress, setUplaoadProgress] = useState(0);
  const [btnDisable, setBtnDisable] = useState(true);

  const params = useParams()
  const { courseId, lectureId } = params;

  const MEDIA_API = "http://localhost:8080/api/v1/media"

  const [editLecture, { data, isLoading, error, isSuccess }] = useEditLectureMutation()

  const [removeLecture, { data: removeData, isLoading: removeLoading, isSuccess: removeIsSuccess }] = useRemoveLectureMutation()

  const { data: lectureData } = useGetCourseLectureQuery(lectureId)

  const lecture = lectureData?.lecture;

  useEffect(() => {
    if (lecture) {
      setLectureTitle(lecture.lectureTitle || "");
      setIsFree(lecture.isPreviewFree || false);
      setUploadVideoInfo(lecture.videoInfo || null);
    }
  }, [lecture]);



  const editLectureHandler = async () => {

    console.log({
      lectureTitle,
      videoInfo: uploadVideInfo,
      isPreviewFree: isFree,
      courseId,
      lectureId,
    });

    await editLecture({
      lectureTitle,
      videoInfo: uploadVideInfo,
      isPreviewFree: isFree,
      courseId,
      lectureId,
    })
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message)

    }
    if (error) {
      toast.error(error.data.message)
    }

  }, [error, isSuccess])


  const fileChangeHandler = async (e) => {
    const file = e.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append("file", file);


      // calling api there
      setMediaProgress(true);

      try {
        const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {

          onUploadProgress: ({ loaded, total }) => {
            setUplaoadProgress(Math.round(loaded * 100) / total)
          }
        });

        if (res.data.success) {
          console.log(res)
          setUploadVideoInfo({
            videoUrl: res.data.data?.secure_url,
            publicId: res.data.data.public_id
          });
          setBtnDisable(false)
          toast.success(res.data.message)
        }
      } catch (error) {
        console.log(error)
        toast.error("video upload failed")
      } finally {
        setMediaProgress(false)
      }
    }

  }


  const removeLectureHandeler = async () => {
    await removeLecture(lectureId);
  }

  useEffect(() => {
    if (removeIsSuccess) {
      toast.success(removeData.message);

    }
  }, [removeIsSuccess, removeData]);


  return (

    <Card>
      <CardHeader className='flex justify-between items-start flex-wrap gap-4'>
        <div>
          <CardTitle>Edit Lecture</CardTitle>
          <CardDescription>
            Make changes and click save when done.
          </CardDescription>
        </div>
        <Button disabled={removeLoading} variant="destructive"
          onClick={removeLectureHandeler}
        >
          {
            removeLoading ? <>
              <Loader2 className='h-4 w-4 animate-spin' />
              please wait
            </> :
              <h1>Remove Lecture</h1>
          }
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="lecture-title">Title</Label>
          <Input
            id="lecture-title"
            type="text"
            placeholder="Introduction to JavaScript"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
          />

        </div>

        <div>
          <Label htmlFor="lecture-video">Video <span className='text-red-700'>*</span></Label>
          <Input
            id="lecture-video"
            type="file"
            accept="video/*"
            className="w-fit"
            onChange={fileChangeHandler}
          />
        </div>

        <div className="flex items-center space-x-2 my-5">
          <Switch
            id="free-video"
            checked={isFree}
            onCheckedChange={() => setIsFree(prev => !prev)}
          />

          <Label htmlFor="free-video">Is this video FREE?</Label>
        </div>
        {
          mediaProgress && <div className="">
            <Progress value={uploadProgress} />
            <p>{uploadProgress}% upload</p>
          </div>
        }
        <div className="">
          <Button
            disabled={isLoading}
            onClick={editLectureHandler}
          >{
              isLoading ? <>
                <Loader2 className='h-4 w-4 animate-spin' />
                please wait </> : "Update Lecture"
            }</Button>
        </div>
      </CardContent>
    </Card>


  )
}

export default LectureTab