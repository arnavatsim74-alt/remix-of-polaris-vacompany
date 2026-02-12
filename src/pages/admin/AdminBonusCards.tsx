import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreditCard, Plus, Trash2, Upload, Image } from "lucide-react";
import { toast } from "sonner";

interface BonusTier {
  id: string;
  name: string;
  min_hours: number;
  text_color: string;
  card_image_url: string | null;
  sort_order: number;
  is_active: boolean;
}

export default function AdminBonusCards() {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<BonusTier | null>(null);
  const [form, setForm] = useState({ name: "", min_hours: 0, text_color: "text-white", sort_order: 0 });
  const [uploading, setUploading] = useState<string | null>(null);

  const { data: tiers = [], isLoading } = useQuery({
    queryKey: ["admin-bonus-card-tiers"],
    queryFn: async () => {
      const { data } = await supabase
        .from("bonus_card_tiers")
        .select("*")
        .order("sort_order", { ascending: true });
      return (data ?? []) as BonusTier[];
    },
  });

  const openCreate = () => {
    setEditingTier(null);
    setForm({ name: "", min_hours: 0, text_color: "text-white", sort_order: (tiers.length + 1) });
    setDialogOpen(true);
  };

  const openEdit = (tier: BonusTier) => {
    setEditingTier(tier);
    setForm({ name: tier.name, min_hours: tier.min_hours, text_color: tier.text_color, sort_order: tier.sort_order });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name) { toast.error("Name is required"); return; }
    try {
      if (editingTier) {
        const { error } = await supabase.from("bonus_card_tiers").update({
          name: form.name, min_hours: form.min_hours, text_color: form.text_color, sort_order: form.sort_order,
        }).eq("id", editingTier.id);
        if (error) throw error;
        toast.success("Tier updated");
      } else {
        const { error } = await supabase.from("bonus_card_tiers").insert({
          name: form.name, min_hours: form.min_hours, text_color: form.text_color, sort_order: form.sort_order,
        });
        if (error) throw error;
        toast.success("Tier created");
      }
      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin-bonus-card-tiers"] });
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this tier?")) return;
    const { error } = await supabase.from("bonus_card_tiers").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    toast.success("Tier deleted");
    queryClient.invalidateQueries({ queryKey: ["admin-bonus-card-tiers"] });
  };

  const handleToggle = async (tier: BonusTier) => {
    await supabase.from("bonus_card_tiers").update({ is_active: !tier.is_active }).eq("id", tier.id);
    queryClient.invalidateQueries({ queryKey: ["admin-bonus-card-tiers"] });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, tierId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(tierId);
    try {
      const ext = file.name.split(".").pop();
      const name = `card-${tierId}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("bonus-card-images").upload(name, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from("bonus-card-images").getPublicUrl(name);
      await supabase.from("bonus_card_tiers").update({ card_image_url: publicUrl }).eq("id", tierId);
      queryClient.invalidateQueries({ queryKey: ["admin-bonus-card-tiers"] });
      toast.success("Card image uploaded");
    } catch (err: any) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(null);
    }
  };

  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Bonus Card Tiers</h1>
            <p className="text-muted-foreground">Manage AFLV Bonus frequent flyer card tiers</p>
          </div>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" />Add Tier</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTier ? "Edit Tier" : "Add Tier"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Gold" />
              </div>
              <div>
                <Label>Minimum Hours</Label>
                <Input type="number" value={form.min_hours} onChange={e => setForm(f => ({ ...f, min_hours: Number(e.target.value) }))} />
              </div>
              <div>
                <Label>Text Color Class</Label>
                <Input value={form.text_color} onChange={e => setForm(f => ({ ...f, text_color: e.target.value }))} placeholder="text-white or text-black" />
              </div>
              <div>
                <Label>Sort Order</Label>
                <Input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: Number(e.target.value) }))} />
              </div>
              <Button onClick={handleSave} className="w-full">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1,2,3].map(i => <Skeleton key={i} className="h-64" />)}
        </div>
      ) : tiers.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No tiers yet. Add one above.</CardContent></Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tiers.map(tier => (
            <Card key={tier.id} className={!tier.is_active ? "opacity-50" : ""}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{tier.name}</CardTitle>
                  <Switch checked={tier.is_active} onCheckedChange={() => handleToggle(tier)} />
                </div>
                <CardDescription>{tier.min_hours}h minimum · Order {tier.sort_order}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {tier.card_image_url ? (
                  <div className="aspect-[1172/690] w-full overflow-hidden rounded-lg border">
                    <img src={tier.card_image_url} alt={tier.name} className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <div className="aspect-[1172/690] w-full rounded-lg border border-dashed flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Image className="h-6 w-6 mx-auto mb-1 opacity-50" />
                      <p className="text-xs">No custom image</p>
                    </div>
                  </div>
                )}
                <div>
                  <Label className="text-xs">Upload Card Background</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    className="mt-1"
                    onChange={e => handleImageUpload(e, tier.id)}
                    disabled={uploading === tier.id}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(tier)}>Edit</Button>
                  <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleDelete(tier.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
