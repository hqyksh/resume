'use client';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

type Dict = {
  title: string;
  postTitle: string;
  postTitlePlaceholder: string;
  postContent: string;
  postContentPlaceholder: string;
  adminCode: string;
  adminCodePlaceholder: string;
  save: string;
  saving: string;
  cancel: string;
  success: string;
  errorEmpty: string;
  errorCode: string;
  errorNetwork: string;
};

const WritePostModal = ({ open, dict, onClose, onSuccess }: {
  open: boolean;
  dict: Dict;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [code, setCode] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // 每次打开时重置状态
  useEffect(() => {
    if (open) {
      setTitle('');
      setContent('');
      setCode('');
      setSaving(false);
      setError(null);
      setSuccess(false);
    }
  }, [open]);

  // Esc 关闭
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open || !mounted) return null;

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setError(dict.errorEmpty);
      return;
    }
    setSaving(true);
    setError(null);
    // 直接在浏览器端调用 Postgres 的 SECURITY DEFINER 函数：
    // 管理员码在数据库内校验，anon 角色只能 execute 这个函数，
    // 读不到 app_secrets，也不能直接写 wp_posts
    const { error: rpcError } = await supabase.rpc('admin_create_post', {
      p_title: title.trim(),
      p_content: content,
      p_code: code,
    });

    if (rpcError) {
      console.error('admin_create_post error:', rpcError);
      setError(
        rpcError.code === '28000' || rpcError.message?.includes('INVALID_CODE')
          ? dict.errorCode
          : dict.errorNetwork
      );
      setSaving(false);
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      onClose();
      onSuccess();
    }, 1000);
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div
        className="w-full max-w-lg rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{dict.title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            aria-label={dict.cancel}
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 pb-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{dict.postTitle}</label>
            <Input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={dict.postTitlePlaceholder}
              maxLength={500}
              className="w-full"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{dict.postContent}</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder={dict.postContentPlaceholder}
              rows={8}
              maxLength={200000}
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 resize-y min-h-36"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{dict.adminCode}</label>
            <Input
              type="password"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder={dict.adminCodePlaceholder}
              autoComplete="off"
              className="w-full"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-600 dark:text-green-400">{dict.success}</p>}

          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" onClick={onClose} disabled={saving} className="cursor-pointer">
              {dict.cancel}
            </Button>
            <Button onClick={handleSave} disabled={saving || success} className="cursor-pointer">
              {saving ? dict.saving : dict.save}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default WritePostModal;
