import React, { useState, useEffect, useMemo } from 'react';
import { db } from './firebaseConfig.js';
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Import all components with explicit file extensions to resolve build issues
import Dashboard from './components/Dashboard.jsx';
import UserSelector from './components/UserSelector.jsx';
import ProductList from './components/ProductList.jsx';
import SalesLog from './components/SalesLog.jsx';
import AddProductModal from './components/AddProductModal.jsx';
import EditProductModal from './components/EditProductModal.jsx';
import QuantityModal from './components/QuantityModal.jsx';
import EditSaleModal from './components/EditSaleModal.jsx';
import ConfirmationModal from './components/ConfirmationModal.jsx';
import ComboList from './components/ComboList.jsx';
import CreateComboModal from './components/CreateComboModal.jsx';
import EditComboModal from './components/EditComboModal.jsx';
import CreateOrderModal from './components/CreateOrderModal.jsx';
import ToppingList from './components/ToppingList.jsx';
import AddToppingModal from './components/AddToppingModal.jsx';
import EditToppingModal from './components/EditToppingModal.jsx';
import AddToppingsModal from './components/AddToppingsModal.jsx';
import Login from './components/Login.jsx';
import Layout from './components/Layout.jsx';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('sales');
  const [products, setProducts] = useState([]);
  const [combos, setCombos] = useState([]);
  const [sales, setSales] = useState([]);
  const [toppings, setToppings] = useState([]);
  const [currentUser, setCurrentUser] = useState('User 1');
  const [stallFilter, setStallFilter] = useState('All Stalls');
  const [salesUserFilter, setSalesUserFilter] = useState('All Users');
  const [salesStallFilter, setSalesStallFilter] = useState('All Stalls');
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [comboSearchTerm, setComboSearchTerm] = useState('');

  const [isAddProductModalOpen, setAddProductModalOpen] = useState(false);
  const [isEditProductModalOpen, setEditProductModalOpen] = useState(false);
  const [isQuantityModalOpen, setQuantityModalOpen] = useState(false);
  const [isEditSaleModalOpen, setEditSaleModalOpen] = useState(false);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [isCreateComboModalOpen, setCreateComboModalOpen] = useState(false);
  const [isEditComboModalOpen, setEditComboModalOpen] = useState(false);
  const [isCreateOrderModalOpen, setCreateOrderModalOpen] = useState(false);
  const [isAddToppingModalOpen, setAddToppingModalOpen] = useState(false);
  const [isEditToppingModalOpen, setEditToppingModalOpen] = useState(false);
  const [isAddToppingsToSaleModalOpen, setAddToppingsToSaleModalOpen] = useState(false);
  
  const [productToEdit, setProductToEdit] = useState(null);
  const [saleToProcess, setSaleToProcess] = useState(null);
  const [saleToEdit, setSaleToEdit] = useState(null);
  const [comboToEdit, setComboToEdit] = useState(null);
  const [toppingToEdit, setToppingToEdit] = useState(null);
  const [itemToDelete, setItemToDelete] = useState({ id: null, type: '' });

  const users = ['Pratham', 'Astha', 'Divyansh', 'Nency'];
  const stalls = ["Baker's Version", "Knits' Version"];

  useEffect(() => {
    const loginTimestamp = sessionStorage.getItem('loginTimestamp');
    const twelveHours = 12 * 60 * 60 * 1000;
    if (loginTimestamp && (Date.now() - loginTimestamp < twelveHours)) {
      setIsLoggedIn(true);
    } else {
      sessionStorage.removeItem('loginTimestamp');
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    const unsubProducts = onSnapshot(collection(db, 'products'), snap => setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
    const unsubCombos = onSnapshot(collection(db, 'combos'), snap => setCombos(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
    const unsubToppings = onSnapshot(collection(db, 'toppings'), snap => setToppings(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
    const unsubSales = onSnapshot(collection(db, 'sales'), snap => {
      const salesData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      salesData.sort((a, b) => b.timestamp?.toMillis() - a.timestamp?.toMillis());
      setSales(salesData);
    });
    return () => { unsubProducts(); unsubCombos(); unsubToppings(); unsubSales(); };
  }, [isLoggedIn]);

  const handleLogin = () => {
    sessionStorage.setItem('loginTimestamp', Date.now());
    setIsLoggedIn(true);
  };
  
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => stallFilter === 'All Stalls' || p.stall === stallFilter)
      .filter(p => p.name.toLowerCase().includes(productSearchTerm.toLowerCase()));
  }, [products, stallFilter, productSearchTerm]);

  const filteredCombos = useMemo(() => {
    return combos
      .filter(c => stallFilter === 'All Stalls' || c.stall === stallFilter)
      .filter(c => c.name.toLowerCase().includes(comboSearchTerm.toLowerCase()));
  }, [combos, stallFilter, comboSearchTerm]);

  const filteredSales = useMemo(() => sales.filter(sale => (salesUserFilter === 'All Users' || sale.soldBy === salesUserFilter) && (salesStallFilter === 'All Stalls' || sale.stall === salesStallFilter)), [sales, salesUserFilter, salesStallFilter]);

  const handleAddProduct = async (product) => { await addDoc(collection(db, 'products'), product); setAddProductModalOpen(false); };
  const handleUpdateProduct = async (id, updated) => { await updateDoc(doc(db, 'products', id), updated); setEditProductModalOpen(false); };
  const handleOpenEditProductModal = (product) => { setProductToEdit(product); setEditProductModalOpen(true); };
  const handleDeleteProduct = (id) => { setItemToDelete({ id, type: 'product' }); setConfirmationModalOpen(true); };
  const handleAddCombo = async (combo) => { await addDoc(collection(db, 'combos'), combo); setCreateComboModalOpen(false); };
  const handleUpdateCombo = async (id, updated) => { await updateDoc(doc(db, 'combos', id), updated); setEditComboModalOpen(false); };
  const handleOpenEditComboModal = (combo) => { setComboToEdit(combo); setEditComboModalOpen(true); };
  const handleDeleteCombo = (id) => { setItemToDelete({ id, type: 'combo' }); setConfirmationModalOpen(true); };
  const handleAddTopping = async (topping) => { await addDoc(collection(db, 'toppings'), topping); setAddToppingModalOpen(false); };
  const handleUpdateTopping = async (id, updated) => { await updateDoc(doc(db, 'toppings', id), updated); setEditToppingModalOpen(false); };
  const handleOpenEditToppingModal = (topping) => { setToppingToEdit(topping); setEditToppingModalOpen(true); };
  const handleDeleteTopping = (id) => { setItemToDelete({ id, type: 'topping' }); setConfirmationModalOpen(true); };
  const handleSellClick = (item) => { setSaleToProcess({ ...item, quantity: 1 }); setQuantityModalOpen(true); };
  const handleOrderClick = () => { setCreateOrderModalOpen(true); };
  const handleQuantitySelected = (quantity) => {
    const itemWithQuantity = { ...saleToProcess, quantity };
    setSaleToProcess(itemWithQuantity);
    setQuantityModalOpen(false);
    if (itemWithQuantity.stall === "Baker's Version") { setAddToppingsToSaleModalOpen(true); } 
    else { finalizeSale(itemWithQuantity, [], itemWithQuantity.price * quantity); }
  };
  const handleOrderSelected = (orderItems, total, stall) => {
    const orderWithTotal = { name: 'Custom Order', price: total, stall, isOrder: true, orderItems: Object.values(orderItems).map(({ item, quantity }) => ({ name: item.name, quantity, price: item.price })) };
    setSaleToProcess(orderWithTotal);
    setCreateOrderModalOpen(false);
    if (stall === "Baker's Version") { setAddToppingsToSaleModalOpen(true); } 
    else { finalizeSale(orderWithTotal, [], total); }
  };
  const handleToppingsSelected = (toppingsArray, finalTotal) => { finalizeSale(saleToProcess, toppingsArray, finalTotal); };
  const finalizeSale = async (item, toppings = [], finalPrice) => {
    const saleData = {
      productName: item.name, price: finalPrice, quantity: item.isOrder ? 1 : item.quantity,
      soldBy: currentUser, timestamp: serverTimestamp(), stall: item.stall,
      isCombo: !!item.products, isOrder: !!item.isOrder, toppings: toppings,
    };
    if (saleData.isCombo) { saleData.comboProducts = item.products; }
    if (saleData.isOrder) { saleData.orderItems = item.orderItems; }
    await addDoc(collection(db, 'sales'), saleData);
    setAddToppingsToSaleModalOpen(false);
    setSaleToProcess(null);
  };
  const handleOpenEditSaleModal = (sale) => { setSaleToEdit(sale); setEditSaleModalOpen(true); };
  const handleUpdateSale = async (id, updatedFields) => { await updateDoc(doc(db, 'sales', id), updatedFields); setEditSaleModalOpen(false); };
  const handleDeleteSale = (id) => { setItemToDelete({ id, type: 'sale' }); setConfirmationModalOpen(true); };
  const handleConfirmDelete = async () => {
    if (!itemToDelete.id) return;
    await deleteDoc(doc(db, `${itemToDelete.type}s`, itemToDelete.id)); 
    setConfirmationModalOpen(false);
    setItemToDelete({ id: null, type: '' });
  };
  
  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    const title = `Sales Report: ${salesStallFilter} (${salesUserFilter})`;
    const body = filteredSales.map(sale => {
      let description = '';
      if (sale.isOrder) { description = sale.orderItems.map(i => `${i.quantity}x ${i.name}`).join('\n'); } 
      else { description = `${sale.quantity}x ${sale.productName}`; }
      if (sale.toppings && sale.toppings.length > 0) {
        const toppingsText = sale.toppings.map(t => `+ ${t.quantity}x ${t.name} (₹${t.price.toFixed(2)})`).join('\n');
        description += `\n${toppingsText}`;
      }
      return [ new Date(sale.timestamp?.seconds * 1000).toLocaleString(), description, sale.stall, sale.soldBy, `₹${sale.price.toFixed(2)}` ];
    });
    const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.price, 0);

    doc.setFontSize(18);
    doc.text(title, 14, 22);
    
    autoTable(doc, {
      head: [['Date', 'Description', 'Stall', 'Sold By', 'Total']],
      body: body,
      startY: 30,
    });
    
    const finalY = doc.lastAutoTable.finalY;
    doc.setFontSize(12);
    doc.text(`Total Revenue: ₹${totalRevenue.toFixed(2)}`, 14, finalY + 10);
    doc.save(`sales-report-${new Date().toISOString().slice(0,10)}.pdf`);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <header className="text-center mb-6 md:hidden">
        <h1 className="text-3xl font-bold text-text-dark">Sweetknits Sales</h1>
      </header>
      
      {activeTab === 'sales' && (
        <div className="space-y-8">
          <div className="flex justify-center"><button onClick={handleOrderClick} className="px-8 py-3 bg-purple-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-purple-700 transition-transform transform hover:scale-105">Create Order</button></div>
          <SalesLog sales={filteredSales} users={users} stalls={stalls} onDelete={handleDeleteSale} onEdit={handleOpenEditSaleModal} userFilter={salesUserFilter} onUserFilterChange={setSalesUserFilter} stallFilter={salesStallFilter} onStallFilterChange={setSalesStallFilter} onDownloadPDF={handleGeneratePDF} />
        </div>
      )}

      {activeTab === 'manage' && (
        <div className="space-y-8 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
          <ToppingList toppings={toppings} onAddTopping={() => setAddToppingModalOpen(true)} onEditTopping={handleOpenEditToppingModal} onDeleteTopping={handleDeleteTopping} />
          <ProductList products={filteredProducts} stalls={stalls} filter={stallFilter} onFilterChange={setStallFilter} onSell={handleSellClick} onAddProduct={() => setAddProductModalOpen(true)} onEditProduct={handleOpenEditProductModal} onDeleteProduct={handleDeleteProduct} searchTerm={productSearchTerm} onSearchChange={setProductSearchTerm} />
          <ComboList combos={filteredCombos} stalls={stalls} filter={stallFilter} onFilterChange={setStallFilter} onSell={handleSellClick} onCreateCombo={() => setCreateComboModalOpen(true)} onEditCombo={handleOpenEditComboModal} onDeleteCombo={handleDeleteCombo} searchTerm={comboSearchTerm} onSearchChange={setComboSearchTerm} />
        </div>
      )}

      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          <Dashboard sales={sales} stalls={stalls} />
          <UserSelector users={users} currentUser={currentUser} onSelectUser={setCurrentUser} />
        </div>
      )}

      {/* All Modals remain outside the tab content to be globally accessible */}
      <AddProductModal isOpen={isAddProductModalOpen} onClose={() => setAddProductModalOpen(false)} onSubmit={handleAddProduct} stalls={stalls} />
      <EditProductModal isOpen={isEditProductModalOpen} onClose={() => setEditProductModalOpen(false)} onSubmit={handleUpdateProduct} product={productToEdit} stalls={stalls} />
      <QuantityModal isOpen={isQuantityModalOpen} onClose={() => setQuantityModalOpen(false)} onSubmit={handleQuantitySelected} productName={saleToProcess?.name} />
      <EditSaleModal isOpen={isEditSaleModalOpen} onClose={() => setEditSaleModalOpen(false)} onSubmit={handleUpdateSale} sale={saleToEdit} />
      <ConfirmationModal isOpen={isConfirmationModalOpen} onClose={() => setConfirmationModalOpen(false)} onConfirm={handleConfirmDelete} title="Are you sure?" message={`This will permanently delete this ${itemToDelete.type}.`} />
      <CreateComboModal isOpen={isCreateComboModalOpen} onClose={() => setCreateComboModalOpen(false)} onSubmit={handleAddCombo} products={products} stalls={stalls} />
      <EditComboModal isOpen={isEditComboModalOpen} onClose={() => setEditComboModalOpen(false)} onSubmit={handleUpdateCombo} combo={comboToEdit} stalls={stalls} />
      <CreateOrderModal isOpen={isCreateOrderModalOpen} onClose={() => setCreateOrderModalOpen(false)} onSubmit={handleOrderSelected} products={products} combos={combos} stalls={stalls} />
      <AddToppingModal isOpen={isAddToppingModalOpen} onClose={() => setAddToppingModalOpen(false)} onSubmit={handleAddTopping} />
      <EditToppingModal isOpen={isEditToppingModalOpen} onClose={() => setEditToppingModalOpen(false)} onSubmit={handleUpdateTopping} topping={toppingToEdit} />
      <AddToppingsModal isOpen={isAddToppingsToSaleModalOpen} onClose={() => setAddToppingsToSaleModalOpen(false)} onSubmit={handleToppingsSelected} saleItem={saleToProcess} toppings={toppings} />
    </Layout>
  );
}

