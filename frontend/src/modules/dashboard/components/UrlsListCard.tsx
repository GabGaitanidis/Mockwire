import type { FC } from "react";
import type { UrlItem } from "../types";

type UrlsListCardProps = {
  urls: UrlItem[];
  feedback: { type: "success" | "error"; text: string } | null;
  onDeleteUrl: (urlId?: number) => Promise<void>;
};

const UrlsListCard: FC<UrlsListCardProps> = ({
  urls,
  feedback,
  onDeleteUrl,
}) => {
  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.4)] p-6 min-w-0 overflow-hidden">
      <h3 className="text-xl font-bold mb-4 text-[#e6edf3]">
        Generated Endpoints
      </h3>
      {feedback && (
        <div className="mb-4 rounded-md border border-[#30363d] border-l-4 border-l-[#58a6ff] bg-[#1e2128] p-3 text-sm text-[#8b949e]">
          {feedback.text}
        </div>
      )}
      {urls.length > 0 ? (
        <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {urls.map((url) => (
            <li
              key={url.id ?? url.url}
              className="rounded-md border border-[#30363d] bg-[#0d1117] p-4"
            >
              <p className="mb-2 max-w-full break-words font-mono text-xs text-[#e6edf3]">
                {url.url}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(url.url);
                  }}
                  className="text-xs font-semibold text-[#58a6ff] hover:text-[#79c0ff]"
                >
                  Copy URL
                </button>
                <button
                  onClick={async () => {
                    if (!url.id) return;
                    const ok = window.confirm("Delete this URL?");
                    if (!ok) return;
                    await onDeleteUrl(url.id);
                  }}
                  className="rounded-md border border-[#30363d] bg-[#1e2128] px-2 py-1 text-xs text-[#8b949e] hover:border-[#58a6ff] hover:text-[#e6edf3]"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-8 text-center text-[#8b949e]">No URLs generated yet</p>
      )}
    </div>
  );
};

export default UrlsListCard;
