"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import useTopic from "@/hooks/useTopic";
import api from "@/lib/api";
import { Heart, Reply } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Home() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const { data, isLoading, error } = useTopic(id?.toString());
  const Topic = data;
  const imageUrl = Topic ? Topic?.author.avatarUrl : "";
  const [isReplying, setIsReplying] = useState(false); // Reply 입력 영역 표시 여부
  const [replyContent, setReplyContent] = useState(""); // 댓글 내용

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Submit 버튼 클릭 시 API 호출
  const handleSubmitReply = async () => {
    if (replyContent.trim() === "") return; // 빈 댓글 방지
    console.log(replyContent);
    try {
      console.log(Topic?.id);
      await api.post(`wiki/${Topic?.id}/comments`, { content: replyContent });
      setReplyContent(""); // 입력 필드 초기화
      setIsReplying(false); // Reply 영역 닫기
    } catch (error) {
      console.error("댓글 등록 실패:", error);
    }
  };

  return (
    <main className="min-h-screen py-6 w-3/4 place-self-center">
      <div className="w-full max-w-[980px] mb-4">
        <Button
          className="px-0 py-0 min-h-[30px] whitespace-pre-wrap text-start text-[28px]/8 font-semibold"
          onClick={() => {
            router.push(`/topic/${Topic?.id}`);
          }}
        >
          {Topic?.title}
        </Button>
        <div className="gap-2 flex">
          <Button size="sm" className="px-0 justify-start">
            {Topic?.category}
          </Button>
          {Topic?.tags &&
            Topic.tags.map((tag) => {
              return (
                <Button key={tag.id} size="sm" className="px-0 justify-start">
                  {tag.name}
                </Button>
              );
            })}
        </div>
      </div>
      <Separator className="max-w-[900px]" />
      <div className="flex min-h-screen mt-3">
        <div className="h-full w-[45px] mt-1">
          <Image src={imageUrl} alt="profile" width={45} height={45} />
        </div>
        <section className="w-[860px]">
          <div className="px-3 text-muted-foreground font-bold">
            {Topic?.author.username}
          </div>
          <section className="px-3 py-4">
            <div className="text-2xl font-semibold mb-5">{Topic?.title}</div>
            <article className="prose min-w-full">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {Topic?.content}
              </ReactMarkdown>
            </article>
          </section>
          <div className="flex items-center justify-end">
            {Topic?.likesCount}
            <Button
              className="px-1"
              onClick={async () => {
                await api.post(`wiki/${Topic?.id}/likes`, { isLiked: true });
              }}
            >
              <Heart />
            </Button>
            {/* 여기서 reply 버튼 누르면 텍스트 area 나오고 그 값이 submit 되면 api 호출하게 */}
            <Button onClick={() => setIsReplying(!isReplying)}>
              Reply <Reply />
            </Button>
          </div>

          {/* Reply 입력 영역: isReplying이 true일 때 표시 */}
          {isReplying && (
            <div className="mt-3">
              <Textarea
                className="w-full p-2 border rounded"
                rows={4}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Please put comment..."
              />
              <Button className="mt-2" onClick={handleSubmitReply}>
                Submit
              </Button>
            </div>
          )}

          <Separator className="h-[3px] mb-3" />
          <section>
            {Topic?.comments &&
              Topic.comments.map((comment) => {
                return (
                  <div
                    key={comment.id}
                    className="text-base font-semibold mb-5"
                  >
                    {comment.content}
                  </div>
                );
              })}
          </section>
        </section>
      </div>
    </main>
  );
}
