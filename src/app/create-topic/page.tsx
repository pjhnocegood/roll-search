"use client";

import { useState, DragEvent } from "react";

// shadcn/ui 컴포넌트들
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryCombobox } from "@/components/categorycombobox";
import { CreateTagCombobox } from "@/components/create-tagcombobox";
import { useRouter } from "next/navigation";
import { useFilterData } from "@/hooks/useFilterData";
import api, { Agentapi } from "@/lib/api";
import useUserProfile from "@/hooks/useUserProfile";

export default function CreateTopicPage() {
  // 입력값들을 state로 관리
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();
  const { category, tags } = useFilterData();
  const User = useUserProfile().data?.username;
  // 이미지 드래그 & 드롭 (Textarea 위에서 발생)
  const handleDragOver = (e: DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      // 여기에서 파일 업로드 로직을 처리할 수 있음
      console.log("드롭된 파일:", files);
      // 예: S3 업로드 후 업로드된 URL을 본문에 추가
    }
  };

  // 폼 전송 시 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formdata = {
      title,
      content,
      category,
      tags,
    };
    await api
      .post("/wiki", formdata)
      .then((response) => {
        console.log("파일 업로드 성공:", response.data);
      })
      .catch((error) => {
        console.error("파일 업로드 실패:", error);
      });

    await Agentapi.post("agent/action", {
      connection: "anthropic",
      action: "generate-text",
      params: [
        `summation topic like this form, 'New post on ${category}: ${title} By: - ${User} 🔗 Highlights: - 'one line summation of topic' and much more informations about topic. but, don't let the response over 190 characters'`,
        `${content}`,
      ],
    })
      .then((response) => {
        console.log("agent api 호출 성공:", response.data);
        const message: string = response.data.result;
        const substrIndex = message.indexOf("\n\n") + 1;
        const refinedText = message.substring(substrIndex);
        Agentapi.post("agent/action", {
          connection: "twitter",
          action: "post-tweet",
          params: [`${refinedText}`],
        });
      })
      .catch((error) => {
        console.error("agent api 호출 실패:", error);
      });
  };

  return (
    <Card className="mx-auto mt-10 max-w-2xl">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 제목 */}
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Type title, or paste a link here"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 border"
            />
          </div>

          <div>
            <CategoryCombobox />
            <CreateTagCombobox />
          </div>

          {/* 본문 */}
          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Type here. Use Markdown, BBCode, or HTML to format. Drag or paste images."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="mt-1 min-h-[500px] h-full"
            />
          </div>

          {/* 생성 버튼 */}
          <div className="gap-4 flex">
            <Button
              type="submit"
              variant={"ghost"}
              className="bg-blue-400"
              onClick={() => router.push("/")}
            >
              Create Topic
            </Button>
            <Button
              variant={"ghost"}
              className="border"
              onClick={() => router.push("/")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
