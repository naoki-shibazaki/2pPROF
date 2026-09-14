(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PixelBackground$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/PixelBackground.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PixelWindow$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/PixelWindow.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PixelTabBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/PixelTabBar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$MyProfile$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/MyProfile.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$OthersTab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/OthersTab.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
function Home() {
    _s();
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('my');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative min-h-dvh",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PixelBackground$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 16,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "relative z-10 flex justify-center items-start min-h-dvh px-3 py-10",
                role: "main",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PixelWindow$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PixelTabBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            activeTab: activeTab,
                            onTabChange: setActiveTab
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 25,
                            columnNumber: 11
                        }, this),
                        activeTab === 'my' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$MyProfile$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 28,
                            columnNumber: 33
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$OthersTab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 28,
                            columnNumber: 49
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "pixel-statusbar",
                            children: "★ 2P PROF v1.0 ★ ともだちと紹介しあおう！"
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 31,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 23,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 19,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
_s(Home, "WYvHLiQvD8QBlimmTbO9uYgHqEA=");
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/AvatarSVG.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AvatarSVG
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
/**
 * AvatarSVG – 16×16 pixel art character sprite rendered as inline SVG.
 *
 * Color palette:
 *   1 = dark brown hair   (#3d1f00)
 *   2 = skin tone         (#f5c18a)
 *   3 = dark (eyes/brows) (#1a1a4e)
 *   4 = accent mouth      (#e05050)
 *   5 = shirt (blue)      (#4060cc)
 *   6 = pants (navy)      (#1a1a4e)
 *   7 = shoe              (#2a2a2a)
 */ const P = 3 // screen pixels per sprite pixel
;
const PALETTE = {
    1: '#3d1f00',
    2: '#f5c18a',
    3: '#1a1a4e',
    4: '#e05050',
    5: '#4060cc',
    6: '#1a2060',
    7: '#2a2a2a'
};
// 16 rows × 16 cols; 0 = transparent
const SPRITE = [
    [
        0,
        0,
        0,
        0,
        0,
        1,
        1,
        1,
        1,
        1,
        1,
        0,
        0,
        0,
        0,
        0
    ],
    [
        0,
        0,
        0,
        0,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        0,
        0,
        0,
        0
    ],
    [
        0,
        0,
        0,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        0,
        0,
        0
    ],
    [
        0,
        0,
        0,
        1,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        1,
        0,
        0,
        0
    ],
    [
        0,
        0,
        0,
        2,
        2,
        3,
        2,
        2,
        2,
        2,
        3,
        2,
        2,
        0,
        0,
        0
    ],
    [
        0,
        0,
        0,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        0,
        0,
        0
    ],
    [
        0,
        0,
        0,
        2,
        2,
        4,
        4,
        4,
        4,
        4,
        4,
        2,
        2,
        0,
        0,
        0
    ],
    [
        0,
        0,
        0,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        0,
        0,
        0
    ],
    [
        0,
        0,
        0,
        0,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        0,
        0,
        0,
        0
    ],
    [
        0,
        0,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        0,
        0
    ],
    [
        0,
        0,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        0,
        0
    ],
    [
        0,
        0,
        0,
        0,
        6,
        6,
        6,
        2,
        2,
        6,
        6,
        6,
        0,
        0,
        0,
        0
    ],
    [
        0,
        0,
        0,
        0,
        6,
        6,
        6,
        0,
        0,
        6,
        6,
        6,
        0,
        0,
        0,
        0
    ],
    [
        0,
        0,
        0,
        0,
        6,
        6,
        0,
        0,
        0,
        0,
        6,
        6,
        0,
        0,
        0,
        0
    ],
    [
        0,
        0,
        0,
        7,
        7,
        6,
        0,
        0,
        0,
        0,
        6,
        7,
        7,
        0,
        0,
        0
    ],
    [
        0,
        0,
        0,
        7,
        7,
        0,
        0,
        0,
        0,
        0,
        0,
        7,
        7,
        0,
        0,
        0
    ]
];
function AvatarSVG({ size = 64 }) {
    const dim = 16 * P // viewBox dimension
    ;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: size,
        height: size,
        viewBox: `0 0 ${dim} ${dim}`,
        xmlns: "http://www.w3.org/2000/svg",
        shapeRendering: "crispEdges",
        style: {
            imageRendering: 'pixelated'
        },
        "aria-hidden": "true",
        children: SPRITE.map((row, y)=>row.map((c, x)=>{
                if (c === 0) return null;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                    x: x * P,
                    y: y * P,
                    width: P,
                    height: P,
                    fill: PALETTE[c]
                }, `${x}-${y}`, false, {
                    fileName: "[project]/components/AvatarSVG.tsx",
                    lineNumber: 67,
                    columnNumber: 13
                }, this);
            }))
    }, void 0, false, {
        fileName: "[project]/components/AvatarSVG.tsx",
        lineNumber: 54,
        columnNumber: 5
    }, this);
}
_c = AvatarSVG;
var _c;
__turbopack_context__.k.register(_c, "AvatarSVG");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/AvatarUploader.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AvatarUploader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AvatarSVG$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/AvatarSVG.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const STORAGE_KEY = '2pprof_avatar';
const STYLE = {
    fontFamily: 'var(--font-pixel, monospace)'
};
function AvatarUploader() {
    _s();
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [avatarUrl, setAvatarUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AvatarUploader.useEffect": ()=>{
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) setAvatarUrl(saved);
        }
    }["AvatarUploader.useEffect"], []);
    async function handleFile(file) {
        setLoading(true);
        setError(null);
        const reader = new FileReader();
        reader.onload = async (e)=>{
            const base64 = e.target?.result;
            try {
                const res = await fetch('/api/generate-avatar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        imageBase64: base64
                    })
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error ?? 'Failed');
                setAvatarUrl(data.imageBase64);
                localStorage.setItem(STORAGE_KEY, data.imageBase64);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'エラーが発生しました');
            } finally{
                setLoading(false);
            }
        };
        reader.readAsDataURL(file);
    }
    function handleChange(e) {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
        e.target.value = '';
    }
    function handleReset() {
        localStorage.removeItem(STORAGE_KEY);
        setAvatarUrl(null);
        setError(null);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-center gap-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pixel-portrait",
                children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center",
                    style: {
                        width: 80,
                        height: 80,
                        background: 'rgba(20, 8, 40, 0.90)'
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            ...STYLE,
                            fontSize: 10,
                            color: '#40e8ff',
                            textShadow: '0 0 6px rgba(64,232,255,0.70)',
                            letterSpacing: '0.05em'
                        },
                        children: "生成中..."
                    }, void 0, false, {
                        fileName: "[project]/components/AvatarUploader.tsx",
                        lineNumber: 71,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/AvatarUploader.tsx",
                    lineNumber: 63,
                    columnNumber: 11
                }, this) : avatarUrl ? // eslint-disable-next-line @next/next/no-img-element
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    src: avatarUrl,
                    alt: "avatar",
                    width: 80,
                    height: 80,
                    style: {
                        imageRendering: 'pixelated',
                        display: 'block'
                    }
                }, void 0, false, {
                    fileName: "[project]/components/AvatarUploader.tsx",
                    lineNumber: 85,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AvatarSVG$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    size: 80
                }, void 0, false, {
                    fileName: "[project]/components/AvatarUploader.tsx",
                    lineNumber: 93,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/AvatarUploader.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                ref: inputRef,
                type: "file",
                accept: "image/*",
                className: "hidden",
                onChange: handleChange
            }, void 0, false, {
                fileName: "[project]/components/AvatarUploader.tsx",
                lineNumber: 97,
                columnNumber: 7
            }, this),
            !loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>inputRef.current?.click(),
                style: {
                    ...STYLE,
                    fontSize: 10,
                    color: '#ffd700',
                    background: 'rgba(8, 6, 20, 0.92)',
                    border: '2px solid #ffd700',
                    boxShadow: '0 0 8px rgba(255,215,0,0.35)',
                    textShadow: '0 0 6px rgba(255,215,0,0.55)',
                    padding: '3px 10px',
                    cursor: 'pointer',
                    letterSpacing: '0.08em'
                },
                children: avatarUrl ? '▶ 写真を再変換' : '▶ 写真をドット絵に変換'
            }, void 0, false, {
                fileName: "[project]/components/AvatarUploader.tsx",
                lineNumber: 106,
                columnNumber: 9
            }, this),
            avatarUrl && !loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleReset,
                style: {
                    ...STYLE,
                    fontSize: 9,
                    color: '#403860',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    letterSpacing: '0.05em'
                },
                children: "リセット"
            }, void 0, false, {
                fileName: "[project]/components/AvatarUploader.tsx",
                lineNumber: 126,
                columnNumber: 9
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                style: {
                    ...STYLE,
                    fontSize: 9,
                    color: '#ff4060',
                    textShadow: '0 0 5px rgba(255,64,96,0.60)',
                    textAlign: 'center',
                    maxWidth: 160
                },
                children: [
                    "⚠ ",
                    error
                ]
            }, void 0, true, {
                fileName: "[project]/components/AvatarUploader.tsx",
                lineNumber: 143,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/AvatarUploader.tsx",
        lineNumber: 59,
        columnNumber: 5
    }, this);
}
_s(AvatarUploader, "rPeYfvO3kNs9hrgQ7NOsK3RYdfU=");
_c = AvatarUploader;
var _c;
__turbopack_context__.k.register(_c, "AvatarUploader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/MyProfile.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MyProfile
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AvatarUploader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/AvatarUploader.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$QASection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/QASection.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$profileData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/data/profileData.ts [app-client] (ecmascript)");
;
;
;
;
const STYLE = {
    fontFamily: 'var(--font-pixel, monospace)'
};
/** Neon stat bar (HP / EXP) */ function StatBar({ label, color, fill, current, max }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    ...STYLE,
                    fontSize: 10,
                    color,
                    minWidth: 30,
                    textShadow: `0 0 5px ${color}`,
                    letterSpacing: '0.05em'
                },
                children: label
            }, void 0, false, {
                fileName: "[project]/components/MyProfile.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1,
                    height: 6,
                    background: 'rgba(255,255,255,0.06)',
                    border: `1px solid ${color}44`
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        width: `${fill * 100}%`,
                        height: '100%',
                        background: color,
                        boxShadow: `0 0 6px ${color}`
                    }
                }, void 0, false, {
                    fileName: "[project]/components/MyProfile.tsx",
                    lineNumber: 44,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/MyProfile.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    ...STYLE,
                    fontSize: 9,
                    color,
                    minWidth: 60,
                    textAlign: 'right',
                    opacity: 0.85
                },
                children: [
                    current,
                    " / ",
                    max
                ]
            }, void 0, true, {
                fileName: "[project]/components/MyProfile.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/MyProfile.tsx",
        lineNumber: 23,
        columnNumber: 5
    }, this);
}
_c = StatBar;
function MyProfile() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "overflow-y-auto",
        style: {
            background: 'transparent',
            maxHeight: 'calc(100dvh - 180px)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col items-center py-5 px-4 gap-3",
                style: {
                    borderBottom: '1px solid rgba(255,64,192,0.30)',
                    background: 'rgba(14, 6, 32, 0.60)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AvatarUploader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/components/MyProfile.tsx",
                        lineNumber: 84,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-xs px-3 py-1",
                        style: {
                            ...STYLE,
                            background: 'rgba(8, 6, 20, 0.92)',
                            color: '#ffd700',
                            border: '2px solid #ffd700',
                            boxShadow: '0 0 8px rgba(255,215,0,0.40)',
                            textShadow: '0 0 7px rgba(255,215,0,0.65)',
                            letterSpacing: '0.12em'
                        },
                        children: [
                            "★ Lv.",
                            __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$profileData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["profileData"].level,
                            " ",
                            __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$profileData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["profileData"].class
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/MyProfile.tsx",
                        lineNumber: 87,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-xl font-bold",
                        style: {
                            ...STYLE,
                            color: '#d0c8f0',
                            letterSpacing: '0.15em',
                            textShadow: '0 0 10px rgba(208,200,240,0.35)'
                        },
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$profileData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["profileData"].name
                    }, void 0, false, {
                        fileName: "[project]/components/MyProfile.tsx",
                        lineNumber: 103,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs -mt-2",
                        style: {
                            ...STYLE,
                            color: '#604878'
                        },
                        children: [
                            "@",
                            __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$profileData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["profileData"].handle
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/MyProfile.tsx",
                        lineNumber: 116,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full flex flex-col gap-1.5 mt-1",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatBar, {
                            label: "HP",
                            color: "#ff40c0",
                            fill: 1,
                            current: __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$profileData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["profileData"].level * 10,
                            max: __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$profileData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["profileData"].level * 10
                        }, void 0, false, {
                            fileName: "[project]/components/MyProfile.tsx",
                            lineNumber: 122,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/MyProfile.tsx",
                        lineNumber: 121,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-xs px-4 py-2 text-center w-full",
                        style: {
                            ...STYLE,
                            color: '#38ff78',
                            background: 'rgba(4, 2, 12, 0.75)',
                            border: '1px solid rgba(56,255,120,0.28)',
                            lineHeight: '1.9',
                            textShadow: '0 0 7px rgba(56,255,120,0.55)'
                        },
                        children: [
                            "▶ ",
                            __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$profileData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["profileData"].status
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/MyProfile.tsx",
                        lineNumber: 132,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/MyProfile.tsx",
                lineNumber: 76,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-4 py-3",
                style: {
                    borderBottom: '1px solid rgba(64,232,255,0.15)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-xs font-bold mb-2",
                        style: {
                            ...STYLE,
                            color: '#40e8ff',
                            letterSpacing: '0.08em',
                            textShadow: '0 0 6px rgba(64,232,255,0.60)'
                        },
                        children: "■ じこしょうかい"
                    }, void 0, false, {
                        fileName: "[project]/components/MyProfile.tsx",
                        lineNumber: 152,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs whitespace-pre-line",
                        style: {
                            ...STYLE,
                            color: '#b0a8d0',
                            lineHeight: '2.1'
                        },
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$profileData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["profileData"].bio
                    }, void 0, false, {
                        fileName: "[project]/components/MyProfile.tsx",
                        lineNumber: 163,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/MyProfile.tsx",
                lineNumber: 148,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-around px-4 py-3",
                style: {
                    background: 'rgba(4, 2, 12, 0.55)',
                    borderBottom: '1px solid rgba(255,64,192,0.18)'
                },
                children: __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$profileData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["profileData"].stats.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col items-center gap-0.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-base font-bold",
                                style: {
                                    ...STYLE,
                                    color: '#ffd700',
                                    textShadow: '0 0 8px rgba(255,215,0,0.55)'
                                },
                                children: s.value
                            }, void 0, false, {
                                fileName: "[project]/components/MyProfile.tsx",
                                lineNumber: 181,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs",
                                style: {
                                    ...STYLE,
                                    color: '#504470',
                                    fontSize: 10
                                },
                                children: s.label
                            }, void 0, false, {
                                fileName: "[project]/components/MyProfile.tsx",
                                lineNumber: 191,
                                columnNumber: 13
                            }, this)
                        ]
                    }, s.label, true, {
                        fileName: "[project]/components/MyProfile.tsx",
                        lineNumber: 180,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/MyProfile.tsx",
                lineNumber: 172,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$QASection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                items: __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$profileData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["profileData"].qa
            }, void 0, false, {
                fileName: "[project]/components/MyProfile.tsx",
                lineNumber: 202,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/MyProfile.tsx",
        lineNumber: 71,
        columnNumber: 5
    }, this);
}
_c1 = MyProfile;
var _c, _c1;
__turbopack_context__.k.register(_c, "StatBar");
__turbopack_context__.k.register(_c1, "MyProfile");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/OthersTab.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>OthersTab
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$profileData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/data/profileData.ts [app-client] (ecmascript)");
;
;
const STYLE = {
    fontFamily: 'var(--font-pixel, monospace)'
};
function OthersTab() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "overflow-y-auto",
        style: {
            background: 'transparent',
            maxHeight: 'calc(100dvh - 180px)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-3 py-2 text-center",
                style: {
                    ...STYLE,
                    background: 'rgba(4, 10, 22, 0.85)',
                    borderBottom: '1px solid rgba(64,232,255,0.30)',
                    color: '#40e8ff',
                    fontSize: 12,
                    letterSpacing: '0.06em',
                    textShadow: '0 0 7px rgba(64,232,255,0.60)'
                },
                children: "♡ ともだちからの紹介文 ♡"
            }, void 0, false, {
                fileName: "[project]/components/OthersTab.tsx",
                lineNumber: 12,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-3 flex flex-col gap-4",
                children: __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$profileData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["othersData"].map((person, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                        className: "pixel-friend-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pixel-friend-card-header",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-center w-9 h-9 shrink-0 text-base",
                                        style: {
                                            background: person.color,
                                            border: '2px solid rgba(255,255,255,0.25)',
                                            color: '#ffffff',
                                            fontFamily: 'monospace',
                                            boxShadow: `0 0 8px ${person.color}88`
                                        },
                                        children: person.emoji
                                    }, void 0, false, {
                                        fileName: "[project]/components/OthersTab.tsx",
                                        lineNumber: 33,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "min-w-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs font-bold truncate",
                                                style: {
                                                    ...STYLE,
                                                    color: '#d0c8f0'
                                                },
                                                children: person.name
                                            }, void 0, false, {
                                                fileName: "[project]/components/OthersTab.tsx",
                                                lineNumber: 47,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs truncate",
                                                style: {
                                                    ...STYLE,
                                                    color: '#504870',
                                                    fontSize: 10
                                                },
                                                children: [
                                                    "@",
                                                    person.handle
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/OthersTab.tsx",
                                                lineNumber: 53,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/OthersTab.tsx",
                                        lineNumber: 46,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "ml-auto text-xs shrink-0",
                                        style: {
                                            ...STYLE,
                                            color: '#ffd700',
                                            fontSize: 10,
                                            textShadow: '0 0 6px rgba(255,215,0,0.50)'
                                        },
                                        children: "★承認済み"
                                    }, void 0, false, {
                                        fileName: "[project]/components/OthersTab.tsx",
                                        lineNumber: 61,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/OthersTab.tsx",
                                lineNumber: 31,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "px-3 py-3",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs whitespace-pre-line",
                                    style: {
                                        ...STYLE,
                                        color: '#b0a8d0',
                                        lineHeight: '2.0'
                                    },
                                    children: person.intro
                                }, void 0, false, {
                                    fileName: "[project]/components/OthersTab.tsx",
                                    lineNumber: 76,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/OthersTab.tsx",
                                lineNumber: 75,
                                columnNumber: 13
                            }, this),
                            person.qa.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    borderTop: '1px solid rgba(64,232,255,0.18)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "px-3 py-1",
                                        style: {
                                            ...STYLE,
                                            background: 'rgba(4, 10, 22, 0.75)',
                                            fontSize: 11,
                                            color: '#40e8ff',
                                            borderBottom: '1px solid rgba(64,232,255,0.18)',
                                            textShadow: '0 0 6px rgba(64,232,255,0.55)'
                                        },
                                        children: [
                                            "■ ",
                                            person.name,
                                            "から見た私"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/OthersTab.tsx",
                                        lineNumber: 87,
                                        columnNumber: 17
                                    }, this),
                                    person.qa.map((item, qIdx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "px-3 py-2",
                                            style: {
                                                background: qIdx % 2 === 0 ? 'rgba(8, 6, 20, 0.65)' : 'rgba(12, 8, 28, 0.65)',
                                                borderTop: qIdx > 0 ? '1px solid rgba(64,232,255,0.08)' : undefined
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs",
                                                    style: {
                                                        ...STYLE,
                                                        color: '#40e8ff88',
                                                        lineHeight: '1.7'
                                                    },
                                                    children: [
                                                        "Q: ",
                                                        item.q
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/OthersTab.tsx",
                                                    lineNumber: 114,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs mt-1",
                                                    style: {
                                                        ...STYLE,
                                                        color: '#b0a8d0',
                                                        lineHeight: '1.9'
                                                    },
                                                    children: [
                                                        "> ",
                                                        item.a
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/OthersTab.tsx",
                                                    lineNumber: 120,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, qIdx, true, {
                                            fileName: "[project]/components/OthersTab.tsx",
                                            lineNumber: 102,
                                            columnNumber: 19
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/OthersTab.tsx",
                                lineNumber: 86,
                                columnNumber: 15
                            }, this)
                        ]
                    }, idx, true, {
                        fileName: "[project]/components/OthersTab.tsx",
                        lineNumber: 29,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/OthersTab.tsx",
                lineNumber: 27,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/OthersTab.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = OthersTab;
var _c;
__turbopack_context__.k.register(_c, "OthersTab");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/PixelBackground.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PixelBackground
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function PixelBackground() {
    return(// eslint-disable-next-line @next/next/no-img-element
    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
        src: "/bg.png",
        alt: "",
        "aria-hidden": "true",
        style: {
            position: 'fixed',
            inset: 0,
            width: '100%',
            height: '100%',
            zIndex: -10,
            objectFit: 'cover',
            imageRendering: 'pixelated'
        }
    }, void 0, false, {
        fileName: "[project]/components/PixelBackground.tsx",
        lineNumber: 4,
        columnNumber: 5
    }, this));
}
_c = PixelBackground;
function px(ctx, x, y, w, h, c, a = 1) {
    if (a !== 1) ctx.globalAlpha = a;
    ctx.fillStyle = c;
    ctx.fillRect(~~x, ~~y, Math.max(1, ~~w), Math.max(1, ~~h));
    if (a !== 1) ctx.globalAlpha = 1;
}
/** Deterministic pseudo-random number generator (LCG). */ function lcg(seed) {
    let s = seed | 0;
    return ()=>{
        s = Math.imul(1664525, s) + 1013904223;
        return (s >>> 0) / 4294967296;
    };
}
// ════════════════════════════════════════════════════════════════
//  SCENE
// ════════════════════════════════════════════════════════════════
function draw(ctx) {
    // Fill base (in case anything peeks through)
    px(ctx, 0, 0, CW, CH, '#080614');
    drawSky(ctx);
    drawStars(ctx);
    drawHorizonGlow(ctx);
    drawBgSkyline(ctx);
    drawMidBuildings(ctx);
    drawGround(ctx);
    drawFgBuildings(ctx);
    drawNeonSigns(ctx);
    drawLampPosts(ctx);
    drawPuddleReflections(ctx);
}
// ════════════════════════════════════════════════════════════════
//  1. NIGHT SKY  — 14 dark-purple gradient bands
// ════════════════════════════════════════════════════════════════
const SKY_BANDS = [
    [
        0,
        12,
        '#090515'
    ],
    [
        12,
        10,
        '#0b0719'
    ],
    [
        22,
        10,
        '#0d091e'
    ],
    [
        32,
        10,
        '#0f0b23'
    ],
    [
        42,
        10,
        '#110d28'
    ],
    [
        52,
        10,
        '#130f2d'
    ],
    [
        62,
        10,
        '#161132'
    ],
    [
        72,
        10,
        '#181337'
    ],
    [
        82,
        8,
        '#1b163c'
    ],
    [
        90,
        6,
        '#1e1841'
    ],
    [
        96,
        5,
        '#211b48'
    ],
    [
        101,
        5,
        '#251e50'
    ],
    [
        106,
        5,
        '#2a2158'
    ],
    [
        111,
        6,
        '#301e58'
    ]
];
function drawSky(ctx) {
    for (const [y, h, c] of SKY_BANDS)px(ctx, 0, y, CW, h, c);
}
// ════════════════════════════════════════════════════════════════
//  2. STARS
// ════════════════════════════════════════════════════════════════
function drawStars(ctx) {
    const rand = lcg(137);
    const COUNT = 95;
    for(let i = 0; i < COUNT; i++){
        const x = rand() * CW;
        const y = rand() * 108 // confined to upper sky
        ;
        const b = rand() // brightness 0–1
        ;
        if (b > 0.91) {
            // Cross-shaped bright star ✦
            px(ctx, x, y - 1, 1, 3, '#ffffff', .90);
            px(ctx, x - 1, y, 3, 1, '#ffffff', .90);
            px(ctx, x, y, 1, 1, '#ffffff'); // centre bright
        } else if (b > 0.76) {
            // Small 2×1 or 1×2 star
            px(ctx, x, y, rand() > .5 ? 2 : 1, rand() > .5 ? 1 : 2, '#e8e0ff', .78);
        } else if (b > 0.50) {
            px(ctx, x, y, 1, 1, '#c0b8e8', .55);
        } else {
            px(ctx, x, y, 1, 1, '#9088b8', .30 + b * .25);
        }
        // Occasional tinted stars
        if (i % 18 === 0) px(ctx, x + 2, y - 1, 1, 1, '#ffb0d0', .45);
        if (i % 25 === 0) px(ctx, x - 1, y + 1, 1, 1, '#b0d8ff', .45);
    }
}
// ════════════════════════════════════════════════════════════════
//  3. HORIZON GLOW  — synthwave pink stripes
// ════════════════════════════════════════════════════════════════
const GLOW_BANDS = [
    // [y, h, color, alpha]
    [
        98,
        2,
        '#3c1245',
        .55
    ],
    [
        100,
        2,
        '#541650',
        .62
    ],
    [
        102,
        2,
        '#6e1c5e',
        .68
    ],
    [
        104,
        2,
        '#8a2268',
        .73
    ],
    [
        106,
        2,
        '#a62e74',
        .79
    ],
    [
        108,
        2,
        '#c23880',
        .84
    ],
    [
        110,
        2,
        '#d8428a',
        .88
    ],
    [
        112,
        2,
        '#eb4e92',
        .92
    ],
    [
        114,
        3,
        '#f85898',
        .96
    ],
    [
        117,
        2,
        '#f24e8e',
        .92
    ],
    [
        119,
        2,
        '#e24082',
        .87
    ],
    [
        121,
        2,
        '#ce3274',
        .81
    ],
    [
        123,
        2,
        '#b82464',
        .73
    ],
    [
        125,
        2,
        '#9e1854',
        .63
    ],
    [
        127,
        2,
        '#820e42',
        .52
    ],
    [
        129,
        2,
        '#660830',
        .42
    ],
    [
        131,
        2,
        '#4c041e',
        .30
    ],
    [
        133,
        2,
        '#340210',
        .18
    ]
];
function drawHorizonGlow(ctx) {
    for (const [y, h, c, a] of GLOW_BANDS)px(ctx, 0, y, CW, h, c, a);
}
// ════════════════════════════════════════════════════════════════
//  4. BACKGROUND SKYLINE  — tall dark silhouettes, tiny windows
// ════════════════════════════════════════════════════════════════
// [x, topY, width, spireExtraH]   — bottom always at BG_BOT
const BG_BOT = 126;
const BG_BLDG = [
    [
        0,
        74,
        12,
        0
    ],
    [
        8,
        60,
        16,
        8
    ],
    [
        20,
        70,
        9,
        0
    ],
    [
        25,
        48,
        18,
        12
    ],
    [
        40,
        68,
        10,
        0
    ],
    [
        46,
        54,
        22,
        6
    ],
    [
        64,
        72,
        14,
        0
    ],
    [
        74,
        46,
        20,
        14
    ],
    [
        90,
        58,
        14,
        0
    ],
    [
        98,
        66,
        10,
        0
    ],
    [
        103,
        44,
        24,
        16
    ],
    [
        123,
        52,
        16,
        8
    ],
    [
        134,
        70,
        10,
        0
    ],
    [
        140,
        44,
        26,
        14
    ],
    [
        162,
        54,
        18,
        0
    ],
    [
        174,
        62,
        12,
        0
    ],
    [
        180,
        48,
        22,
        8
    ]
];
const BG_BODY = '#0c0a1e';
function drawBgSkyline(ctx) {
    const rand = lcg(71);
    for (const [bx, ty, bw, spH] of BG_BLDG){
        px(ctx, bx, ty, bw, BG_BOT - ty, BG_BODY);
        // Spire
        if (spH > 0) {
            const sw = Math.max(2, ~~(bw * .24));
            const sx = bx + ~~((bw - sw) / 2);
            px(ctx, sx, ty - spH, sw, spH + 1, BG_BODY);
            // Beacon light at tip
            px(ctx, sx + ~~(sw / 2), ty - spH - 1, 1, 1, '#ff2020', .85);
        }
        // Tiny windows (1×2 px)
        const cols = Math.max(2, ~~((bw - 4) / 3));
        for(let row = 0; row * 4 + ty + 4 < BG_BOT - 2; row++){
            for(let col = 0; col < cols; col++){
                if (rand() > .32) continue;
                const wx = bx + 2 + col * 3;
                const wy = ty + 4 + row * 4;
                const wc = rand() > .82 ? '#80b8ff' : rand() > .55 ? '#ffcc60' : '#ff9030';
                px(ctx, wx, wy, 1, 2, wc, .80);
            }
        }
    }
}
// ════════════════════════════════════════════════════════════════
//  5. MIDGROUND BUILDINGS
// ════════════════════════════════════════════════════════════════
// [x, topY, width, bottomY]
const MID_BLDG = [
    [
        0,
        130,
        24,
        218
    ],
    [
        18,
        122,
        18,
        218
    ],
    [
        32,
        116,
        30,
        218
    ],
    [
        58,
        128,
        22,
        218
    ],
    [
        76,
        118,
        26,
        218
    ],
    [
        98,
        124,
        20,
        218
    ],
    [
        112,
        110,
        38,
        218
    ],
    [
        144,
        120,
        24,
        218
    ],
    [
        164,
        116,
        28,
        218
    ],
    [
        186,
        124,
        18,
        218
    ]
];
const MID_BODY = [
    '#11102a',
    '#13102c',
    '#16102e',
    '#140e2c',
    '#120e28'
];
const MID_WIN = [
    '#ffaa28',
    '#ff9010',
    '#ffc840',
    '#4888ff',
    '#ff4848',
    '#ffdd60'
];
function drawMidBuildings(ctx) {
    const rand = lcg(89);
    for (const [bx, ty, bw, by] of MID_BLDG){
        const bc = MID_BODY[~~(rand() * MID_BODY.length)];
        px(ctx, bx, ty, bw, by - ty, bc);
        // Floor divider lines
        for(let fy = ty + 12; fy < by - 4; fy += 12){
            px(ctx, bx, fy, bw, 1, '#0a0818', .45);
        }
        // Windows 2×3
        for(let wy = ty + 5; wy < by - 4; wy += 6){
            for(let wx = bx + 3; wx < bx + bw - 3; wx += 5){
                if (rand() > .40) continue;
                const c = MID_WIN[~~(rand() * MID_WIN.length)];
                px(ctx, wx, wy, 2, 3, c, .88);
                px(ctx, wx - 1, wy - 1, 4, 5, c, .12); // glow
            }
        }
    }
}
// ════════════════════════════════════════════════════════════════
//  6. GROUND / STREET
// ════════════════════════════════════════════════════════════════
function drawGround(ctx) {
    px(ctx, 0, 312, CW, 28, '#090612'); // base asphalt
    px(ctx, 0, 315, CW, 2, '#14122a'); // pavement edge
    px(ctx, 0, 317, CW, 1, '#1c1840', .6); // kerb highlight
}
// ════════════════════════════════════════════════════════════════
//  7. FOREGROUND BUILDINGS
// ════════════════════════════════════════════════════════════════
// [x, topY, width, bottomY]
const FG_BLDG = [
    [
        0,
        196,
        40,
        340
    ],
    [
        36,
        208,
        18,
        340
    ],
    [
        50,
        192,
        34,
        340
    ],
    [
        80,
        200,
        22,
        340
    ],
    [
        98,
        184,
        36,
        340
    ],
    [
        130,
        196,
        24,
        340
    ],
    [
        150,
        190,
        54,
        340
    ]
];
const FG_BODY = [
    '#1a1630',
    '#1e1a38',
    '#201c3a',
    '#1c1832',
    '#221e3e',
    '#1a162e'
];
const FG_WIN = [
    '#ffa820',
    '#ff8810',
    '#ffbe30',
    '#60a0ff',
    '#ff5050',
    '#ffda50',
    '#44cc60'
];
function drawFgBuildings(ctx) {
    const rand = lcg(113);
    for (const [bx, ty, bw, by] of FG_BLDG){
        const bc = FG_BODY[~~(rand() * FG_BODY.length)];
        px(ctx, bx, ty, bw, by - ty, bc);
        // Rooftop parapet
        px(ctx, bx - 1, ty - 2, bw + 2, 3, '#2a2550');
        // Floor lines
        for(let fy = ty + 14; fy < by; fy += 14){
            px(ctx, bx, fy, bw, 1, '#100e22', .50);
        }
        // Windows 3×4
        for(let wy = ty + 7; wy < by - 4; wy += 7){
            for(let wx = bx + 4; wx < bx + bw - 4; wx += 7){
                if (rand() > .50) continue;
                const c = FG_WIN[~~(rand() * FG_WIN.length)];
                px(ctx, wx, wy, 3, 4, c, .92);
                px(ctx, wx - 1, wy - 1, 5, 6, c, .16); // glow
            }
        }
    }
}
// ════════════════════════════════════════════════════════════════
//  8. NEON SIGNS
// ════════════════════════════════════════════════════════════════
function drawNeonSigns(ctx) {
    // ── Large pink horizontal sign (like "CRALERA") ──
    neonBox(ctx, 6, 252, 86, 24, '#ff40c0', '#880050');
    neonLetters(ctx, 10, 257, 78, 14, '#ff40c0', '#ffa0e8', '#880050', 4);
    // ── Cyan sign (like "B:T00") ──
    neonBox(ctx, 102, 270, 60, 26, '#40e8ff', '#006880');
    neonLetters(ctx, 106, 275, 52, 16, '#40e8ff', '#a0f8ff', '#006880', 5);
    // ── Orange vertical pillar sign ──
    neonBox(ctx, 152, 226, 22, 68, '#ff8830', '#804010');
    for(let y = 232; y < 286; y += 12){
        px(ctx, 155, y, 16, 8, '#ff8830', .68);
        px(ctx, 156, y + 1, 14, 6, '#180c00');
        px(ctx, 157, y + 2, 10, 3, '#ff8830', .30);
    }
    // ── Green horizontal sign (like "1909LMG") ──
    neonBox(ctx, 2, 292, 82, 20, '#38ff78', '#006820');
    neonLetters(ctx, 6, 296, 74, 12, '#38ff78', '#a0ffc0', '#006820', 3);
    // ── Small red square sign (top-right zone) ──
    neonBox(ctx, 170, 236, 30, 30, '#ff2850', '#800018');
    px(ctx, 173, 239, 24, 24, '#120008');
    px(ctx, 174, 241, 10, 4, '#ff2850', .72);
    px(ctx, 175, 248, 8, 4, '#ff2850', .65);
    px(ctx, 176, 255, 6, 4, '#ff2850', .58);
    px(ctx, 173, 239, 24, 24, '#ff2850', .07); // interior glow
    // ── Small cyan tag (mid-right) ──
    neonBox(ctx, 162, 210, 36, 18, '#40e8ff', '#006880');
    px(ctx, 164, 212, 32, 14, '#030c14');
    px(ctx, 165, 214, 12, 4, '#40e8ff', .60);
    px(ctx, 179, 214, 8, 4, '#40e8ff', .60);
    px(ctx, 165, 220, 30, 2, '#40e8ff', .40);
}
/** Glowing neon rectangle border */ function neonBox(ctx, x, y, w, h, mainC, glowC) {
    // Outer glow layers
    px(ctx, x - 4, y - 4, w + 8, h + 8, glowC, .08);
    px(ctx, x - 3, y - 3, w + 6, h + 6, glowC, .14);
    px(ctx, x - 2, y - 2, w + 4, h + 4, glowC, .24);
    px(ctx, x - 1, y - 1, w + 2, h + 2, glowC, .40);
    // Frame
    px(ctx, x, y, w, 2, mainC);
    px(ctx, x, y + h - 2, w, 2, mainC);
    px(ctx, x, y, 2, h, mainC);
    px(ctx, x + w - 2, y, 2, h, mainC);
    // Dark interior + ambient glow
    px(ctx, x + 2, y + 2, w - 4, h - 4, '#040210');
    px(ctx, x + 2, y + 2, w - 4, h - 4, glowC, .08);
    // Inner bright edge
    px(ctx, x + 1, y + 1, w - 2, 1, mainC, .50);
    px(ctx, x + 1, y + 1, 1, h - 2, mainC, .40);
}
/** Pseudo-letter columns that read as neon text */ function neonLetters(ctx, x, y, w, h, mainC, brightC, glowC, seed) {
    const rand = lcg(x * 7 + y * 3 + seed | 0);
    const CW_L = 7 // letter cell width
    ;
    const GAP = 2 // gap between letters
    ;
    let cx = x;
    while(cx + CW_L <= x + w){
        // Glow under entire letter
        px(ctx, cx - 1, y - 1, CW_L + 2, h + 2, glowC, .25);
        // Top bar (always)
        px(ctx, cx, y, CW_L, 2, brightC, .95);
        // Bottom bar (always)
        px(ctx, cx, y + h - 2, CW_L, 2, mainC, .85);
        // Left vertical (always)
        px(ctx, cx, y, 2, h, mainC, .85);
        // Middle bar (random → different letter shapes)
        if (rand() > .40) px(ctx, cx, y + ~~(h / 2), CW_L, 1, mainC, .80);
        // Right vertical (random)
        if (rand() > .35) px(ctx, cx + CW_L - 2, y, 2, h, mainC, .75);
        // Colon dot (rare, for "B:T00" style)
        if (rand() > .85) {
            px(ctx, cx + CW_L + 1, y + 2, 2, 2, brightC);
            px(ctx, cx + CW_L + 1, y + h - 5, 2, 2, brightC);
        }
        cx += CW_L + GAP;
    }
}
// ════════════════════════════════════════════════════════════════
//  9. LAMP POSTS
// ════════════════════════════════════════════════════════════════
function drawLampPosts(ctx) {
    for (const lx of [
        28,
        84,
        148
    ]){
        lampPost(ctx, lx, 290);
    }
}
function lampPost(ctx, x, y) {
    px(ctx, x, y, 2, 48, '#28243e'); // shaft
    px(ctx, x - 4, y + 2, 10, 2, '#28243e'); // arm
    px(ctx, x - 5, y - 1, 6, 4, '#d8a840'); // lamp housing
    // Lamp glow
    px(ctx, x - 7, y - 4, 10, 10, '#d8a840', .18);
    px(ctx, x - 4, y - 2, 4, 6, '#ffe898', .40);
}
// ════════════════════════════════════════════════════════════════
//  10. PUDDLE / WET-STREET REFLECTIONS
// ════════════════════════════════════════════════════════════════
function drawPuddleReflections(ctx) {
    // Faint neon streaks on the dark asphalt
    px(ctx, 6, 320, 82, 3, '#ff40c0', .12);
    px(ctx, 98, 322, 58, 4, '#40e8ff', .10);
    px(ctx, 2, 326, 78, 3, '#38ff78', .08);
    px(ctx, 148, 318, 28, 4, '#ff8830', .09);
    // Lamp reflections
    for (const lx of [
        28,
        84,
        148
    ]){
        px(ctx, lx - 3, 324, 8, 6, '#ffe898', .12);
    }
}
var _c;
__turbopack_context__.k.register(_c, "PixelBackground");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/PixelTabBar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PixelTabBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
'use client';
;
const TABS = [
    {
        id: 'my',
        label: '自分',
        icon: '▶'
    },
    {
        id: 'others',
        label: '他人',
        icon: '♡'
    }
];
function PixelTabBar({ activeTab, onTabChange }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "pixel-tabbar",
        children: TABS.map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>onTabChange(tab.id),
                className: `pixel-tab ${activeTab === tab.id ? 'pixel-tab--active' : 'pixel-tab--inactive'}`,
                "aria-selected": activeTab === tab.id,
                role: "tab",
                children: [
                    tab.icon,
                    " ",
                    tab.label
                ]
            }, tab.id, true, {
                fileName: "[project]/components/PixelTabBar.tsx",
                lineNumber: 24,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/components/PixelTabBar.tsx",
        lineNumber: 22,
        columnNumber: 5
    }, this);
}
_c = PixelTabBar;
var _c;
__turbopack_context__.k.register(_c, "PixelTabBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/PixelWindow.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PixelWindow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function PixelWindow({ children, title = '2P PROF' }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full",
        style: {
            maxWidth: 360
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pixel-titlebar",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pixel-btn-chrome"
                            }, void 0, false, {
                                fileName: "[project]/components/PixelWindow.tsx",
                                lineNumber: 28,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pixel-btn-chrome"
                            }, void 0, false, {
                                fileName: "[project]/components/PixelWindow.tsx",
                                lineNumber: 29,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pixel-btn-chrome"
                            }, void 0, false, {
                                fileName: "[project]/components/PixelWindow.tsx",
                                lineNumber: 30,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/PixelWindow.tsx",
                        lineNumber: 27,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex-1 text-center text-pixel-shadow tracking-widest",
                        children: [
                            "★ ",
                            title,
                            " ★"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/PixelWindow.tsx",
                        lineNumber: 32,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/PixelWindow.tsx",
                lineNumber: 26,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pixel-window overflow-hidden relative scanlines",
                children: children
            }, void 0, false, {
                fileName: "[project]/components/PixelWindow.tsx",
                lineNumber: 38,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/PixelWindow.tsx",
        lineNumber: 24,
        columnNumber: 5
    }, this);
}
_c = PixelWindow;
var _c;
__turbopack_context__.k.register(_c, "PixelWindow");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/QASection.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>QASection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
const STYLE = {
    fontFamily: 'var(--font-pixel, monospace)'
};
function QASection({ items }) {
    _s();
    const [expanded, setExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    function toggle(idx) {
        setExpanded((prev)=>prev === idx ? null : idx);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "pixel-section-header",
                children: "■ 100の質問 Q&A"
            }, void 0, false, {
                fileName: "[project]/components/QASection.tsx",
                lineNumber: 25,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: items.map((item, idx)=>{
                    const isOpen = expanded === idx;
                    const rowBg = idx % 2 === 0 ? 'rgba(8, 6, 20, 0.70)' : 'rgba(12, 8, 28, 0.70)';
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            borderBottom: '1px solid rgba(64,232,255,0.10)',
                            borderLeft: isOpen ? '3px solid #38ff78' : '3px solid transparent'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>toggle(idx),
                                className: "w-full flex items-center gap-2 px-3 py-2 text-left cursor-pointer",
                                style: {
                                    ...STYLE,
                                    background: isOpen ? 'rgba(16, 6, 32, 0.90)' : rowBg
                                },
                                "aria-expanded": isOpen,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: 10,
                                            color: '#40e8ff',
                                            minWidth: 22,
                                            textShadow: '0 0 5px rgba(64,232,255,0.60)',
                                            letterSpacing: '0.04em',
                                            flexShrink: 0
                                        },
                                        children: String(idx + 1).padStart(2, '0')
                                    }, void 0, false, {
                                        fileName: "[project]/components/QASection.tsx",
                                        lineNumber: 53,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex-1 text-xs truncate",
                                        style: {
                                            color: isOpen ? '#d0c8f0' : '#9888b8',
                                            lineHeight: '1.8'
                                        },
                                        children: item.q
                                    }, void 0, false, {
                                        fileName: "[project]/components/QASection.tsx",
                                        lineNumber: 67,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: 10,
                                            color: isOpen ? '#38ff78' : '#ff40c0',
                                            textShadow: isOpen ? '0 0 6px rgba(56,255,120,0.70)' : '0 0 6px rgba(255,64,192,0.55)',
                                            flexShrink: 0
                                        },
                                        children: isOpen ? '▼' : '▶'
                                    }, void 0, false, {
                                        fileName: "[project]/components/QASection.tsx",
                                        lineNumber: 78,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/QASection.tsx",
                                lineNumber: 43,
                                columnNumber: 15
                            }, this),
                            isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "px-3 py-2",
                                style: {
                                    background: 'rgba(6, 18, 8, 0.85)',
                                    borderTop: '1px solid rgba(56,255,120,0.20)',
                                    ...STYLE
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs whitespace-pre-wrap",
                                    style: {
                                        color: '#38ff78',
                                        lineHeight: '1.9',
                                        textShadow: '0 0 4px rgba(56,255,120,0.40)',
                                        paddingLeft: 26
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: '#38ff7888'
                                            },
                                            children: [
                                                '>',
                                                " "
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/QASection.tsx",
                                            lineNumber: 111,
                                            columnNumber: 21
                                        }, this),
                                        item.a
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/QASection.tsx",
                                    lineNumber: 102,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/QASection.tsx",
                                lineNumber: 94,
                                columnNumber: 17
                            }, this)
                        ]
                    }, idx, true, {
                        fileName: "[project]/components/QASection.tsx",
                        lineNumber: 35,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/components/QASection.tsx",
                lineNumber: 27,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/QASection.tsx",
        lineNumber: 24,
        columnNumber: 5
    }, this);
}
_s(QASection, "rj6rT40wn8/TX8zzMJT30m5e380=");
_c = QASection;
var _c;
__turbopack_context__.k.register(_c, "QASection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/data/profileData.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ── Self profile ────────────────────────────────────────────────
__turbopack_context__.s([
    "othersData",
    ()=>othersData,
    "profileData",
    ()=>profileData
]);
const profileData = {
    name: 'ひろ',
    handle: 'hiro_pixel',
    level: 24,
    class: '冒険者',
    status: '今日もゲームしながらのんびり中…',
    bio: 'ゲームと漫画が大好きな普通の人間です。\nRPGはジャンル問わず好きで、休みの日はひたすら遊んでます。\n映画も週1本は観るようにしてるので、おすすめがあればぜひ教えてください！\nよろしくお願いします。',
    stats: [
        {
            label: 'フォロワー',
            value: '128'
        },
        {
            label: '紹介文',
            value: '3'
        },
        {
            label: 'Q&A',
            value: '20'
        }
    ],
    qa: [
        {
            q: '出身地はどこ？',
            a: '東京生まれ、神奈川育ち。今も神奈川在住です。'
        },
        {
            q: '好きな食べ物は？',
            a: 'ラーメン（醤油派）と唐揚げ。この2つはほぼ外れなし。'
        },
        {
            q: '苦手な食べ物は？',
            a: 'セロリとパクチー。香りがどうしても受け付けなくて。'
        },
        {
            q: '趣味は？',
            a: 'RPGゲーム、漫画、映画鑑賞、近所の散歩。'
        },
        {
            q: '好きなゲームジャンルは？',
            a: 'RPG一択。ストーリーが長いやつが特に好き。'
        },
        {
            q: '最近ハマっているものは？',
            a: '料理。週末に作るカレーが最近の自信作です。'
        },
        {
            q: '朝型？夜型？',
            a: '完全な夜型。朝は本当に苦手です。'
        },
        {
            q: '犬派？猫派？',
            a: '猫派。気まぐれなところに共感します。'
        },
        {
            q: '好きな季節は？',
            a: '秋。気温がちょうどよくて外に出るのが楽しい。'
        },
        {
            q: '特技は？',
            a: '方向感覚がある方で、知らない街でも地図なしで歩ける。あと早食い。'
        },
        {
            q: '苦手なことは？',
            a: '早起きと電話。LINEで連絡をもらえると助かります。'
        },
        {
            q: '将来の夢は？',
            a: '好きなことで生きていくこと。まだ模索中ですが。'
        },
        {
            q: '座右の銘は？',
            a: '「なるようになる」。深く考えすぎないようにしてます。'
        },
        {
            q: '好きな映画ジャンルは？',
            a: 'SF。世界観が広がる感じが好きです。'
        },
        {
            q: '最後に食べたいものは？',
            a: '迷わず醤油ラーメン。チャーシューたっぷりで。'
        },
        {
            q: '行ってみたい国は？',
            a: 'アイスランド。いつかオーロラを見てみたい。'
        },
        {
            q: '自分を動物に例えると？',
            a: '猫。自由に生きてると思うので。'
        },
        {
            q: '一番大切にしていることは？',
            a: '人との縁。出会いを大事にするよう心がけてます。'
        },
        {
            q: 'ストレス発散方法は？',
            a: 'ゲームか散歩。没頭できることが一番。'
        },
        {
            q: '読者へひとこと！',
            a: 'ここまで読んでくれてありがとうございます！よかったら一緒に遊びましょう。'
        }
    ]
};
const othersData = [
    {
        name: 'たかし',
        handle: 'takashi_gamer',
        emoji: '★',
        color: '#4060cc',
        intro: '高校からの友達です。ゲームの話になると止まらないタイプで、RPGのことをめちゃくちゃ詳しく知ってます。\n最初は人見知りに見えるかもしれないけど、慣れるとすごく面白い人なので、ぜひ話しかけてみてください。',
        qa: [
            {
                q: '第一印象は？',
                a: 'ゲームめちゃ詳しそうな人だなって思った（笑）'
            },
            {
                q: 'この人の一番の魅力は？',
                a: '一度仲良くなると本当に信頼できる。長く付き合いたい友達。'
            }
        ]
    },
    {
        name: 'さくら',
        handle: 'sakura_eats',
        emoji: '♡',
        color: '#cc4060',
        intro: '一緒に働いていた仲間です！食べることが大好きで、ランチの誘いは絶対OKしてくれる。\n自作のカレーを一度食べさせてもらったんですが、本当においしかった！笑顔が素敵な人です。',
        qa: [
            {
                q: '一緒にいるとどんな感じ？',
                a: 'ゆるくて楽。話が自然と盛り上がる。'
            },
            {
                q: 'ここだけ直してほしい！',
                a: '朝が本当に弱い（笑）待つのに慣れました。'
            }
        ]
    },
    {
        name: 'けんじ',
        handle: 'kenji_walks',
        emoji: '▶',
        color: '#286428',
        intro: '週末の散歩仲間です。道に異常に詳しくて、地図なしでもすいすい歩いていく。\nその特技には毎回助けてもらってます。方向音痴な私には神様みたいな存在（笑）',
        qa: [
            {
                q: 'この人を一言で表すと？',
                a: '「のんびり屋」。焦らないところが好き。'
            },
            {
                q: 'オススメする理由は？',
                a: '話を真剣に聞いてくれる。一緒にいると落ち着く。'
            }
        ]
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
]);

//# sourceMappingURL=_0kqzpm5._.js.map