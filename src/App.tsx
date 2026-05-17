import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { 
  Shield, 
  Users, 
  Heart, 
  Mail, 
  RefreshCw, 
  Clock, 
  Phone, 
  MapPin, 
  Calendar, 
  Lock, 
  Search,
  Eye,
  EyeOff,
  Trash2,
  X,
  Printer,
  TrendingUp,
  AlertCircle,
  LogOut
} from 'lucide-react';

// Sample mock databases as fallback if Express API is offline
const MOCK_FAMILIES = [
  {
    id: "REG_1778999990001",
    familyName: "Valel Family (വാലേൽ കുടുംബം)",
    headName: "Mr. Abraham Valel",
    familyWard: "St. Mary's Ward",
    phone: "9847123456",
    address: "Valel House, Kozhikkode Road, Edakkara",
    members: [
      { name: "Abraham Valel", relation: "Head of Family", age: 58 },
      { name: "Mariamma Abraham", relation: "Spouse", age: 52 },
      { name: "Thomas Abraham", relation: "Son", age: 26 }
    ],
    status: "Approved",
    submittedAt: "2026-05-15T08:30:00.000Z"
  },
  {
    id: "REG_1778999990002",
    familyName: "Malayil Family (മലയിൽ കുടുംബം)",
    headName: "Mr. Josh Mayilil",
    familyWard: "St. George Ward",
    phone: "9847654321",
    address: "Malayil House, Edakkara P.O.",
    members: [
      { name: "Josh Mayilil", relation: "Head of Family", age: 45 },
      { name: "Anitha Josh", relation: "Spouse", age: 40 },
      { name: "Tessa Josh", relation: "Daughter", age: 14 }
    ],
    status: "Approved",
    submittedAt: "2026-05-16T10:15:00.000Z"
  }
];

const MOCK_OFFERINGS = [
  {
    id: "DON_1778999990201",
    fullName: "Mr. Abraham Valel",
    email: "abraham.valel@gmail.com",
    phone: "9847123456",
    amount: 5000,
    cause: "housing",
    notes: "Snehasparsham 2026 housing brick fund contribution.",
    status: "Acknowledged",
    submittedAt: "2026-05-16T11:45:00.000Z"
  },
  {
    id: "DON_1778999990202",
    fullName: "Mr. Josh Mayilil",
    email: "josh.m@stgeorge.org",
    phone: "9847654321",
    amount: 2500,
    cause: "school",
    notes: "Catechism Bible Arts festival feast support contribution.",
    status: "Acknowledged",
    submittedAt: "2026-05-17T08:12:00.000Z"
  },
  {
    id: "DON_1778999990203",
    fullName: "Mariamma Sebastian",
    email: "mariamma.s@hotmail.com",
    phone: "9447112233",
    amount: 1000,
    cause: "mass",
    notes: "Holy Liturgy Intention offering for the departed soul of my father Sebastian.",
    status: "Pending Acknowledgement",
    submittedAt: "2026-05-17T10:30:00.000Z"
  }
];

const MOCK_CONTACTS = [
  {
    id: "CON_1778999990101",
    name: "Joseph Mathew",
    email: "joseph.mathew@gmail.com",
    subject: "vicar",
    message: "Dear Father Thomas, we would love to schedule a home blessing and special family prayer at our residence in Edakkara next Tuesday evening if you are available.",
    status: "Pending Action",
    submittedAt: "2026-05-16T14:22:00.000Z"
  },
  {
    id: "CON_1778999990102",
    name: "Grace Kurian",
    email: "grace.k@yahoo.com",
    subject: "sacrament",
    message: "Hello Parish Office, my fiancé and I are seeking to book St. George Church for our sacramental marriage blessing on September 14th, 2026. Please let us know the pre-cana requirements.",
    status: "Resolved",
    submittedAt: "2026-05-17T09:05:00.000Z"
  }
];

const MOCK_USERS = [
  {
    id: "USR_SUPERADMIN",
    username: "admin",
    displayName: "Super Administrator",
    role: "super_admin",
    committee: "Parish Administration",
    permissions: [
      'view_dashboard',
      'view_families',
      'manage_families',
      'view_offerings',
      'manage_offerings',
      'view_contacts',
      'manage_contacts',
      'manage_users'
    ],
    isActive: true,
    createdAt: "2026-05-15T08:00:00.000Z"
  },
  {
    id: "USR_1778999990901",
    username: "trustee",
    displayName: "Mr. Abraham Valel (Trustee)",
    role: "committee_member",
    committee: "Parish Committee",
    permissions: ['view_dashboard', 'view_families', 'view_offerings', 'manage_offerings'],
    isActive: true,
    createdAt: "2026-05-16T09:00:00.000Z"
  }
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('cms_auth') === 'true');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin@1976');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'families' | 'offerings' | 'contacts' | 'users'>('dashboard');
  const [families, setFamilies] = useState<any[]>(MOCK_FAMILIES);
  const [offerings, setOfferings] = useState<any[]>(MOCK_OFFERINGS);
  const [contacts, setContacts] = useState<any[]>(MOCK_CONTACTS);
  const [users, setUsers] = useState<any[]>(MOCK_USERS);
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'Online' | 'Offline' | 'Checking'>('Checking');
  const [selectedFamily, setSelectedFamily] = useState<any | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; type: 'family' | 'offering' | 'contact' | 'user'; name: string } | null>(null);

  // User form states
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [formUsername, setFormUsername] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formDisplayName, setFormDisplayName] = useState('');
  const [formRole, setFormRole] = useState('committee_member');
  const [formCommittee, setFormCommittee] = useState('General');
  const [formPermissions, setFormPermissions] = useState<string[]>([
    'view_dashboard',
    'view_families',
    'view_offerings',
    'view_contacts'
  ]);

  // API Backend URL
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const fetchData = async () => {
    setLoading(true);
    setBackendStatus('Checking');
    try {
      const token = localStorage.getItem('cms_token');
      const headers: any = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      // 1. Fetch Families
      const famRes = await fetch(`${API_URL}/register-family`, { headers });
      const famJSON = await famRes.json();
      
      // 2. Fetch Offerings
      const offRes = await fetch(`${API_URL}/donations`, { headers });
      const offJSON = await offRes.json();

      // 3. Fetch Contacts
      const conRes = await fetch(`${API_URL}/contact`, { headers });
      const conJSON = await conRes.json();

      if (famJSON.success) setFamilies(famJSON.data);
      if (offJSON.success) setOfferings(offJSON.data);
      if (conJSON.success) setContacts(conJSON.data);

      // 4. Fetch Users
      try {
        const userRes = await fetch(`${API_URL}/users`, { headers });
        const userJSON = await userRes.json();
        if (userJSON.success) setUsers(userJSON.data);
      } catch (err) {
        console.warn("User management not authorized for this profile or offline");
      }
      
      setBackendStatus('Online');
    } catch (err) {
      console.warn("CMS Express server is offline, using premium local storage cache.");
      setBackendStatus('Offline');
      // Set mock data
      setFamilies(MOCK_FAMILIES);
      setOfferings(MOCK_OFFERINGS);
      setContacts(MOCK_CONTACTS);
      setUsers(MOCK_USERS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (data.success && data.token) {
        localStorage.setItem('cms_token', data.token);
        localStorage.setItem('cms_auth', 'true');
        setIsAuthenticated(true);
        setLoginError('');
      } else {
        setLoginError(data.error || 'Invalid Username or Password. Please try again.');
      }
    } catch (err) {
      setLoginError('Failed to connect to server. Please check the backend is running.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('cms_auth');
    localStorage.removeItem('cms_token');
    setUsername('');
    setPassword('');
    setLoginError('');
    setShowLogoutConfirm(false);
  };

  const handleUpdateFamilyStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Approved' ? 'Pending Approval' : 'Approved';
    if (backendStatus === 'Online') {
      try {
        const token = localStorage.getItem('cms_token');
        const headers: any = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        
        const res = await fetch(`${API_URL}/register-family/${id}/status`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({ status: nextStatus })
        });
        if (res.ok) {
          fetchData();
          toast.success(`Family status updated to ${nextStatus}!`);
        } else {
          toast.error("Failed to update family status.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to connect to server.");
      }
    } else {
      // Offline local update
      setFamilies(prev => prev.map(f => f.id === id ? { ...f, status: nextStatus } : f));
      toast.success(`[Offline] Family status updated to ${nextStatus}!`);
    }
  };

  const triggerDeleteConfirm = (id: string, type: 'family' | 'offering' | 'contact' | 'user', name: string) => {
    if (type === 'user' && id === 'USR_SUPERADMIN') {
      alert("Cannot delete primary Super Admin user.");
      return;
    }
    setDeleteTarget({ id, type, name });
    setShowDeleteConfirm(true);
  };

  const executeDelete = async () => {
    if (!deleteTarget) return;
    const { id, type, name } = deleteTarget;

    if (backendStatus === 'Online') {
      try {
        const token = localStorage.getItem('cms_token');
        const headers: any = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        let path = '';
        if (type === 'family') path = `/register-family/${id}`;
        else if (type === 'offering') path = `/donations/${id}`;
        else if (type === 'contact') path = `/contact/${id}`;
        else if (type === 'user') path = `/users/${id}`;

        const res = await fetch(`${API_URL}${path}`, {
          method: 'DELETE',
          headers
        });

        if (res.ok) {
          fetchData();
          toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} "${name}" deleted permanently.`);
        } else {
          const data = await res.json();
          toast.error(data.error || `Failed to delete ${type}.`);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to connect to server.");
      }
    } else {
      // Offline local delete
      if (type === 'family') {
        setFamilies(prev => prev.filter(f => f.id !== id));
      } else if (type === 'offering') {
        setOfferings(prev => prev.filter(o => o.id !== id));
      } else if (type === 'contact') {
        setContacts(prev => prev.filter(c => c.id !== id));
      } else if (type === 'user') {
        setUsers(prev => prev.filter(u => u.id !== id));
      }
      toast.success(`[Offline] Deleted ${type} "${name}" permanently.`);
    }

    setShowDeleteConfirm(false);
    setDeleteTarget(null);
  };

  const handleUpdateOfferingStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Acknowledged' ? 'Pending Acknowledgement' : 'Acknowledged';
    if (backendStatus === 'Online') {
      try {
        const token = localStorage.getItem('cms_token');
        const headers: any = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        
        const res = await fetch(`${API_URL}/donations/${id}/status`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({ status: nextStatus })
        });
        if (res.ok) {
          fetchData();
          toast.success(`Offering status updated to ${nextStatus}!`);
        } else {
          toast.error("Failed to update offering status.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to connect to server.");
      }
    } else {
      setOfferings(prev => prev.map(o => o.id === id ? { ...o, status: nextStatus } : o));
      toast.success(`[Offline] Offering status updated to ${nextStatus}!`);
    }
  };

  const handleUpdateContactStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Resolved' ? 'Pending Action' : 'Resolved';
    if (backendStatus === 'Online') {
      try {
        const token = localStorage.getItem('cms_token');
        const headers: any = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        
        const res = await fetch(`${API_URL}/contact/${id}/status`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({ status: nextStatus })
        });
        if (res.ok) {
          fetchData();
          toast.success(`Request status updated to ${nextStatus}!`);
        } else {
          toast.error("Failed to update status.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to connect to server.");
      }
    } else {
      setContacts(prev => prev.map(c => c.id === id ? { ...c, status: nextStatus } : c));
      toast.success(`[Offline] Request status updated to ${nextStatus}!`);
    }
  };


  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUsername || !formDisplayName || (!editingUser && !formPassword)) {
      toast.error("Username, Display Name and Password are required.");
      return;
    }

    const payload: any = {
      username: formUsername,
      displayName: formDisplayName,
      role: formRole,
      committee: formCommittee,
      permissions: formPermissions
    };
    if (formPassword) payload.password = formPassword;

    if (backendStatus === 'Online') {
      try {
        const token = localStorage.getItem('cms_token');
        const headers: any = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        let res;
        if (editingUser) {
          res = await fetch(`${API_URL}/users/${editingUser.id}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(payload)
          });
        } else {
          res = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload)
          });
        }

        const data = await res.json();
        if (data.success) {
          fetchData();
          setShowUserModal(false);
          resetUserForm();
          toast.success(editingUser ? "User updated successfully!" : "User account created successfully!");
        } else {
          toast.error(data.error || "Failed to save user.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to connect to server.");
      }
    } else {
      if (editingUser) {
        setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...payload } : u));
        toast.success("[Offline] User updated successfully!");
      } else {
        const newUser = {
          id: `USR_${Date.now()}`,
          ...payload,
          isActive: true,
          createdAt: new Date().toISOString()
        };
        setUsers(prev => [...prev, newUser]);
        toast.success("[Offline] User account created successfully!");
      }
      setShowUserModal(false);
      resetUserForm();
    }
  };


  const resetUserForm = () => {
    setEditingUser(null);
    setFormUsername('');
    setFormPassword('');
    setFormDisplayName('');
    setFormRole('committee_member');
    setFormCommittee('General');
    setFormPermissions([
      'view_dashboard',
      'view_families',
      'view_offerings',
      'view_contacts'
    ]);
  };

  const openEditUserModal = (user: any) => {
    setEditingUser(user);
    setFormUsername(user.username);
    setFormPassword('');
    setFormDisplayName(user.displayName);
    setFormRole(user.role);
    setFormCommittee(user.committee);
    setFormPermissions(user.permissions || []);
    setShowUserModal(true);
  };

  const printRoster = () => {
    window.print();
  };

  // Helper stats
  const totalOfferings = offerings.reduce((sum, item) => sum + (item.status === 'Acknowledged' ? item.amount : 0), 0);
  const pendingRegistrations = families.filter(f => f.status !== 'Approved').length;
  const pendingOfferings = offerings.filter(o => o.status !== 'Acknowledged').length;
  const pendingContacts = contacts.filter(c => c.status !== 'Resolved').length;
  const totalParishioners = families.reduce((sum, item) => sum + (item.members?.length || 0), 0);

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle, #1a0b0f 0%, #080405 100%)',
        padding: '24px'
      }}>
        <div className="glass-panel" style={{
          maxWidth: '450px',
          width: '100%',
          padding: '40px',
          textAlign: 'center',
          boxSizing: 'border-box'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'rgba(212, 175, 47, 0.1)',
            border: '1px solid rgba(212, 175, 47, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px auto'
          }}>
            <Lock style={{ width: '24px', height: '24px', color: '#d4af2f' }} />
          </div>

          <h2 style={{ fontSize: '20px', color: '#ffffff', letterSpacing: '0.1em', marginBottom: '8px' }}>
            Parish Administration
          </h2>
          <p style={{ fontSize: '11px', color: '#a6989b', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '24px' }}>
            St. George Edakkara CMS
          </p>

          <form onSubmit={handleLogin}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left', marginBottom: '24px' }}>
              {/* Username Input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#d4af2f', fontWeight: 'bold' }}>
                  Username
                </label>
                <input 
                  type="text" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  className="cms-input"
                  placeholder="e.g. vicar"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>

              {/* Password Input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#d4af2f', fontWeight: 'bold' }}>
                  Passkey / Password
                </label>
                <div style={{ position: 'relative', width: '100%' }}>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    className="cms-input"
                    placeholder="Hint: 1976"
                    style={{ width: '100%', boxSizing: 'border-box', paddingRight: '42px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      border: 'none',
                      background: 'transparent',
                      color: '#d4af2f',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0,
                      cursor: 'pointer'
                    }}
                  >
                    {showPassword ? <EyeOff style={{ width: '18px', height: '18px' }} /> : <Eye style={{ width: '18px', height: '18px' }} />}
                  </button>
                </div>
              </div>

              {loginError && (
                <p style={{ color: '#f87171', fontSize: '11px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertCircle style={{ width: '12px', height: '12px' }} />
                  {loginError}
                </p>
              )}
            </div>

            <button type="submit" className="cms-btn cms-btn-primary" style={{ width: '100%' }}>
              Unlock Dashboard
            </button>
          </form>

          <p style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.3)', marginTop: '24px' }}>
            Secured Local Intranet Panel
          </p>
        </div>
      </div>
    );
  }

  // Active Tab Rendering
  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#080405', color: '#ffffff' }}>
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="glass-panel" style={{
        width: '280px',
        margin: '16px',
        padding: '24px',
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexShrink: 0
      }}>
        <div>
          {/* Header Title */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '40px', paddingBottom: '16px', borderBottom: '1px solid rgba(212, 175, 47, 0.15)' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(124, 26, 70, 0.2)',
              border: '1px solid rgba(212, 175, 47, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Shield style={{ width: '20px', height: '20px', color: '#d4af2f' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '13px', letterSpacing: '0.05em', color: '#ffffff', fontWeight: 'bold' }}>
                ST. GEORGE
              </h2>
              <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.25em', color: '#d4af2f', display: 'block' }}>
                CMS & ADMIN
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { id: 'dashboard', name: 'Dashboard', icon: Shield, badge: pendingRegistrations + pendingOfferings + pendingContacts },
              { id: 'families', name: 'Family Roster', icon: Users, badge: pendingRegistrations },
              { id: 'offerings', name: 'Holy Offerings', icon: Heart, badge: pendingOfferings },
              { id: 'contacts', name: 'Prayer Requests', icon: Mail, badge: pendingContacts },
              { id: 'users', name: 'Admin Users', icon: Lock, badge: 0 }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id as any); setSearchQuery(''); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: 'none',
                    background: isActive ? 'linear-gradient(90deg, #7c1a2e 0%, rgba(124,26,46,0.1) 100%)' : 'transparent',
                    cursor: 'pointer',
                    color: isActive ? '#ffffff' : '#a6989b',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '13px',
                    fontWeight: isActive ? '600' : '400',
                    transition: 'all 0.3s'
                  }}
                  className={isActive ? 'glow-maroon' : ''}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Icon style={{ width: '16px', height: '16px', color: isActive ? '#d4af2f' : '#a6989b' }} />
                    <span>{tab.name}</span>
                  </div>
                  {tab.badge > 0 && (
                    <span style={{
                      fontSize: '9px',
                      background: '#7c1a2e',
                      color: '#d4af2f',
                      fontWeight: 'bold',
                      padding: '2px 7px',
                      borderRadius: '10px',
                      border: '1px solid rgba(212, 175, 47, 0.2)'
                    }}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Vicar status footer */}
        <div style={{
          padding: '16px',
          borderRadius: '12px',
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#a6989b' }}>
              Server Node
            </span>
            <span style={{
              fontSize: '9px',
              padding: '2px 8px',
              borderRadius: '999px',
              fontWeight: 'bold',
              background: backendStatus === 'Online' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: backendStatus === 'Online' ? '#4ade80' : '#f87171',
              border: backendStatus === 'Online' ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)'
            }}>
              {backendStatus}
            </span>
          </div>
          <p style={{ fontSize: '11px', color: '#ffffff', fontWeight: '500' }}>
            Rev. Fr. Thomas Kaloor
          </p>
          <span style={{ fontSize: '9px', color: '#a6989b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Chief Parish Vicar
          </span>
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <button 
              onClick={fetchData} 
              disabled={loading}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                background: 'transparent',
                border: '1px solid rgba(212, 175, 47, 0.2)',
                borderRadius: '8px',
                color: '#d4af2f',
                padding: '8px',
                fontSize: '11px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.2s'
              }}
            >
              <RefreshCw 
                style={{ width: '12px', height: '12px' }} 
                className={loading ? 'animate-spin' : ''} 
              />
              Sync
            </button>
            <button 
              onClick={() => setShowLogoutConfirm(true)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                background: 'rgba(124, 26, 46, 0.15)',
                border: '1px solid rgba(124, 26, 46, 0.3)',
                borderRadius: '8px',
                color: '#f87171',
                padding: '8px',
                fontSize: '11px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.2s'
              }}
            >
              <LogOut style={{ width: '12px', height: '12px' }} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN WORKSPACE CONTENT */}
      <main style={{ flexGrow: 1, padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px', overflowY: 'auto', maxHeight: '100vh', boxSizing: 'border-box' }}>
        
        {/* Header toolbar */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '24px', letterSpacing: '0.05em', color: '#ffffff', fontWeight: 'bold' }}>
              {activeTab === 'dashboard' && "Vicar's Administrative Desk"}
              {activeTab === 'families' && "Parishioner Family Roster"}
              {activeTab === 'offerings' && "Holy Intentions Ledger"}
              {activeTab === 'contacts' && "Pastoral Counseling & Inquiries"}
              {activeTab === 'users' && "Administrative Team Registry"}
            </h1>
            <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#d4af2f', marginTop: '4px' }}>
              St. George Malankara Catholic Church, Edakkara
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {activeTab === 'families' && (
              <button onClick={printRoster} className="cms-btn cms-btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Printer style={{ width: '13px', height: '13px' }} />
                Print Roster
              </button>
            )}
            <div style={{ fontSize: '11px', color: '#a6989b', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <Calendar style={{ width: '12px', height: '12px', color: '#d4af2f' }} />
              <span>Local Time: 11:25 AM</span>
            </div>
          </div>
        </header>

        {/* 1. DASHBOARD TAB VIEW */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* KPI STAT CARDS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
              {[
                { title: 'Registered Families', value: families.length, sub: `${totalParishioners} active members`, icon: Users, color: 'gold' },
                { title: 'Holy Offerings Tally', value: `₹${totalOfferings.toLocaleString()}`, sub: `${offeringCauseCount('housing')} housing brick funds`, icon: Heart, color: 'maroon' },
                { title: 'Pending Reviews', value: pendingRegistrations, sub: 'Needs Vicar approval', icon: Clock, color: 'gold' },
                { title: 'Pastoral Petitions', value: pendingContacts, sub: 'Awaiting Vicar reply', icon: Mail, color: 'maroon' }
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="glass-panel" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#a6989b', fontWeight: '500' }}>
                        {stat.title}
                      </span>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        background: stat.color === 'gold' ? 'rgba(212, 175, 47, 0.1)' : 'rgba(124, 26, 46, 0.15)',
                        border: stat.color === 'gold' ? '1px solid rgba(212, 175, 47, 0.2)' : '1px solid rgba(124, 26, 46, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Icon style={{ width: '16px', height: '16px', color: stat.color === 'gold' ? '#d4af2f' : '#7c1a2e' }} />
                      </div>
                    </div>
                    <h3 style={{ fontSize: '28px', color: '#ffffff', fontWeight: 'bold', marginBottom: '6px' }}>
                      {stat.value}
                    </h3>
                    <span style={{ fontSize: '12px', color: '#a6989b' }}>
                      {stat.sub}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* QUICK ACTIONS & FEED VIEW */}
            <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '24px' }}>
              
              {/* Recent Family registrations */}
              <div className="glass-panel" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '16px', color: '#ffffff', letterSpacing: '0.05em', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Users style={{ width: '16px', height: '16px', color: '#d4af2f' }} />
                  Recent Family Registrations
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {families.slice(0, 3).map((fam, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px',
                      borderRadius: '12px',
                      background: 'rgba(0, 0, 0, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.03)'
                    }}>
                      <div>
                        <h4 style={{ fontSize: '14px', color: '#ffffff', fontWeight: '600' }}>{fam.familyName}</h4>
                        <span style={{ fontSize: '11px', color: '#a6989b', display: 'block', marginTop: '3px' }}>
                          Head: {fam.headName} • {fam.familyWard}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span className={`badge ${fam.status === 'Approved' ? 'badge-approved' : 'badge-pending'}`}>
                          {fam.status}
                        </span>
                        <button 
                          onClick={() => handleUpdateFamilyStatus(fam.id, fam.status)} 
                          className="cms-btn cms-btn-outline" 
                          style={{ padding: '4px 10px', fontSize: '9px' }}
                        >
                          Toggle Approval
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Parish Offerings Causes distribution */}
              <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '16px', color: '#ffffff', letterSpacing: '0.05em', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <TrendingUp style={{ width: '16px', height: '16px', color: '#d4af2f' }} />
                    Offering Collections by Cause
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {[
                      { name: 'Snehasparsham 2026 housing brick fund', id: 'housing' },
                      { name: 'General Parish Sustenance', id: 'general' },
                      { name: 'Catechism School Support', id: 'school' },
                      { name: 'Holy Liturgy Intention Offerings', id: 'mass' }
                    ].map((cause, idx) => {
                      const amount = sumCauseAmount(cause.id);
                      const percent = totalOfferings > 0 ? (amount / totalOfferings) * 100 : 0;
                      return (
                        <div key={idx}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                            <span style={{ color: '#e5e5e5' }}>{cause.name}</span>
                            <span style={{ color: '#d4af2f', fontWeight: 'bold' }}>₹{amount.toLocaleString()}</span>
                          </div>
                          <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${percent}%`, height: '100%', background: 'var(--primary-gold)', borderRadius: '3px' }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 2. FAMILY ROSTER TAB VIEW */}
        {activeTab === 'families' && (
          <div className="glass-panel" style={{ padding: '24px' }}>
            
            {/* Search/Filter Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px' }}>
              <div style={{ position: 'relative', width: '350px' }}>
                <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', color: '#a6989b' }} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search families by head name or ward..."
                  className="cms-input"
                  style={{ width: '100%', paddingLeft: '36px', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ fontSize: '12px', color: '#a6989b' }}>
                Showing {filteredFamilies().length} of {families.length} families
              </div>
            </div>

            {/* Families table */}
            <table className="cms-table">
              <thead>
                <tr>
                  <th>Family Name</th>
                  <th>Head of Family</th>
                  <th>Parish Ward</th>
                  <th>Contact Phone</th>
                  <th>Members Count</th>
                  <th>Registration Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFamilies().map((fam) => (
                  <tr key={fam.id}>
                    <td>
                      <div style={{ fontWeight: 'bold', color: '#ffffff' }}>{fam.familyName}</div>
                      <span style={{ fontSize: '10px', color: '#a6989b', display: 'block', marginTop: '2px' }}>ID: {fam.id}</span>
                    </td>
                    <td>{fam.headName}</td>
                    <td>{fam.familyWard}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Phone style={{ width: '12px', height: '12px', color: '#d4af2f' }} />
                        <span>{fam.phone}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ padding: '3px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontWeight: 'bold' }}>
                        {fam.members?.length || 0} Members
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${fam.status === 'Approved' ? 'badge-approved' : 'badge-pending'}`}>
                        {fam.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => setSelectedFamily(fam)} 
                          className="cms-btn cms-btn-outline" 
                          style={{ padding: '6px 12px', fontSize: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Eye style={{ width: '12px', height: '12px' }} />
                          View
                        </button>
                        <button 
                          onClick={() => handleUpdateFamilyStatus(fam.id, fam.status)} 
                          className="cms-btn cms-btn-primary" 
                          style={{ padding: '6px 12px', fontSize: '10px' }}
                        >
                          {fam.status === 'Approved' ? 'Suspend' : 'Approve'}
                        </button>
                        <button 
                          onClick={() => triggerDeleteConfirm(fam.id, 'family', fam.familyName)} 
                          className="cms-btn cms-btn-primary" 
                          style={{ padding: '6px 12px', fontSize: '10px', background: '#7c1a2e', border: '1px solid #f87171', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Delete family"
                        >
                          <Trash2 style={{ width: '12px', height: '12px' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. HOLY OFFERINGS TAB VIEW */}
        {activeTab === 'offerings' && (
          <div className="glass-panel" style={{ padding: '24px' }}>
            <table className="cms-table">
              <thead>
                <tr>
                  <th>Offering Date</th>
                  <th>Donor Name</th>
                  <th>Offering Cause</th>
                  <th>Offering Amount</th>
                  <th>Special Intentions / Notes</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {offerings.map((off) => (
                  <tr key={off.id}>
                    <td>{new Date(off.submittedAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ fontWeight: 'bold', color: '#ffffff' }}>{off.fullName}</div>
                      <span style={{ fontSize: '10px', color: '#a6989b', display: 'block', marginTop: '2px' }}>Phone: {off.phone}</span>
                    </td>
                    <td style={{ textTransform: 'capitalize', color: '#d4af2f', fontWeight: '500' }}>
                      {off.cause === 'housing' && 'Snehasparsham Brick Fund'}
                      {off.cause === 'school' && 'Catechism School support'}
                      {off.cause === 'mass' && 'Liturgy Intention Mass'}
                      {off.cause === 'general' && 'General Sustainance'}
                    </td>
                    <td style={{ fontSize: '15px', fontWeight: 'bold', color: '#4ade80' }}>
                      ₹{off.amount.toLocaleString()}
                    </td>
                    <td style={{ maxWidth: '280px', fontSize: '12px', fontStyle: 'italic', color: '#a6989b' }}>
                      {off.notes || 'None'}
                    </td>
                    <td>
                      <span className={`badge ${off.status === 'Acknowledged' ? 'badge-approved' : 'badge-pending'}`}>
                        {off.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => handleUpdateOfferingStatus(off.id, off.status)}
                          className="cms-btn cms-btn-outline" 
                          style={{ padding: '6px 12px', fontSize: '10px' }}
                        >
                          {off.status === 'Acknowledged' ? 'Reset Status' : 'Acknowledge'}
                        </button>
                        <button 
                          onClick={() => triggerDeleteConfirm(off.id, 'offering', off.fullName)} 
                          className="cms-btn cms-btn-primary" 
                          style={{ padding: '6px 12px', fontSize: '10px', background: '#7c1a2e', border: '1px solid #f87171', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Delete offering"
                        >
                          <Trash2 style={{ width: '12px', height: '12px' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 4. PRAYER REQUESTS & CONTACT TAB VIEW */}
        {activeTab === 'contacts' && (
          <div className="glass-panel" style={{ padding: '24px' }}>
            <table className="cms-table">
              <thead>
                <tr>
                  <th>Submission Date</th>
                  <th>Parishioner Info</th>
                  <th>Inquiry Category</th>
                  <th>Request Details / Petitions</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((con) => (
                  <tr key={con.id}>
                    <td>{new Date(con.submittedAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ fontWeight: 'bold', color: '#ffffff' }}>{con.name}</div>
                      <span style={{ fontSize: '10px', color: '#a6989b', display: 'block', marginTop: '2px' }}>Email: {con.email}</span>
                    </td>
                    <td style={{ textTransform: 'uppercase', fontSize: '10px', fontWeight: 'bold', color: '#d4af2f', letterSpacing: '0.05em' }}>
                      {con.subject === 'vicar' && 'Priest Appointment'}
                      {con.subject === 'sacrament' && 'Sacrament Reservation'}
                      {con.subject === 'mass' && 'Mass Intention'}
                      {con.subject === 'general' && 'General Query'}
                    </td>
                    <td style={{ maxWidth: '350px', fontSize: '12px', lineHeight: '1.6', color: '#e5e5e5' }}>
                      "{con.message}"
                    </td>
                    <td>
                      <span className={`badge ${con.status === 'Resolved' ? 'badge-approved' : 'badge-unread'}`}>
                        {con.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => handleUpdateContactStatus(con.id, con.status)}
                          className="cms-btn cms-btn-outline" 
                          style={{ padding: '6px 12px', fontSize: '10px' }}
                        >
                          {con.status === 'Resolved' ? 'Mark Pending' : 'Mark Resolved'}
                        </button>
                        <button 
                          onClick={() => triggerDeleteConfirm(con.id, 'contact', con.name)} 
                          className="cms-btn cms-btn-primary" 
                          style={{ padding: '6px 12px', fontSize: '10px', background: '#7c1a2e', border: '1px solid #f87171', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Delete contact"
                        >
                          <Trash2 style={{ width: '12px', height: '12px' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 5. ADMIN USER MANAGEMENT TAB VIEW */}
        {activeTab === 'users' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Header / Add User Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: '#a6989b' }}>
                Manage parish administration team accounts, roles, and action permissions.
              </span>
              <button 
                onClick={() => { resetUserForm(); setShowUserModal(true); }}
                className="cms-btn cms-btn-primary" 
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                + Add Admin User
              </button>
            </div>

            {/* Users Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {users.map((user) => (
                <div key={user.id} className="glass-panel" style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px',
                  border: user.role === 'super_admin' ? '1px solid rgba(212,175,47,0.3)' : '1px solid rgba(255,255,255,0.05)',
                  boxShadow: user.role === 'super_admin' ? '0 8px 32px rgba(212,175,47,0.05)' : 'none'
                }}>
                  {/* Card Header */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <h4 style={{ fontSize: '16px', color: '#ffffff', fontWeight: 'bold' }}>{user.displayName}</h4>
                        <span style={{ fontSize: '12px', color: '#a6989b', display: 'block', marginTop: '2px' }}>@{user.username}</span>
                      </div>
                      <span className={`badge ${user.role === 'super_admin' ? 'badge-approved' : 'badge-pending'}`} style={{ textTransform: 'uppercase', fontSize: '9px' }}>
                        {user.role === 'super_admin' ? 'Super Admin' : 'Committee'}
                      </span>
                    </div>

                    {/* Meta Row */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: '#e5e5e5', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px', marginBottom: '12px' }}>
                      <div>
                        <span style={{ color: '#a6989b', marginRight: '6px' }}>Group:</span> 
                        <span style={{ fontWeight: '500' }}>{user.committee}</span>
                      </div>
                      <div>
                        <span style={{ color: '#a6989b', marginRight: '6px' }}>Joined:</span> 
                        <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Permissions list */}
                    <div>
                      <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#d4af2f', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                        Active Permissions ({user.permissions?.length || 0})
                      </span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {user.permissions && user.permissions.map((perm: string) => (
                          <span key={perm} style={{
                            fontSize: '9px',
                            background: 'rgba(255, 255, 255, 0.04)',
                            color: '#e5e5e5',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            border: '1px solid rgba(255, 255, 255, 0.08)'
                          }}>
                            {perm.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div style={{ display: 'flex', gap: '10px', marginTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
                    {user.id !== 'USR_SUPERADMIN' ? (
                      <button 
                        onClick={() => openEditUserModal(user)} 
                        className="cms-btn cms-btn-outline" 
                        style={{ flex: 1, padding: '8px', fontSize: '11px' }}
                      >
                        Edit User
                      </button>
                    ) : (
                      <span style={{ fontSize: '11px', color: '#a6989b', fontStyle: 'italic', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        System Account (Unmodifiable)
                      </span>
                    )}
                    {user.id !== 'USR_SUPERADMIN' && (
                      <button 
                        onClick={() => triggerDeleteConfirm(user.id, 'user', user.displayName)} 
                        className="cms-btn cms-btn-primary" 
                        style={{ 
                          padding: '8px 12px', 
                          fontSize: '11px', 
                          background: '#7c1a2e', 
                          border: '1px solid #f87171', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center' 
                        }}
                        title="Delete User permanently"
                      >
                        <Trash2 style={{ width: '14px', height: '14px' }} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* 5. GORGEOUS FAMILY MEMBERS DETAIL MODAL POPUP */}
      {selectedFamily && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '600px',
            width: '100%',
            padding: '32px',
            position: 'relative'
          }}>
            <button 
              onClick={() => setSelectedFamily(null)} 
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#a6989b'
              }}
            >
              <X style={{ width: '20px', height: '20px' }} />
            </button>

            <h2 style={{ fontSize: '20px', color: '#ffffff', letterSpacing: '0.05em', marginBottom: '8px' }}>
              {selectedFamily.familyName}
            </h2>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#d4af2f', display: 'block', marginBottom: '24px' }}>
              Ward: {selectedFamily.familyWard} • Phone: {selectedFamily.phone}
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <h4 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#a6989b', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                Family Roster Breakdown
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {selectedFamily.members && selectedFamily.members.map((member: any, idx: number) => (
                  <div key={idx} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.04)'
                  }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff' }}>
                      {member.name}
                    </span>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: '#a6989b' }}>
                      <span style={{ textTransform: 'capitalize', padding: '2px 8px', background: 'rgba(212, 175, 47, 0.1)', color: '#d4af2f', borderRadius: '4px', border: '1px solid rgba(212,175,47,0.15)' }}>
                        {member.relation}
                      </span>
                      <span>{member.age} Years Old</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedFamily.address && (
              <div style={{ marginBottom: '24px' }}>
                <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#a6989b', display: 'block', marginBottom: '6px' }}>
                  Residential Address
                </span>
                <p style={{ fontSize: '13px', color: '#e5e5e5', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin style={{ width: '14px', height: '14px', color: '#d4af2f', flexShrink: 0 }} />
                  {selectedFamily.address}
                </p>
              </div>
            )}

            <button onClick={() => setSelectedFamily(null)} className="cms-btn cms-btn-primary" style={{ width: '100%' }}>
              Dismiss Details
            </button>
          </div>
        </div>
      )}

      {/* 6. PREMIUM LOGOUT CONFIRMATION MODAL */}
      {showLogoutConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(10px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '400px',
            width: '100%',
            padding: '32px',
            textAlign: 'center',
            boxSizing: 'border-box',
            border: '1px solid rgba(124, 26, 46, 0.4)',
            boxShadow: '0 20px 50px rgba(124, 26, 46, 0.3)'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(124, 26, 46, 0.15)',
              border: '1px solid rgba(124, 26, 46, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto'
            }}>
              <LogOut style={{ width: '22px', height: '22px', color: '#f87171' }} />
            </div>

            <h3 style={{ fontSize: '18px', color: '#ffffff', letterSpacing: '0.05em', marginBottom: '10px' }}>
              Confirm Logout
            </h3>
            <p style={{ fontSize: '13px', color: '#a6989b', lineHeight: '1.6', marginBottom: '24px' }}>
              Are you sure you want to end your administrative session? You will need to re-enter the parish passkey to gain access.
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => setShowLogoutConfirm(false)} 
                className="cms-btn cms-btn-outline" 
                style={{ flex: 1, padding: '10px', fontSize: '11px' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleLogout} 
                className="cms-btn cms-btn-primary" 
                style={{ 
                  flex: 1, 
                  padding: '10px', 
                  fontSize: '11px',
                  background: '#7c1a2e',
                  border: '1px solid #7c1a2e',
                  color: '#ffffff'
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. PREMIUM ADMIN USER CREATION & EDITING MODAL */}
      {showUserModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          boxSizing: 'border-box'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '550px',
            width: '100%',
            padding: '32px',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxSizing: 'border-box'
          }}>
            <button 
              onClick={() => { setShowUserModal(false); resetUserForm(); }} 
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#a6989b'
              }}
            >
              <X style={{ width: '20px', height: '20px' }} />
            </button>

            <h2 style={{ fontSize: '20px', color: '#ffffff', letterSpacing: '0.05em', marginBottom: '8px' }}>
              {editingUser ? "Edit Administrative User" : "Create New Parish Administrator"}
            </h2>
            <p style={{ fontSize: '12px', color: '#a6989b', marginBottom: '24px' }}>
              Set credentials, administrative roles, and permission levels for committee leaders.
            </p>

            <form onSubmit={handleSaveUser}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left', marginBottom: '28px' }}>
                
                {/* Grid Inputs */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  
                  {/* Username Input */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#d4af2f', fontWeight: 'bold' }}>
                      Username
                    </label>
                    <input 
                      type="text" 
                      value={formUsername} 
                      onChange={(e) => setFormUsername(e.target.value)}
                      className="cms-input"
                      placeholder="e.g. secretary"
                      disabled={!!editingUser}
                      style={{ width: '100%', boxSizing: 'border-box' }}
                    />
                  </div>

                  {/* Password Input */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#d4af2f', fontWeight: 'bold' }}>
                      {editingUser ? "Change Password (Optional)" : "Password"}
                    </label>
                    <input 
                      type="password" 
                      value={formPassword} 
                      onChange={(e) => setFormPassword(e.target.value)}
                      className="cms-input"
                      placeholder={editingUser ? "Leave blank to keep current" : "Min 6 characters"}
                      style={{ width: '100%', boxSizing: 'border-box' }}
                    />
                  </div>

                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  
                  {/* Display Name Input */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#d4af2f', fontWeight: 'bold' }}>
                      Full Display Name
                    </label>
                    <input 
                      type="text" 
                      value={formDisplayName} 
                      onChange={(e) => setFormDisplayName(e.target.value)}
                      className="cms-input"
                      placeholder="Mr. Josh Mayilil"
                      style={{ width: '100%', boxSizing: 'border-box' }}
                    />
                  </div>

                  {/* Committee Group */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#d4af2f', fontWeight: 'bold' }}>
                      Committee Association
                    </label>
                    <select
                      value={formCommittee}
                      onChange={(e) => setFormCommittee(e.target.value)}
                      className="cms-input"
                      style={{ width: '100%', boxSizing: 'border-box', background: '#12070a', color: '#ffffff' }}
                    >
                      <option value="Parish Administration">Parish Administration (Vicarage)</option>
                      <option value="Parish Committee">Parish Committee</option>
                      <option value="Youth Association">Youth Association (KCYM)</option>
                      <option value="Mothers Association">Mothers Association (Mathrusangham)</option>
                      <option value="Catechism Ministry">Catechism Ministry</option>
                    </select>
                  </div>

                </div>

                {/* Role selection */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#d4af2f', fontWeight: 'bold' }}>
                    Administrative Role
                  </label>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                      <input 
                        type="radio" 
                        name="userRole" 
                        value="committee_member" 
                        checked={formRole === 'committee_member'} 
                        onChange={() => setFormRole('committee_member')}
                        style={{ accentColor: '#d4af2f' }}
                      />
                      Committee Member
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                      <input 
                        type="radio" 
                        name="userRole" 
                        value="super_admin" 
                        checked={formRole === 'super_admin'} 
                        onChange={() => setFormRole('super_admin')}
                        style={{ accentColor: '#d4af2f' }}
                      />
                      Super Administrator (Vicar level)
                    </label>
                  </div>
                </div>

                {/* Permissions checkboxes */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
                  <label style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#d4af2f', fontWeight: 'bold' }}>
                    Assign Section Permissions
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px' }}>
                    {[
                      { id: 'view_dashboard', label: 'View Dashboard Metrics' },
                      { id: 'view_families', label: 'View Family Registry' },
                      { id: 'manage_families', label: 'Approve/Modify Families' },
                      { id: 'view_offerings', label: 'View Holy Mass Offerings' },
                      { id: 'manage_offerings', label: 'Acknowledge Offerings' },
                      { id: 'view_contacts', label: 'View Prayer Requests' },
                      { id: 'manage_contacts', label: 'Resolve Prayer Petitions' },
                      { id: 'manage_users', label: 'Manage Admin Users' }
                    ].map(perm => {
                      const isChecked = formPermissions.includes(perm.id);
                      return (
                        <label key={perm.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer', color: '#e5e5e5' }}>
                          <input 
                            type="checkbox" 
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setFormPermissions(prev => prev.filter(p => p !== perm.id));
                              } else {
                                setFormPermissions(prev => [...prev, perm.id]);
                              }
                            }}
                            style={{ accentColor: '#d4af2f' }}
                          />
                          {perm.label}
                        </label>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Form Buttons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  type="button"
                  onClick={() => { setShowUserModal(false); resetUserForm(); }} 
                  className="cms-btn cms-btn-outline" 
                  style={{ flex: 1, padding: '10px', fontSize: '11px' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="cms-btn cms-btn-primary" 
                  style={{ flex: 1, padding: '10px', fontSize: '11px' }}
                >
                  {editingUser ? "Save Changes" : "Create User Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. PREMIUM DELETE CONFIRMATION MODAL */}
      {showDeleteConfirm && deleteTarget && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(10px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '420px',
            width: '100%',
            padding: '32px',
            textAlign: 'center',
            boxSizing: 'border-box',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            boxShadow: '0 20px 50px rgba(239, 68, 68, 0.15)'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto'
            }}>
              <Trash2 style={{ width: '22px', height: '22px', color: '#f87171' }} />
            </div>

            <h3 style={{ fontSize: '18px', color: '#ffffff', letterSpacing: '0.05em', marginBottom: '10px' }}>
              Confirm Permanent Delete
            </h3>
            <p style={{ fontSize: '13px', color: '#a6989b', lineHeight: '1.6', marginBottom: '24px' }}>
              Are you sure you want to permanently delete <strong>{deleteTarget.name}</strong>? This action is irreversible and will remove the record completely from the parish database.
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => { setShowDeleteConfirm(false); setDeleteTarget(null); }} 
                className="cms-btn cms-btn-outline" 
                style={{ flex: 1, padding: '10px', fontSize: '11px' }}
              >
                Cancel
              </button>
              <button 
                onClick={executeDelete} 
                className="cms-btn cms-btn-primary" 
                style={{ 
                  flex: 1, 
                  padding: '10px', 
                  fontSize: '11px',
                  background: '#7c1a2e',
                  border: '1px solid #7c1a2e',
                  color: '#ffffff'
                }}
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PREMIUM CUSTOM COLOR-MATCHED TOASTER NOTIFICATIONS */}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(20, 20, 20, 0.95)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(8px)',
            fontSize: '13px',
            fontFamily: 'inherit',
            borderRadius: '8px',
            padding: '12px 18px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          },
          success: {
            iconTheme: {
              primary: '#d4af2f',
              secondary: '#141414'
            }
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#141414'
            }
          }
        }}
      />

    </div>
  );

  // Helper counters
  function sumCauseAmount(causeId: string) {
    return offerings
      .filter(item => item.cause === causeId && item.status === 'Acknowledged')
      .reduce((sum, item) => sum + item.amount, 0);
  }

  function offeringCauseCount(causeId: string) {
    return offerings.filter(item => item.cause === causeId && item.status === 'Acknowledged').length;
  }

  function filteredFamilies() {
    if (!searchQuery) return families;
    return families.filter(item => 
      item.familyName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.headName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.familyWard.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
}
