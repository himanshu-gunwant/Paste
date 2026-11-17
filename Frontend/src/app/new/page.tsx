import { Metadata } from "next";
import { PasteCreator } from "@/components/editor/paste-creator";

export const metadata: Metadata = {
  title: "New Paste — paste.himanshugunwant.com",
};

export default function NewPastePage() {
  return <PasteCreator />;
}
