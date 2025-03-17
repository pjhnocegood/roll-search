"use client";

import React, { useState, DragEvent } from "react";
// shadcn/ui에서 가져올 수 있는 컴포넌트 예시
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function EditorPage() {
  const [text, setText] = useState("");

  // 이미지 드래그 & 드롭 핸들러
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      // 파일 업로드 로직을 여기에 작성
      // 예: S3나 서버에 업로드 후, 업로드된 이미지 URL을 마크다운/BBCode 등으로 삽입
      console.log("Dropped files:", files);
    }
  };

  // 텍스트 포매팅 관련 간단 예시
  const insertBold = () => {
    // 간단하게 굵게 표시(**bold**)
    setText((prev) => `**${prev}**`);
  };

  const insertItalic = () => {
    setText((prev) => prev + "*기울임*");
  };

  const insertCode = () => {
    setText((prev) => prev + "```\n\n```");
  };

  const insertQuote = () => {
    setText((prev) => prev + "> 인용문\n");
  };

  return (
    <Card className="mx-auto mt-10 max-w-2xl">
      <CardHeader>
        <CardTitle>Markdown / BBCode / HTML 에디터</CardTitle>
      </CardHeader>
      <CardContent>
        {/* 툴바 */}
        <div className="flex flex-wrap gap-2 pb-2 border-b mb-4">
          <Button variant="secondary" onClick={insertBold}>
            B
          </Button>
          <Button variant="secondary" onClick={insertItalic}>
            I
          </Button>
          <Button variant="secondary" onClick={insertCode}>
            Code
          </Button>
          <Button variant="secondary" onClick={insertQuote}>
            Quote
          </Button>
        </div>

        {/* 드래그/드롭 영역 + 텍스트 입력 */}
        <div
          className="border border-dashed border-gray-300 p-2 rounded-md"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Textarea
            placeholder="여기에 텍스트를 입력하세요. (이미지 드래그/붙여넣기 가능)"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="h-40"
          />
        </div>
      </CardContent>
    </Card>
  );
}
