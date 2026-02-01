import {
    Box, Package, ShoppingBag, Archive, Mail,
    LayoutList, Layers, ArchiveRestore, Briefcase,
    Backpack, Cpu, FolderOpen, Gift, CircleDashed
} from 'lucide-react';

export const TUB_VARIANTS = {
    bin: { id: 'bin', label: 'Storage Bin', icon: Box },
    box: { id: 'box', label: 'Cardboard Box', icon: Package },
    bag: { id: 'bag', label: 'Bag / Tote', icon: ShoppingBag },
    crate: { id: 'crate', label: 'Crate', icon: Archive },
    envelope: { id: 'envelope', label: 'Envelope', icon: Mail },
    drawer: { id: 'drawer', label: 'Drawer', icon: LayoutList },
    shelf: { id: 'shelf', label: 'Shelf', icon: Layers },
    cabinet: { id: 'cabinet', label: 'Cabinet', icon: ArchiveRestore },
    suitcase: { id: 'suitcase', label: 'Suitcase', icon: Briefcase },
    backpack: { id: 'backpack', label: 'Backpack', icon: Backpack },
    electronics: { id: 'electronics', label: 'Electronics', icon: Cpu },
    files: { id: 'files', label: 'Files', icon: FolderOpen },
    gift: { id: 'gift', label: 'Gift', icon: Gift },
    other: { id: 'other', label: 'Other', icon: CircleDashed }
};

export const getVariantIcon = (id) => {
    return TUB_VARIANTS[id]?.icon || TUB_VARIANTS['other'].icon;
};

export const getVariantLabel = (id) => {
    return TUB_VARIANTS[id]?.label || 'Container';
};
