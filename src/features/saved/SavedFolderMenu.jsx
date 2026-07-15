import { useState } from 'react';
import { FolderPlus } from 'lucide-react';
import { useLocale } from '@/locales/LocaleContext';

export function SavedFolderMenu({ spotId, folders, onAdd, onRemove }) {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);

  if (!folders?.length) return null;

  const inFolders = folders.filter((f) => f.spotIds.includes(spotId));

  return (
    <div className="absolute top-3 right-3 z-10">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="p-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white/70 hover:text-white transition"
        aria-label={t('saved.addToFolder')}
        aria-expanded={open}
      >
        <FolderPlus className="w-3.5 h-3.5" />
      </button>
      {open && (
        <div
          className="absolute right-0 mt-1 w-44 rounded-[14px] border border-white/10 bg-[#111] shadow-xl py-1 z-20"
          onClick={(e) => e.stopPropagation()}
        >
          {folders.map((folder) => {
            const active = folder.spotIds.includes(spotId);
            return (
              <button
                key={folder.id}
                type="button"
                onClick={() => {
                  if (active) onRemove?.(folder.id, spotId);
                  else onAdd?.(folder.id, spotId);
                }}
                className={`w-full text-left px-3 py-2 text-xs transition ${
                  active ? 'text-purple-300 bg-purple-500/10' : 'text-white/65 hover:bg-white/[0.05]'
                }`}
              >
                {active ? '✓ ' : ''}
                {folder.name}
              </button>
            );
          })}
        </div>
      )}
      {inFolders.length > 0 && !open && (
        <span className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-purple-400" />
      )}
    </div>
  );
}
