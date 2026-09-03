const fs = require('fs');
let content = fs.readFileSync('src/context/PMSContext.tsx', 'utf8');

// 1. Add Firebase imports if not present
if (!content.includes('import { auth, db } from')) {
  content = content.replace(
    "import React, { createContext,",
    "import { auth, db } from '../lib/firebase';\nimport { signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';\nimport { doc, getDoc } from 'firebase/firestore';\nimport React, { createContext,"
  );
}

// 2. Replace getInitialRouteInfo
const initialRouteInfoRegex = /const getInitialRouteInfo = \(\) => \{[\s\S]*?^export const PMSProvider/m;
const newInitialRouteInfo = `const getInitialRouteInfo = () => {
  if (typeof window === 'undefined') {
    return { isAuth: false, user: MOCK_USERS.bole_owner, route: '/login', tab: 'dashboard' };
  }
  const cleanPath = window.location.pathname.toLowerCase().replace(/\\/$/, '') || '/';
  
  if (isPlatformRoute(cleanPath)) {
    return { isAuth: false, user: MOCK_USERS.superadmin, route: '/platform-login', tab: 'sa_dashboard' };
  }
  return { isAuth: false, user: MOCK_USERS.bole_owner, route: '/login', tab: 'dashboard' };
};

export const PMSProvider`;
content = content.replace(initialRouteInfoRegex, newInitialRouteInfo);

// 3. Replace the login function
const loginRegex = /const login = async \(usernameOrEmail: string, password: string\)[\s\S]*?return \{ success: true, role: matchedRole \};\n  \};\n/m;
const newLogin = `const login = async (usernameOrEmail: string, password: string): Promise<{ success: boolean; error?: string; role?: UserRole }> => {
    try {
      const userCred = await signInWithEmailAndPassword(auth, usernameOrEmail, password);
      const userDoc = await getDoc(doc(db, 'users', userCred.user.uid));
      
      if (!userDoc.exists()) {
         await firebaseSignOut(auth);
         return { success: false, error: 'User profile not found.' };
      }
      
      const userData = userDoc.data() as UserProfile;
      
      if (userData.role === 'super_admin' || userData.role === 'SUPER_ADMIN') {
         await firebaseSignOut(auth);
         return { success: false, error: 'Access Restricted: Super Administrators must log in via the dedicated Platform Access portal.' };
      }
      
      setCurrentUser(userData);
      setIsAuthenticated(true);
      setGuardError(null);
      
      const targetRoute = userData.role === 'owner' ? '/owner' : '/manager';
      const targetTab = userData.role === 'owner' ? 'dashboard' : 'tenants';
      
      setActiveRoleRoute(targetRoute);
      setActiveTab(targetTab);
      
      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', targetRoute);
      }
      
      showToast(\`Welcome, \${userData.name}! Authenticated successfully.\`, 'success');
      return { success: true, role: userData.role };
    } catch (err: any) {
      console.error(err);
      return { success: false, error: err.message || 'Authentication failed. Invalid credentials.' };
    }
  };
`;
content = content.replace(loginRegex, newLogin);

// 4. Replace the platformLogin function
const platformLoginRegex = /const platformLogin = async \(usernameOrEmail: string, password: string\)[\s\S]*?error: 'Access Denied: Invalid administrator credentials or insufficient clearance.'\n    \};\n  \};\n/m;
const newPlatformLogin = `const platformLogin = async (usernameOrEmail: string, password: string): Promise<{ success: boolean; error?: string; role?: UserRole }> => {
    try {
      const userCred = await signInWithEmailAndPassword(auth, usernameOrEmail, password);
      const token = await userCred.user.getIdTokenResult();
      
      if (token.claims.role !== 'SUPER_ADMIN') {
         await firebaseSignOut(auth);
         return { success: false, error: 'Access Denied: Insufficient administrative clearance.' };
      }
      
      const userDoc = await getDoc(doc(db, 'users', userCred.user.uid));
      const userData = userDoc.exists() ? (userDoc.data() as UserProfile) : MOCK_USERS.superadmin;
      
      setCurrentUser(userData);
      setIsAuthenticated(true);
      setGuardError(null);
      setActiveRoleRoute('/superadmin');
      setActiveTab('sa_dashboard');
      
      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', '/superadmin');
      }
      
      showToast(\`Root Access Granted: Welcome, \${userData.name}.\`, 'success');
      return { success: true, role: 'super_admin' };
    } catch (err: any) {
      console.error(err);
      return { success: false, error: 'Access Denied: Invalid administrator credentials or insufficient clearance.' };
    }
  };
`;
content = content.replace(platformLoginRegex, newPlatformLogin);

// 5. Replace logout function
const logoutRegex = /const logout = \(\) => \{[\s\S]*?\}\n    \}\n  \};\n/m;
const newLogout = `const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.error('Logout error', e);
    }
    
    try {
      localStorage.removeItem(\`\${STORAGE_KEY}_auth_state\`);
      localStorage.removeItem(\`\${STORAGE_KEY}_user_profile\`);
    } catch (e) {}
    
    setIsAuthenticated(false);
    setCurrentUser(MOCK_USERS.bole_owner);
    setActiveRoleRoute('/login');
    setActiveTab('dashboard');
    
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/login');
    }
    showToast('Signed out successfully.', 'info');
  };
`;
content = content.replace(logoutRegex, newLogout);

// 6. Inject Firebase Auth Listener in PMSProvider
const pmsProviderStartRegex = /const \[notification, setNotification\] = useState<\{ message: string; type: 'success' \| 'error' \| 'info' \} \| null>\(null\);/m;
const authListenerCode = `const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as UserProfile;
            setCurrentUser(userData);
            setIsAuthenticated(true);
          }
        } catch (err) {
          console.error("Error fetching user profile", err);
        }
      } else {
        setIsAuthenticated(false);
      }
    });
    return () => unsubscribe();
  }, []);`;
if (!content.includes('onAuthStateChanged(auth')) {
  content = content.replace(pmsProviderStartRegex, authListenerCode);
}

fs.writeFileSync('src/context/PMSContext.tsx', content);
console.log('PMSContext auth patch applied successfully!');
