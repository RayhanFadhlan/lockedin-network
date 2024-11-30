import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { FeedDialog } from "./feed-dialog";
import { useFeed } from "@/contexts/feedProvider";

interface FeedDropdownProps {
  postId: number;
  content: string;
}

export function FeedDropdown({ postId, content }: FeedDropdownProps) {
  const { deleteFeed } = useFeed();

  return (
    <DropdownMenu modal={false}>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="h-8 w-8 p-0">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
        <FeedDialog
          trigger={
            <Button variant="ghost" className="h-8 w-full justify-start p-2">
              <Pencil className="h-4 w-4 mr-2" />
              Edit post
            </Button>
          }
          isCreate={false}
          initialContent={content}
          postId={postId}

        />
      </DropdownMenuItem>
      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-full justify-start p-2 text-red-600 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete post
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                post.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={() => deleteFeed(postId)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
  );
}