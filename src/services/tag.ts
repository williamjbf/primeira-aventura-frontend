import {apiFetch} from "@/services/api";
import {RecentsTables, Tag} from "@/services/table";

export async function getAllTags(): Promise<Tag[]> {
  return apiFetch<Tag[]>(`/tags`, {
    method: "GET",
  });
}