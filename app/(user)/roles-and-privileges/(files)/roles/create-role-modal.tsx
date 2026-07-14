'use client';

import { useState, useEffect } from 'react';
import { Modal, ModalFooter } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { createRole } from '@/lib/roles-api';
import { privilegesApi, Privilege } from '@/lib/privileges-api';
import { useDataTable } from '@/hooks/useDataTable';
import { splitSnakeCase } from '@/lib/utils/helperFns';

interface CreateRoleModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateRoleModal({ open, onClose, onSuccess }: CreateRoleModalProps) {
  const { fetchData } = useDataTable({ api: privilegesApi });
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [allPrivileges, setAllPrivileges] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);

  const fetchPrivileges = async () => {
    const response = await fetchData({ page: 1 });
    setAllPrivileges(response?.data ?? []);
  };

  useEffect(() => {
    if (open) {
      fetchPrivileges();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Auto-generate slug from name unless manually edited
  useEffect(() => {
    if (!slugTouched && name) {
      setSlug(name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
    }
  }, [name, slugTouched]);

  const reset = () => {
    setName('');
    setSlug('');
    setDescription('');
    setSelectedIds([]);
    setSlugTouched(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res: any = await createRole({
        name,
        slug,
        description: description || undefined,
        privilegeIds: selectedIds.length > 0 ? selectedIds : undefined,
      });
      if (res?.code === 200) {
        reset();
        onClose();
        onSuccess();
      }
    } catch (error) {
      // toast handled by apiRequest
    } finally {
      setLoading(false);
    }
  };

  const togglePrivilege = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Group privileges by module
  const grouped = allPrivileges.reduce((acc: Record<string, any[]>, p: any) => {
    const mod = p.module || 'Other';
    if (!acc[mod]) acc[mod] = [];
    acc[mod].push(p);
    return acc;
  }, {});

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create Role"
      description="Create a new role and assign privileges to it"
      size="lg"
      footer={
        <ModalFooter
          onCancel={onClose}
          onSubmit={handleSubmit}
          submitText="Create Role"
          loading={loading}
          disabled={!name.trim() || !slug.trim()}
        />
      }
    >
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1.5 block">Role Name</label>
          <Input
            placeholder="e.g. Branch Manager"
            value={name}
            onChange={(e: any) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">Slug</label>
          <Input
            placeholder="e.g. branch-manager"
            value={slug}
            onChange={(e: any) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Lowercase identifier. Auto-generated from name.
          </p>
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">Description (optional)</label>
          <Input
            placeholder="What can users with this role do?"
            value={description}
            onChange={(e: any) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Privileges</label>
          <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
            {Object.entries(grouped).map(([module, privileges]) => (
              <div key={module}>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  {module}
                </p>
                <div className="space-y-2 pl-1">
                  {(privileges as any[]).map((p: any) => (
                    <label key={p.id} className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox
                        checked={selectedIds.includes(p.id)}
                        onChange={() => togglePrivilege(p.id)}
                      />
                      <span className="text-sm">{p.name || splitSnakeCase(p.code)}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
