import { Fragment, useState } from "react";
import ReactPlayer from "react-player";
import type { videoOutput } from "~/server/api/client/types";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { ArrowTopRightIcon, TrashIcon } from "@radix-ui/react-icons";

const VideoPlayer = ({ data, deleteVideo }: { data: videoOutput[], deleteVideo: (id:number) => void }) => {
  const [video, setVideo] = useState<videoOutput>();

  const setActiveVideo = (video: videoOutput) => {
    setVideo(video);
  };

  const openUrl = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <div className="flex flex-col gap-5 p-5 sm:flex-row">
      <div className="relative w-full">
        <div className="relative inset-0 h-[240px] w-full bg-gray-200 sm:h-[720px]">
          <ReactPlayer url={video?.url} width="100%" height="100%" />
        </div>
      </div>
      <div className="flex h-[55vh] sm:h-[80vh] w-full flex-col gap-2 overflow-scroll sm:w-[40rem]">
        {data.map((item) => (
          <Fragment key={item.id}>
            <Card
              onClick={() => setActiveVideo(item)}
              className={cn(
                "hover:cursor-pointer hover:shadow-md",
                video?.id == item.id ? "border border-green-600" : "",
              )}
            >
              <CardContent className="p-0 sm:p-2">
                <CardHeader className="text-sm sm:text-base">
                  <CardTitle className="flex justify-between capitalize">
                    <div>{item.title}</div>
                    <div>
                      <div
                        className="p-3 hover:border rounded-full hover:text-red-500 hover:border-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          openUrl(item.url);
                        }}
                      >
                        <ArrowTopRightIcon />
                      </div>
                      <div
                        className="p-3 hover:border rounded-full hover:text-red-500 hover:border-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteVideo(item.id);
                        }}
                      >
                        <TrashIcon />
                      </div>
                    </div>
                  </CardTitle>
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
