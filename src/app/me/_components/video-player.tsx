import { Fragment, useState } from "react";
import ReactPlayer from "react-player";
import type { videoOutput } from "~/server/api/client/types";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { ArrowTopRightIcon, CopyIcon } from "@radix-ui/react-icons";
import copy from "clipboard-copy";

const VideoPlayer = ({ data }: { data: videoOutput[] }) => {
  const [video, setVideo] = useState<videoOutput>();

  const setActiveVideo = (video: videoOutput) => {
    setVideo(video);
  };

  const openUrl = (url: string) => {
    window.open(url,'_blank')
  };

  return (
    <div className="flex flex-col gap-5 p-5 sm:flex-row">
      <div className="relative w-full">
        <div className="relative inset-0 h-[240px] w-full bg-gray-200 sm:h-[720px]">
          <ReactPlayer url={video?.url} width="100%" height="100%" />
        </div>
      </div>
      <div className="flex h-[55vh] w-full flex-col gap-2 overflow-scroll sm:w-[40rem]">
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
                    <div
                      className="p-3"
                      onClick={ (e) => {
                        e.stopPropagation();
                        openUrl(item.url);
                      }}
                    >
                      <ArrowTopRightIcon />
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
