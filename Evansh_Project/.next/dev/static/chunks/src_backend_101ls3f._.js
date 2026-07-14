(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/backend/services/appwrite.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BUCKET_ID",
    ()=>BUCKET_ID,
    "CONTACT_COLLECTION_ID",
    ()=>CONTACT_COLLECTION_ID,
    "COURSES_COLLECTION_ID",
    ()=>COURSES_COLLECTION_ID,
    "DB_ID",
    ()=>DB_ID,
    "PROJECTS_COLLECTION_ID",
    ()=>PROJECTS_COLLECTION_ID,
    "SERVICES_COLLECTION_ID",
    ()=>SERVICES_COLLECTION_ID,
    "account",
    ()=>account,
    "client",
    ()=>client,
    "databases",
    ()=>databases,
    "storage",
    ()=>storage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/appwrite/dist/esm/sdk.js [app-client] (ecmascript)");
;
const endpoint = ("TURBOPACK compile-time value", "https://fra.cloud.appwrite.io/v1");
const projectId = ("TURBOPACK compile-time value", "6a44a678000d978f77a7");
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
const client = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Client"]();
if ("TURBOPACK compile-time truthy", 1) client.setEndpoint(endpoint);
if ("TURBOPACK compile-time truthy", 1) client.setProject(projectId);
const account = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Account"](client);
const databases = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Databases"](client);
const storage = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Storage"](client);
;
const DB_ID = ("TURBOPACK compile-time value", "6a44aaf1001d01e59f41") || 'Evansh';
const PROJECTS_COLLECTION_ID = ("TURBOPACK compile-time value", "projects") || 'projects';
const CONTACT_COLLECTION_ID = ("TURBOPACK compile-time value", "contactmessages") || 'contact';
const COURSES_COLLECTION_ID = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_APPWRITE_COURSES_COLLECTION_ID || 'courses';
const SERVICES_COLLECTION_ID = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_APPWRITE_SERVICES_COLLECTION_ID || 'services';
const BUCKET_ID = ("TURBOPACK compile-time value", "6a464891003b01c8afa7") || 'project-images';
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/backend/contexts/AuthContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$backend$2f$services$2f$appwrite$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/backend/services/appwrite.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/appwrite/dist/esm/sdk.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const AuthProvider = ({ children })=>{
    _s();
    const [isLoggedIn, setIsLoggedIn] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // Check if user has an active session
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            const checkSession = {
                "AuthProvider.useEffect.checkSession": async ()=>{
                    try {
                        const currentUser = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$backend$2f$services$2f$appwrite$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["account"].get();
                        setUser(currentUser);
                        setIsLoggedIn(true);
                    } catch (error) {
                        setUser(null);
                        setIsLoggedIn(false);
                    } finally{
                        setIsLoading(false);
                    }
                }
            }["AuthProvider.useEffect.checkSession"];
            checkSession();
        }
    }["AuthProvider.useEffect"], []);
    const login = async (email, pass)=>{
        // If a session already exists, delete it first before creating a new one
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$backend$2f$services$2f$appwrite$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["account"].deleteSession('current');
        } catch  {
        // No active session — that's fine, continue
        }
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$backend$2f$services$2f$appwrite$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["account"].createEmailPasswordSession(email, pass);
        const currentUser = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$backend$2f$services$2f$appwrite$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["account"].get();
        setUser(currentUser);
        setIsLoggedIn(true);
    };
    const loginWithGoogle = ()=>{
        // Appwrite Google OAuth
        // The redirect URL should be your app's base URL
        const origin = ("TURBOPACK compile-time truthy", 1) ? window.location.origin : "TURBOPACK unreachable";
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$backend$2f$services$2f$appwrite$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["account"].createOAuth2Session(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OAuthProvider"].Google, `${origin}/`, `${origin}/login` // Failure redirect
        );
    };
    const logout = async ()=>{
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$backend$2f$services$2f$appwrite$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["account"].deleteSession('current');
        setUser(null);
        setIsLoggedIn(false);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            isLoggedIn,
            user,
            login,
            loginWithGoogle,
            logout,
            isLoading
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/backend/contexts/AuthContext.tsx",
        lineNumber: 71,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(AuthProvider, "bpgnJYK3jh2e0h7owtNWjkl0hQI=");
_c = AuthProvider;
const useAuth = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
_s1(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_backend_101ls3f._.js.map