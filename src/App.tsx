import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { AssetsList } from './components/AssetsList';
import { LicensesList } from './components/LicensesList';
import { AccessoriesList } from './components/AccessoriesList';
import { ConsumablesList } from './components/ConsumablesList';
import { UsersList } from './components/UsersList';
import { EventsList } from './components/EventsList';
import { ActivityLogs } from './components/ActivityLogs';
import { MyPortal } from './components/MyPortal';

import { AssetModal } from './components/modals/AssetModal';
import { CheckoutModal } from './components/modals/CheckoutModal';
import { CheckinModal } from './components/modals/CheckinModal';
import { LicenseAssignModal } from './components/modals/LicenseAssignModal';
import { AccessoryModal } from './components/modals/AccessoryModal';
import { ConsumableModal } from './components/modals/ConsumableModal';
import { AssetDetailModal } from './components/modals/AssetDetailModal';
import { EventModal } from './components/modals/EventModal';
import { EventDetailModal } from './components/modals/EventDetailModal';
import { ExportModal } from './components/modals/ExportModal';
import { BarcodeHub } from './components/BarcodeHub';
import { BarcodeLabelModal } from './components/modals/BarcodeLabelModal';
import { BatchBarcodeModal } from './components/modals/BatchBarcodeModal';
import { ScannerModal } from './components/modals/ScannerModal';
import { LoginPage } from './components/auth/LoginPage';
import { Asset, License, Accessory, Consumable, EventItem } from './types';

const MainLayout: React.FC = () => {
  const { activeTab, isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Modals state
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutAssetId, setCheckoutAssetId] = useState<string | undefined>(undefined);

  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);
  const [checkinAssetId, setCheckinAssetId] = useState<string | undefined>(undefined);

  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);

  const [isAccessoryModalOpen, setIsAccessoryModalOpen] = useState(false);
  const [selectedAccessory, setSelectedAccessory] = useState<Accessory | null>(null);
  const [accessoryMode, setAccessoryMode] = useState<'checkout' | 'checkin'>('checkout');

  const [isConsumableModalOpen, setIsConsumableModalOpen] = useState(false);
  const [selectedConsumable, setSelectedConsumable] = useState<Consumable | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailAsset, setDetailAsset] = useState<Asset | null>(null);

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  const [isEventDetailModalOpen, setIsEventDetailModalOpen] = useState(false);
  const [detailEvent, setDetailEvent] = useState<EventItem | null>(null);

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Barcode & Scanner Modals
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
  const [isBarcodeLabelModalOpen, setIsBarcodeLabelModalOpen] = useState(false);
  const [selectedAssetForLabel, setSelectedAssetForLabel] = useState<Asset | null>(null);
  const [isBatchBarcodeModalOpen, setIsBatchBarcodeModalOpen] = useState(false);

  const handleOpenBarcodeLabel = (asset: Asset) => {
    setSelectedAssetForLabel(asset);
    setIsBarcodeLabelModalOpen(true);
  };

  const handleOpenScanner = () => {
    setIsScannerModalOpen(true);
  };

  const handleOpenBatchBarcode = () => {
    setIsBatchBarcodeModalOpen(true);
  };

  // Keyboard shortcut: Alt+S or Ctrl+K to open Scanner
  React.useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsScannerModalOpen(true);
      } else if (e.altKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        setIsScannerModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  const handleOpenNewAsset = () => {
    setEditingAsset(null);
    setIsAssetModalOpen(true);
  };

  const handleOpenEditAsset = (asset: Asset) => {
    setEditingAsset(asset);
    setIsAssetModalOpen(true);
  };

  const handleOpenCheckout = (assetId?: string) => {
    setCheckoutAssetId(assetId);
    setIsCheckoutModalOpen(true);
  };

  const handleOpenCheckin = (assetId?: string) => {
    setCheckinAssetId(assetId);
    setIsCheckinModalOpen(true);
  };

  const handleOpenLicenseAssign = (lic: License) => {
    setSelectedLicense(lic);
    setIsLicenseModalOpen(true);
  };

  const handleOpenAccessoryCheckout = (acc: Accessory) => {
    setSelectedAccessory(acc);
    setAccessoryMode('checkout');
    setIsAccessoryModalOpen(true);
  };

  const handleOpenAccessoryCheckin = (acc: Accessory) => {
    setSelectedAccessory(acc);
    setAccessoryMode('checkin');
    setIsAccessoryModalOpen(true);
  };

  const handleOpenConsume = (con: Consumable) => {
    setSelectedConsumable(con);
    setIsConsumableModalOpen(true);
  };

  const handleOpenDetail = (asset: Asset) => {
    setDetailAsset(asset);
    setIsDetailModalOpen(true);
  };

  const handleOpenNewEvent = () => {
    setEditingEvent(null);
    setIsEventModalOpen(true);
  };

  const handleOpenEditEvent = (event: EventItem) => {
    setEditingEvent(event);
    setIsEventModalOpen(true);
  };

  const handleOpenDetailEvent = (event: EventItem) => {
    setDetailEvent(event);
    setIsEventDetailModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 font-sans">
      {/* Top Header */}
      <Header 
        onOpenNewAssetModal={handleOpenNewAsset} 
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenScannerModal={handleOpenScanner}
      />

      {/* Body with Sidebar and Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full">
          {activeTab === 'my-portal' && <MyPortal />}
          
          {activeTab === 'dashboard' && (
            <Dashboard
              onOpenNewAssetModal={handleOpenNewAsset}
              onOpenCheckoutModal={handleOpenCheckout}
              onOpenCheckinModal={handleOpenCheckin}
            />
          )}

          {activeTab === 'assets' && (
            <AssetsList
              onOpenNewAssetModal={handleOpenNewAsset}
              onOpenEditAssetModal={handleOpenEditAsset}
              onOpenCheckoutModal={handleOpenCheckout}
              onOpenCheckinModal={handleOpenCheckin}
              onOpenDetailModal={handleOpenDetail}
              onOpenBarcodeLabelModal={handleOpenBarcodeLabel}
              onOpenScannerModal={handleOpenScanner}
              onOpenBatchBarcodeModal={handleOpenBatchBarcode}
            />
          )}

          {activeTab === 'events' && (
            <EventsList
              onOpenNewEventModal={handleOpenNewEvent}
              onOpenEditEventModal={handleOpenEditEvent}
              onOpenDetailModal={handleOpenDetailEvent}
            />
          )}

          {activeTab === 'barcodes' && (
            <BarcodeHub
              onOpenScanner={handleOpenScanner}
              onOpenBatchPrint={handleOpenBatchBarcode}
              onOpenDetailModal={handleOpenDetail}
            />
          )}

          {activeTab === 'licenses' && (
            <LicensesList
              onOpenAssignModal={handleOpenLicenseAssign}
            />
          )}

          {activeTab === 'accessories' && (
            <AccessoriesList
              onOpenCheckoutModal={handleOpenAccessoryCheckout}
              onOpenCheckinModal={handleOpenAccessoryCheckin}
            />
          )}

          {activeTab === 'consumables' && (
            <ConsumablesList
              onOpenConsumeModal={handleOpenConsume}
            />
          )}

          {activeTab === 'users' && <UsersList />}

          {activeTab === 'activity' && <ActivityLogs />}
        </main>
      </div>

      {/* Global Modals */}
      <AssetModal
        isOpen={isAssetModalOpen}
        onClose={() => setIsAssetModalOpen(false)}
        assetToEdit={editingAsset}
      />

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        preselectedAssetId={checkoutAssetId}
      />

      <CheckinModal
        isOpen={isCheckinModalOpen}
        onClose={() => setIsCheckinModalOpen(false)}
        preselectedAssetId={checkinAssetId}
      />

      <LicenseAssignModal
        isOpen={isLicenseModalOpen}
        onClose={() => setIsLicenseModalOpen(false)}
        license={selectedLicense}
      />

      <AccessoryModal
        isOpen={isAccessoryModalOpen}
        onClose={() => setIsAccessoryModalOpen(false)}
        accessory={selectedAccessory}
        mode={accessoryMode}
      />

      <ConsumableModal
        isOpen={isConsumableModalOpen}
        onClose={() => setIsConsumableModalOpen(false)}
        consumable={selectedConsumable}
      />

      <AssetDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        asset={detailAsset}
        onOpenCheckout={handleOpenCheckout}
        onOpenCheckin={handleOpenCheckin}
        onOpenBarcodeLabel={handleOpenBarcodeLabel}
      />

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        eventToEdit={editingEvent}
      />

      <EventDetailModal
        isOpen={isEventDetailModalOpen}
        onClose={() => setIsEventDetailModalOpen(false)}
        event={detailEvent}
        onEdit={handleOpenEditEvent}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

      {/* Barcode & QR Modals */}
      <BarcodeLabelModal
        isOpen={isBarcodeLabelModalOpen}
        onClose={() => setIsBarcodeLabelModalOpen(false)}
        asset={selectedAssetForLabel}
      />

      <BatchBarcodeModal
        isOpen={isBatchBarcodeModalOpen}
        onClose={() => setIsBatchBarcodeModalOpen(false)}
      />

      <ScannerModal
        isOpen={isScannerModalOpen}
        onClose={() => setIsScannerModalOpen(false)}
        onOpenCheckout={handleOpenCheckout}
        onOpenCheckin={handleOpenCheckin}
        onOpenDetail={handleOpenDetail}
        onOpenBarcodeLabel={handleOpenBarcodeLabel}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
};

export default App;
