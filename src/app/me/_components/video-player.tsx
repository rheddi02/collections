import { Fragment, useState } from "react";
import ReactPlayer from "react-player";
import type { videoOutput } from "~/server/api/client/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { cn } from "~/lib/utils";
const VideoPlayer = ({data}:{data: videoOutput[]}) => {
  const [video, setVideo] = useState<videoOutput>();

  const setActiveVideo = (video: videoOutput) => {
    setVideo(video);
  };
  return (
    <div className="flex gap-5 p-5">
      <div className="w-full">
        <div className="relative h-[500px] w-full bg-gray-200">
          <ReactPlayer url={video?.url} width="100%" height="100%" />
        </div>
      </div>
      <div className="flex h-screen w-[40rem] flex-col gap-2">
        {data.map((item) => (
          <Fragment key={item.id}>
            <Card onClick={() => setActiveVideo(item)} className={cn("hover:shadow-md hover:cursor-pointer", video?.id == item.id ? "border border-green-600": '')}>
              <CardContent>
                <CardHeader>
                  <CardTitle className="capitalize">{item.title}</CardTitle>
                  <CardDescription>Description</CardDescription>
                </CardHeader>
              </CardContent>
            </Card>
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default VideoPlayer;
