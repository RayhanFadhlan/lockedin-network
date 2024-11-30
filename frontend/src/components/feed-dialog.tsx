import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { ReactNode, useState } from "react";
import { useAuth } from "@/contexts/authProvider";

interface FeedDialogProps {
  trigger: ReactNode;
  isCreate: boolean;
  postId?: number;
  initialContent?: string;
}

export function FeedDialog({
  trigger,
  isCreate,
  initialContent,
}: FeedDialogProps) {
  const { user } = useAuth();
  const name = user?.name;
  const profile_photo = "/profile.svg";
  const [content, setContent] = useState(initialContent);

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-semibold text-xl text-center">
            {isCreate ? "Create a post" : "Edit post"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex items-start space-x-3 mb-4">
          <Avatar
            src={profile_photo}
            alt={name}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h4 className="font-semibold">{name}</h4>
          </div>
        </div>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What do you want to talk about?"
          className="min-h-[200px] resize-none"
        />
        <div className="flex justify-end">
          <Button>Post</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
