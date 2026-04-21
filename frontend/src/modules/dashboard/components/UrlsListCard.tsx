import type { FC } from "react";
import type { UrlItem } from "../types";

type UrlsListCardProps = {
  urls: UrlItem[];
  onDeleteUrl: (urlId?: number) => Promise<void>;
};

const UrlsListCard: FC<UrlsListCardProps> = ({ urls, onDeleteUrl }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 min-w-0 overflow-hidden">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Your URLs</h3>
      {urls.length > 0 ? (
        <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {urls.map((url) => (
            <li
              key={url.id ?? url.url}
              className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-l-4 border-green-500"
            >
              <p className="text-xs break-words font-mono text-gray-700 mb-2 max-w-full">
                {url.url}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(url.url);
                  }}
                  className="text-xs text-green-600 hover:text-green-700 font-semibold"
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
                  className="text-xs px-2 py-1 rounded bg-red-100 text-red-800 hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center py-8">No URLs generated yet</p>
      )}
    </div>
  );
};

export default UrlsListCard;
