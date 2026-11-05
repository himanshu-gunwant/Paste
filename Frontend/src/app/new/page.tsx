import { Metadata } from "next";
import { PasteCreator } from "@/components/editor/paste-creator";

export const metadata: Metadata = {
  title: "New Paste — paste.bin",
};

export default function NewPastePage() {
  return <PasteCreator />;
}
