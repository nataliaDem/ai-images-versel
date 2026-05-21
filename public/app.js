const elements = {
    singleModeButton: document.getElementById("singleModeButton"),
    bulkModeButton: document.getElementById("bulkModeButton"),
    singleControls: document.getElementById("singleControls"),
    bulkControls: document.getElementById("bulkControls"),
    controlsLoadingOverlay: document.getElementById("controlsLoadingOverlay"),
    singleDropzoneWrap: document.getElementById("singleDropzoneWrap"),
    dropzone: document.getElementById("dropzone"),
    fileInput: document.getElementById("fileInput"),
    imageUrlInput: document.getElementById("imageUrlInput"),
    singleResetButton: document.getElementById("singleResetButton"),
    singleSourceSection: document.getElementById("singleSourceSection"),
    bakerySection: document.getElementById("bakerySection"),
    bakeryCombobox: document.getElementById("bakeryCombobox"),
    bakerySearchInput: document.getElementById("bakerySearchInput"),
    bakeryComboboxButton: document.getElementById("bakeryComboboxButton"),
    bakeryDropdown: document.getElementById("bakeryDropdown"),
    bakerySelect: document.getElementById("bakerySelect"),
    bulkSelectionLoader: document.getElementById("bulkSelectionLoader"),
    categorySection: document.getElementById("categorySection"),
    categorySelect: document.getElementById("categorySelect"),
    bulkSourceSection: document.getElementById("bulkSourceSection"),
    selectAllProducts: document.getElementById("selectAllProducts"),
    selectAllProductsLabel: document.getElementById("selectAllProductsLabel"),
    bulkSourcesGrid: document.getElementById("bulkSourcesGrid"),
    sceneSection: document.getElementById("sceneSection"),
    scenePresetGrid: document.getElementById("scenePresetGrid"),
    sceneCustomizePanel: document.getElementById("sceneCustomizePanel"),
    toggleSceneCustomizeButton: document.getElementById("toggleSceneCustomizeButton"),
    selectedSceneName: document.getElementById("selectedSceneName"),
    wallField: document.getElementById("wallField"),
    wallSelect: document.getElementById("wallSelect"),
    tableField: document.getElementById("tableField"),
    tableSelect: document.getElementById("tableSelect"),
    standField: document.getElementById("standField"),
    standSelect: document.getElementById("standSelect"),
    promptSection: document.getElementById("promptSection"),
    togglePromptButton: document.getElementById("togglePromptButton"),
    promptEditorWrap: document.getElementById("promptEditorWrap"),
    promptEditor: document.getElementById("promptEditor"),
    preserveSection: document.getElementById("preserveSection"),
    preserveOrientation: document.getElementById("preserveOrientation"),
    actionsSection: document.getElementById("actionsSection"),
    generateButton: document.getElementById("generateButton"),
    costEstimate: document.getElementById("costEstimate"),
    saveButton: document.getElementById("saveButton"),
    singleDownloadSection: document.getElementById("singleDownloadSection"),
    sourcePreview: document.getElementById("sourcePreview"),
    sourcePlaceholder: document.getElementById("sourcePlaceholder"),
    resultPreview: document.getElementById("resultPreview"),
    resultPlaceholder: document.getElementById("resultPlaceholder"),
    resultLoader: document.getElementById("resultLoader"),
    singlePreviewSection: document.getElementById("singlePreviewSection"),
    bulkPreviewSection: document.getElementById("bulkPreviewSection"),
    bulkResultsGrid: document.getElementById("bulkResultsGrid"),
    bulkResultLoader: document.getElementById("bulkResultLoader"),
    bulkDownloadAllButton: document.getElementById("bulkDownloadAllButton"),
    bulkDownloadSection: document.getElementById("bulkDownloadSection"),
    bulkErrors: document.getElementById("bulkErrors"),
    status: document.getElementById("status"),
    lightbox: document.getElementById("lightbox"),
    lightboxDialog: document.getElementById("lightboxDialog"),
    lightboxSourcePane: document.getElementById("lightboxSourcePane"),
    lightboxResultPane: document.getElementById("lightboxResultPane"),
    lightboxSourceImage: document.getElementById("lightboxSourceImage"),
    lightboxImage: document.getElementById("lightboxImage"),
    lightboxClose: document.getElementById("lightboxClose"),
};

const PROMPT_OPTIONS = {
    walls: [
        {
            value: "beige",
            label: "Beige",
            prompt: "wall: warm light beige, smooth and clean, with no texture or patterns",
        },
        {
            value: "gray",
            label: "Gray",
            prompt: "wall: very light neutral gray, smooth and clean, with no texture or patterns",
        },
        {
            value: "white",
            label: "White",
            prompt: "wall: soft white, smooth and clean, with no texture or patterns",
        },
        {
            value: "cream",
            label: "Cream",
            prompt: "wall: soft cream, smooth and clean, with no texture or patterns",
        },
        {
            value: "mint",
            label: "Pale mint",
            prompt: "wall: very pale mint green, smooth and clean, with no texture or patterns",
        },
        {
            value: "warm-white-stone",
            label: "Warm white stone",
            prompt: "wall: warm white natural stone, clean and refined, with very subtle stone texture",
        },
        {
            value: "cool-gray-stone",
            label: "Cool gray stone",
            prompt: "wall: cool light gray stone wall, elegant and minimal, with soft natural stone texture",
        },
        {
            value: "sand-plaster",
            label: "Sand plaster",
            prompt: "wall: soft sand-colored plaster wall, clean and minimal, with gentle plaster texture",
        },
        {
            value: "chalk-white",
            label: "Chalk white",
            prompt: "wall: chalky white wall, matte and soft, with a subtle natural finish",
        },
        {
            value: "light-oak-panels",
            label: "Light oak panels",
            prompt: "wall: light oak wooden wall panels, clean, modern, and evenly finished",
        },
        {
            value: "keep",
            label: "Keep as is",
            prompt: "keep the existing wall exactly as it is",
        },
    ],
    tables: [
        {
            value: "white-planks",
            label: "White wooden planks",
            prompt: "table: white painted wooden planks, clean and bright, with subtle seams between boards",
        },
        {
            value: "light-wood",
            label: "Light wood",
            prompt: "table: light natural wood, smooth, clean, and softly matte",
        },
        {
            value: "white-smooth",
            label: "White without texture",
            prompt: "table: clean white surface with no visible texture",
        },
        {
            value: "stone-beige",
            label: "Light beige stone",
            prompt: "table: very light beige stone surface, soft matte look, clean and minimal",
        },
        {
            value: "gray-smooth",
            label: "Soft light gray",
            prompt: "table: smooth light gray surface with a clean minimal finish",
        },
        {
            value: "white-marble",
            label: "White marble",
            prompt: "table: white marble surface with subtle natural veining, clean and refined",
        },
        {
            value: "beige-stone",
            label: "Beige stone",
            prompt: "table: soft beige stone surface, minimal, matte, and elegant",
        },
        {
            value: "gray-stone",
            label: "Cool gray stone",
            prompt: "table: cool light gray stone surface, clean, modern, and softly matte",
        },
        {
            value: "oak-wood",
            label: "Natural oak wood",
            prompt: "table: natural oak wood surface, smooth, clean, and softly finished",
        },
        {
            value: "walnut-wood",
            label: "Light walnut wood",
            prompt: "table: light walnut wooden surface, warm, clean, and polished with a natural grain",
        },
        {
            value: "cream-matte",
            label: "Cream matte",
            prompt: "table: smooth cream matte surface with no strong texture, clean and minimal",
        },
        {
            value: "white-stone",
            label: "Soft white stone",
            prompt: "table: soft white stone surface, clean and modern, with a subtle natural texture",
        },
        {
            value: "keep",
            label: "Keep as is",
            prompt: "keep the existing table or surface exactly as it is",
        },
    ],
    stands: [
        {
            value: "keep",
            label: "Keep as is",
            prompt: "keep the existing stand or plate exactly as it is",
        },
        {
            value: "silver-board",
            label: "Silver cardboard base",
            prompt: "place the product on a silver cardboard cake base",
        },
        {
            value: "gold-board",
            label: "Gold cardboard base",
            prompt: "place the product on a gold cardboard cake base",
        },
        {
            value: "white-plate",
            label: "Large white plate",
            prompt: "place the product on a large white plate",
        },
        {
            value: "white-pedestal",
            label: "White pedestal stand",
            prompt: "place the product on a white pedestal stand",
        },
        {
            value: "wooden-pedestal",
            label: "Wooden pedestal stand",
            prompt: "place the product on a wooden pedestal stand",
        },
        {
            value: "round-wooden-tray",
            label: "Round wooden tray",
            prompt: "place the product on a round wooden serving tray with a clean natural finish",
        },
    ],
};

const SCENE_PRESETS = [
    {
        id: "soft-beige-studio",
        name: "Soft Beige Studio",
        wall: "beige",
        table: "white-planks",
        stand: "white-pedestal",
        image: "/scene-presets/soft-beige-studio.jpg",
    },
    {
        id: "clean-white-marble",
        name: "Clean White Marble",
        wall: "chalk-white",
        table: "white-marble",
        stand: "white-plate",
        image: "/scene-presets/clean-white-marble.jpg",
    },
    {
        id: "warm-natural-wood",
        name: "Fresh Mint Wood",
        wall: "mint",
        table: "light-wood",
        stand: "round-wooden-tray",
        image: "/scene-presets/warm-natural-wood.jpg",
    },
    {
        id: "cool-stone-minimal",
        name: "Cool Stone Minimal",
        wall: "cool-gray-stone",
        table: "white-stone",
        stand: "silver-board",
        image: "/scene-presets/cool-stone-minimal.jpg",
    },
    {
        id: "warm-cream-editorial",
        name: "Warm Cream Editorial",
        wall: "cream",
        table: "beige-stone",
        stand: "gold-board",
        image: "/scene-presets/warm-cream-editorial.jpg",
    },
    {
        id: "as-is-cleanup",
        name: "Improve Quality",
        wall: "keep",
        table: "keep",
        stand: "keep",
        type: "utility",
    },
];

const state = {
    mode: "bulk",
    sourceImageDataUrl: "",
    sourceImageUrl: "",
    resultImageDataUrl: "",
    uploadedFileName: "",
    bakeriesLoaded: false,
    bakeries: [],
    filteredBakeries: [],
    categories: [],
    products: [],
    selectedProductIds: new Set(),
    bulkResults: [],
    bulkSelectionLoading: false,
    bakeriesLoading: false,
    bakeriesFailed: false,
    bakeryDropdownOpen: false,
    selectedScenePresetId: SCENE_PRESETS[0].id,
    sceneCustomizeOpen: false,
};

const STORAGE_KEYS = {
    singleHistory: "ai-images-single-history",
    bulkHistory: "ai-images-bulk-history",
};

const DB_CONFIG = {
    name: "ai-images-history-db",
    version: 1,
    singleStore: "single-generations",
    bulkStore: "bulk-generations",
};

const STORAGE_LIMIT = 100;
const IMAGE_PRICING = {
    square: 0.034,
    horizontal: 0.05,
    vertical: 0.05,
};

function setStatus(message = "", isError = false) {
    elements.status.textContent = message;
    elements.status.style.color = isError ? "#a13d29" : "";
}

function setVisible(element, isVisible) {
    element.classList.toggle("is-hidden", !isVisible);
}

function formatUsdAmount(amount) {
    return `$${amount.toFixed(3).replace(/0+$/, "").replace(/\.$/, "")}`;
}

function getOrientationFromDimensions(width, height) {
    if (!width || !height) {
        return "horizontal";
    }

    if (width === height) {
        return "square";
    }

    return width > height ? "horizontal" : "vertical";
}

function getSingleImageOrientation() {
    if (!elements.preserveOrientation.checked) {
        return "horizontal";
    }

    return getOrientationFromDimensions(
        elements.sourcePreview.naturalWidth,
        elements.sourcePreview.naturalHeight,
    );
}

function getBulkImageOrientation(productId) {
    if (!elements.preserveOrientation.checked) {
        return "horizontal";
    }

    const image = elements.bulkSourcesGrid.querySelector(
        `img[data-product-image-id="${productId}"]`,
    );

    return getOrientationFromDimensions(image?.naturalWidth, image?.naturalHeight);
}

function getSingleGenerationCost() {
    if (!hasSingleSource()) {
        return 0;
    }

    return IMAGE_PRICING[getSingleImageOrientation()] || IMAGE_PRICING.horizontal;
}

function getBulkGenerationCost() {
    const selectedItems = state.products.filter((product) =>
        state.selectedProductIds.has(product.id),
    );

    return selectedItems.reduce((sum, product) => {
        const orientation = getBulkImageOrientation(product.id);
        return sum + (IMAGE_PRICING[orientation] || IMAGE_PRICING.horizontal);
    }, 0);
}

function updateGenerateButtonLabel() {
    if (state.mode === "single") {
        const amount = getSingleGenerationCost();
        elements.generateButton.textContent = "Generate";
        elements.costEstimate.textContent = amount ? `Cost ~ ${formatUsdAmount(amount)}` : "";
        setVisible(elements.costEstimate, Boolean(amount));
        return;
    }

    const selectedCount = state.selectedProductIds.size;
    const amount = getBulkGenerationCost();
    elements.generateButton.textContent = "Generate selected";
    elements.costEstimate.textContent =
        selectedCount > 0 ? `Cost ~ ${formatUsdAmount(amount)}` : "";
    setVisible(elements.costEstimate, selectedCount > 0);
}

function scheduleCostEstimateRefresh() {
    window.requestAnimationFrame(() => {
        updateGenerateButtonLabel();
    });
}

function readStoredHistory(key) {
    try {
        const rawValue = window.localStorage.getItem(key);

        if (!rawValue) {
            return [];
        }

        const parsed = JSON.parse(rawValue);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function writeStoredHistory(key, items) {
    try {
        window.localStorage.setItem(key, JSON.stringify(items.slice(0, STORAGE_LIMIT)));
    } catch (error) {
        console.warn("Could not write history summary to localStorage.", error);
    }
}

function appendStoredHistory(key, entry) {
    const history = readStoredHistory(key);
    history.unshift(entry);
    writeStoredHistory(key, history);
}

function scrollToWorkspaceTop() {
    const top = document.querySelector(".workspace")?.getBoundingClientRect().top ?? 0;
    window.scrollTo({
        top: window.scrollY + top - 16,
        behavior: "smooth",
    });
}

function scrollToResultSection() {
    const isMobile = window.matchMedia("(max-width: 980px)").matches;
    const target = isMobile
        ? document.querySelector(".preview-panel")
        : document.querySelector(".workspace");
    const top = target?.getBoundingClientRect().top ?? 0;

    window.scrollTo({
        top: window.scrollY + top - 16,
        behavior: "smooth",
    });
}

function updatePreview(preview, placeholder, src) {
    if (src) {
        preview.src = src;
        preview.classList.remove("is-empty");
        placeholder.style.display = "none";
        return;
    }

    preview.removeAttribute("src");
    preview.classList.add("is-empty");
    placeholder.style.display = "grid";
}

function setSingleResultLoading(isLoading) {
    setVisible(elements.resultLoader, isLoading);
    if (isLoading) {
        setVisible(elements.singleDownloadSection, false);
    }
}

function setBulkResultLoading(isLoading) {
    setVisible(elements.bulkResultLoader, isLoading);
    if (isLoading) {
        setVisible(elements.bulkDownloadSection, false);
    }
}

function getSelectedText(select) {
    return select.options[select.selectedIndex]?.textContent?.trim() || "";
}

function createHistoryId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function escapeZipFilename(name) {
    return String(name || "image")
        .replace(/\.[^.]+$/, "")
        .replace(/[<>:"/\\|?*\x00-\x1F]+/g, "-")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/(^-|-$)/g, "")
        .slice(0, 80);
}

function parseDataUrl(dataUrl) {
    const match = String(dataUrl || "").match(/^data:([^;,]+)?;base64,(.+)$/);

    if (!match) {
        throw new Error("Invalid image data.");
    }

    const binary = window.atob(match[2]);
    const bytes = new Uint8Array(binary.length);

    for (let index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index);
    }

    return bytes;
}

const crcTable = (() => {
    const table = new Uint32Array(256);

    for (let index = 0; index < 256; index += 1) {
        let crc = index;

        for (let bit = 0; bit < 8; bit += 1) {
            crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
        }

        table[index] = crc >>> 0;
    }

    return table;
})();

function crc32(bytes) {
    let crc = 0xffffffff;

    bytes.forEach((byte) => {
        crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
    });

    return (crc ^ 0xffffffff) >>> 0;
}

function dateToDos(date = new Date()) {
    const year = Math.max(1980, date.getFullYear());
    const dosTime =
        (date.getHours() << 11) |
        (date.getMinutes() << 5) |
        Math.floor(date.getSeconds() / 2);
    const dosDate =
        ((year - 1980) << 9) |
        ((date.getMonth() + 1) << 5) |
        date.getDate();

    return { dosTime, dosDate };
}

function createZipBlob(files) {
    const encoder = new TextEncoder();
    const { dosTime, dosDate } = dateToDos(new Date());
    const localParts = [];
    const centralParts = [];
    let offset = 0;

    files.forEach((file) => {
        const filenameBytes = encoder.encode(file.name);
        const dataBytes = file.data;
        const crc = crc32(dataBytes);

        const localHeader = new Uint8Array(30);
        const localView = new DataView(localHeader.buffer);
        localView.setUint32(0, 0x04034b50, true);
        localView.setUint16(4, 20, true);
        localView.setUint16(6, 0, true);
        localView.setUint16(8, 0, true);
        localView.setUint16(10, dosTime, true);
        localView.setUint16(12, dosDate, true);
        localView.setUint32(14, crc, true);
        localView.setUint32(18, dataBytes.length, true);
        localView.setUint32(22, dataBytes.length, true);
        localView.setUint16(26, filenameBytes.length, true);
        localView.setUint16(28, 0, true);
        localParts.push(localHeader, filenameBytes, dataBytes);

        const centralHeader = new Uint8Array(46);
        const centralView = new DataView(centralHeader.buffer);
        centralView.setUint32(0, 0x02014b50, true);
        centralView.setUint16(4, 20, true);
        centralView.setUint16(6, 20, true);
        centralView.setUint16(8, 0, true);
        centralView.setUint16(10, 0, true);
        centralView.setUint16(12, dosTime, true);
        centralView.setUint16(14, dosDate, true);
        centralView.setUint32(16, crc, true);
        centralView.setUint32(20, dataBytes.length, true);
        centralView.setUint32(24, dataBytes.length, true);
        centralView.setUint16(28, filenameBytes.length, true);
        centralView.setUint16(30, 0, true);
        centralView.setUint16(32, 0, true);
        centralView.setUint16(34, 0, true);
        centralView.setUint16(36, 0, true);
        centralView.setUint32(38, 0, true);
        centralView.setUint32(42, offset, true);
        centralParts.push(centralHeader, filenameBytes);

        offset += localHeader.length + filenameBytes.length + dataBytes.length;
    });

    const centralDirectory = new Blob(centralParts);
    const centralDirectorySize = centralDirectory.size;

    const endRecord = new Uint8Array(22);
    const endView = new DataView(endRecord.buffer);
    endView.setUint32(0, 0x06054b50, true);
    endView.setUint16(4, 0, true);
    endView.setUint16(6, 0, true);
    endView.setUint16(8, files.length, true);
    endView.setUint16(10, files.length, true);
    endView.setUint32(12, centralDirectorySize, true);
    endView.setUint32(16, offset, true);
    endView.setUint16(20, 0, true);

    return new Blob([...localParts, centralDirectory, endRecord], {
        type: "application/zip",
    });
}

function openHistoryDb() {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open(DB_CONFIG.name, DB_CONFIG.version);

        request.onupgradeneeded = () => {
            const db = request.result;

            if (!db.objectStoreNames.contains(DB_CONFIG.singleStore)) {
                db.createObjectStore(DB_CONFIG.singleStore, { keyPath: "id" });
            }

            if (!db.objectStoreNames.contains(DB_CONFIG.bulkStore)) {
                db.createObjectStore(DB_CONFIG.bulkStore, { keyPath: "id" });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error("Could not open IndexedDB."));
    });
}

function putIndexedDbRecord(storeName, value) {
    return openHistoryDb().then(
        (db) =>
            new Promise((resolve, reject) => {
                const transaction = db.transaction(storeName, "readwrite");
                const store = transaction.objectStore(storeName);

                transaction.oncomplete = () => {
                    db.close();
                    resolve();
                };
                transaction.onerror = () => {
                    db.close();
                    reject(transaction.error || new Error("Could not write IndexedDB record."));
                };

                store.put(value);
            }),
    );
}

async function storeSingleGeneration(resultImageDataUrl) {
    const id = createHistoryId("single");
    const date = new Date().toISOString();

    await putIndexedDbRecord(DB_CONFIG.singleStore, {
        id,
        date,
        resultImageDataUrl,
        sourceImageDataUrl: state.sourceImageDataUrl || "",
        sourceImageUrl: state.sourceImageUrl || "",
    });

    appendStoredHistory(STORAGE_KEYS.singleHistory, {
        id,
        date,
        hasSourceImageDataUrl: Boolean(state.sourceImageDataUrl),
        hasSourceImageUrl: Boolean(state.sourceImageUrl),
        hasResultImageDataUrl: Boolean(resultImageDataUrl),
    });
}

async function storeBulkGeneration(results) {
    const id = createHistoryId("bulk");
    const date = new Date().toISOString();

    await putIndexedDbRecord(DB_CONFIG.bulkStore, {
        id,
        date,
        bakeryId: elements.bakerySelect.value || "",
        categoryId: elements.categorySelect.value || "",
        results,
    });

    appendStoredHistory(STORAGE_KEYS.bulkHistory, {
        id,
        date,
        bakeryId: elements.bakerySelect.value || "",
        categoryId: elements.categorySelect.value || "",
        resultCount: Array.isArray(results) ? results.length : 0,
    });
}

function setBulkSelectionLoading(isLoading) {
    state.bulkSelectionLoading = isLoading;
    setVisible(elements.bulkSelectionLoader, isLoading);
    updateStepVisibility();
}

function setBakeriesLoading(isLoading) {
    state.bakeriesLoading = isLoading;
    if (isLoading) {
        elements.bakerySelect.disabled = true;
        elements.bakerySearchInput.disabled = true;
        setBakeryDropdownOpen(false);
        elements.bakerySearchInput.placeholder = "Loading bakeries...";
    }
    if (!isLoading) {
        elements.bakerySearchInput.disabled = false;
        elements.bakerySearchInput.placeholder = "Choose a bakery";
    }
    setVisible(elements.controlsLoadingOverlay, state.mode === "bulk" && isLoading);
    updateStepVisibility();
}

function setPromptVisibility(isVisible) {
    elements.promptEditorWrap.classList.toggle("is-collapsed", !isVisible);
    elements.togglePromptButton.textContent = isVisible ? "Hide prompt" : "Show prompt";
    elements.togglePromptButton.setAttribute("aria-expanded", String(isVisible));
}

function updateSelectAllProductsLabel() {
    const count = state.products.length;
    elements.selectAllProductsLabel.textContent =
        count > 0 ? `Select all (${count})` : "Select all";
}

function getMatchingScenePresetId() {
    const preset = SCENE_PRESETS.find(
        (item) =>
            item.wall === elements.wallSelect.value &&
            item.table === elements.tableSelect.value &&
            item.stand === elements.standSelect.value,
    );

    return preset?.id || "";
}

function updateSceneCustomizeVisibility() {
    setVisible(elements.sceneCustomizePanel, state.sceneCustomizeOpen);
    setVisible(elements.scenePresetGrid, !state.sceneCustomizeOpen);
    elements.toggleSceneCustomizeButton.textContent = state.sceneCustomizeOpen
        ? "Choose preset"
        : "Customize";
    elements.toggleSceneCustomizeButton.setAttribute(
        "aria-expanded",
        String(state.sceneCustomizeOpen),
    );
    syncScenePresetSelection();
}

function renderScenePresets() {
    elements.scenePresetGrid.innerHTML = SCENE_PRESETS.map(
        (preset) => `
            <button
                class="scene-preset-card ${preset.type === "utility" ? "scene-preset-card-utility" : ""}"
                type="button"
                data-scene-preset-id="${preset.id}"
            >
                ${
                    preset.type === "utility"
                        ? `
                            <div class="scene-preset-utility-thumb" aria-hidden="true">
                                <div class="scene-preset-utility-icon">✦</div>
                            </div>
                        `
                        : `<img class="scene-preset-thumb" src="${preset.image}" alt="${preset.name}" />`
                }
                <span class="scene-preset-name">${preset.name}</span>
            </button>
        `,
    ).join("");

    syncScenePresetSelection();
}

function syncScenePresetSelection() {
    const activePreset = SCENE_PRESETS.find((preset) => preset.id === state.selectedScenePresetId);
    elements.selectedSceneName.textContent = state.sceneCustomizeOpen
        ? "Custom"
        : activePreset
          ? activePreset.name
          : "Custom";

    elements.scenePresetGrid.querySelectorAll("[data-scene-preset-id]").forEach((button) => {
        button.classList.toggle(
            "is-active",
            button.dataset.scenePresetId === state.selectedScenePresetId,
        );
    });
}

function applyScenePreset(presetId, options = {}) {
    const preset = SCENE_PRESETS.find((item) => item.id === presetId);

    if (!preset) {
        return;
    }

    elements.wallSelect.value = preset.wall;
    elements.tableSelect.value = preset.table;
    elements.standSelect.value = preset.stand;
    state.selectedScenePresetId = preset.id;

    if (options.closeCustomize !== false) {
        state.sceneCustomizeOpen = false;
    }

    syncScenePresetSelection();
    updateSceneCustomizeVisibility();
    updatePromptFromSelections();
}

function syncProductCheckboxes() {
    elements.bulkSourcesGrid.querySelectorAll(".product-checkbox").forEach((checkbox) => {
        const productId = Number(checkbox.dataset.productId);
        checkbox.checked = state.selectedProductIds.has(productId);
    });

    elements.selectAllProducts.checked =
        state.products.length > 0 && state.selectedProductIds.size === state.products.length;
}

function openLightbox({ sourceSrc = "", resultSrc = "" }) {
    if (!sourceSrc && !resultSrc) {
        return;
    }

    const hasSource = Boolean(sourceSrc);
    const hasResult = Boolean(resultSrc);

    if (hasSource) {
        elements.lightboxSourceImage.src = sourceSrc;
    } else {
        elements.lightboxSourceImage.removeAttribute("src");
    }

    if (hasResult) {
        elements.lightboxImage.src = resultSrc;
    } else {
        elements.lightboxImage.removeAttribute("src");
    }

    setVisible(elements.lightboxSourcePane, hasSource);
    setVisible(elements.lightboxResultPane, hasResult);
    elements.lightboxDialog.classList.toggle("single-pane", hasSource !== hasResult);

    elements.lightbox.classList.remove("is-hidden");
    elements.lightbox.setAttribute("aria-hidden", "false");
}

function closeLightbox() {
    elements.lightbox.classList.add("is-hidden");
    elements.lightbox.setAttribute("aria-hidden", "true");
    elements.lightboxSourceImage.removeAttribute("src");
    elements.lightboxImage.removeAttribute("src");
    setVisible(elements.lightboxSourcePane, true);
    setVisible(elements.lightboxResultPane, true);
    elements.lightboxDialog.classList.remove("single-pane");
}

function fillSelect(select, options, placeholder) {
    select.innerHTML = "";

    if (placeholder) {
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = placeholder;
        select.appendChild(defaultOption);
    }

    options.forEach((option) => {
        const optionElement = document.createElement("option");
        optionElement.value = option.value ?? option.id;
        optionElement.textContent = option.label ?? option.name;
        select.appendChild(optionElement);
    });
}

function filterBakeries(searchTerm = "") {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const selectedValue = elements.bakerySelect.value;

    state.filteredBakeries = state.bakeries.filter((bakery) =>
        !normalizedSearch || String(bakery.name || "").toLowerCase().includes(normalizedSearch),
    );

    fillSelect(elements.bakerySelect, state.filteredBakeries, "Choose a bakery");

    if (
        selectedValue &&
        state.filteredBakeries.some((bakery) => String(bakery.id) === String(selectedValue))
    ) {
        elements.bakerySelect.value = selectedValue;
    }

    elements.bakerySelect.disabled = state.bakeriesLoading || state.filteredBakeries.length === 0;
    renderBakeryDropdown();
}

function setBakeryDropdownOpen(isOpen) {
    state.bakeryDropdownOpen = isOpen;
    setVisible(
        elements.bakeryDropdown,
        isOpen && !state.bakeriesLoading && !elements.bakerySelect.disabled,
    );
}

function renderBakeryDropdown() {
    if (state.filteredBakeries.length === 0) {
        elements.bakeryDropdown.innerHTML =
            '<div class="search-select-empty">No bakeries found</div>';
        return;
    }

    elements.bakeryDropdown.innerHTML = state.filteredBakeries
        .map(
            (bakery) => `
                <button
                    class="search-select-option ${String(bakery.id) === String(elements.bakerySelect.value) ? "is-active" : ""}"
                    type="button"
                    data-bakery-id="${bakery.id}"
                >
                    ${bakery.name}
                </button>
            `,
        )
        .join("");
}

function syncBakerySearchInput() {
    const selectedOption = state.bakeries.find(
        (bakery) => String(bakery.id) === String(elements.bakerySelect.value),
    );

    elements.bakerySearchInput.value = selectedOption?.name || "";
}

function getBakeryDropdownSearchTerm() {
    const currentValue = elements.bakerySearchInput.value.trim();
    const selectedOption = state.bakeries.find(
        (bakery) => String(bakery.id) === String(elements.bakerySelect.value),
    );

    if (
        selectedOption &&
        currentValue &&
        currentValue.toLowerCase() === String(selectedOption.name || "").trim().toLowerCase()
    ) {
        return "";
    }

    return currentValue;
}

function getSelectedOption(options, value) {
    return options.find((option) => option.value === value) || null;
}

function buildPrompt() {
    const wall = getSelectedOption(PROMPT_OPTIONS.walls, elements.wallSelect.value);
    const table = getSelectedOption(PROMPT_OPTIONS.tables, elements.tableSelect.value);
    const stand = getSelectedOption(PROMPT_OPTIONS.stands, elements.standSelect.value);

    if (!wall || !table || !stand) {
        return "";
    }

    return [
        "Improve the product photo quality while keeping the product itself realistic and unchanged.",
        "",
        "Background and surface requirements:",
        `- ${wall.prompt}`,
        `- ${table.prompt}`,
        "",
        "Stand or plate requirement:",
        `- ${stand.prompt}`,
        "",
        "Lighting requirements:",
        "- use soft, diffused lighting",
        "- remove harsh or heavy shadows",
        "- remove any surrounding objects or props if they are present",
        "- remove any visible logos, labels, or branding if they are present",
        "",
        "Preserve the product exactly:",
        "- do not change the shape, colors, decorations, proportions, or details of the product",
        "- place the product in the center of the final composition, even if it is off-center in the original image",
        "- the product must rest naturally on the table, stand, or plate and must never look like it is floating or flying",
        "- if needed, adjust the perspective or camera angle slightly so the product looks naturally placed and physically grounded",
        "",
        "Realism requirements:",
        "- the result must look like a real professional product photo",
        "- no collage look, no cut-out edges, no floating effect",
        "- natural contact between the product and the table, stand, or plate",
        "- keep the final image clean, minimal, and realistic",
    ].join("\n");
}

function hasSingleSource() {
    return Boolean(state.sourceImageDataUrl || state.sourceImageUrl);
}

function hasBulkSource() {
    return state.products.length > 0;
}

function isSceneReady() {
    return Boolean(
        elements.wallSelect.value &&
            elements.tableSelect.value &&
            elements.standSelect.value,
    );
}

function updatePromptFromSelections() {
    const prompt = buildPrompt();
    state.selectedScenePresetId = getMatchingScenePresetId();
    syncScenePresetSelection();

    if (prompt) {
        elements.promptEditor.value = prompt;
    } else {
        elements.promptEditor.value = "";
    }

    updateStepVisibility();
}

function resetSceneSelections() {
    applyScenePreset(SCENE_PRESETS[0].id);
    setPromptVisibility(false);
}

function resetSingleResult() {
    state.resultImageDataUrl = "";
    updatePreview(elements.resultPreview, elements.resultPlaceholder, "");
    setVisible(elements.singleDownloadSection, false);
}

function resetSingleSource() {
    state.sourceImageDataUrl = "";
    state.sourceImageUrl = "";
    state.uploadedFileName = "";
    elements.fileInput.value = "";
    elements.imageUrlInput.value = "";
    updatePreview(elements.sourcePreview, elements.sourcePlaceholder, "");
    resetSingleResult();
    resetSceneSelections();
    updateStepVisibility();
    setStatus("");
}

function updateStepVisibility() {
    const isSingle = state.mode === "single";
    const sourceReady = isSingle ? hasSingleSource() : hasBulkSource();
    const sceneReady = isSceneReady();
    const showBakerySection =
        !isSingle && (!state.bakeriesLoading || state.bakeriesLoaded || state.bakeriesFailed);

    setVisible(elements.singlePreviewSection, isSingle);
    setVisible(elements.bulkPreviewSection, !isSingle);
    setVisible(elements.singleControls, isSingle);
    setVisible(elements.bulkControls, !isSingle);
    setVisible(elements.bakerySection, showBakerySection);

    setVisible(elements.singleDropzoneWrap, isSingle && !hasSingleSource());
    setVisible(elements.singleSourceSection, isSingle && hasSingleSource());
    setVisible(
        elements.categorySection,
        !isSingle && Boolean(elements.bakerySelect.value) && !state.bulkSelectionLoading,
    );
    setVisible(elements.bulkSourceSection, !isSingle && hasBulkSource());

    setVisible(elements.sceneSection, sourceReady);
    setVisible(elements.wallField, sourceReady);
    setVisible(elements.tableField, sourceReady);
    setVisible(elements.standField, sourceReady);
    setVisible(elements.promptSection, sourceReady && sceneReady);
    setVisible(elements.preserveSection, sourceReady && sceneReady);
    setVisible(elements.actionsSection, sourceReady && sceneReady);

    updateGenerateButtonLabel();
}

function extractDroppedUrl(dataTransfer) {
    const uriList = dataTransfer.getData("text/uri-list").trim();

    if (uriList) {
        const firstValidLine = uriList
            .split("\n")
            .map((line) => line.trim())
            .find((line) => line && !line.startsWith("#"));

        if (firstValidLine) {
            return firstValidLine;
        }
    }

    const plainText = dataTransfer.getData("text/plain").trim();
    return /^https?:\/\//i.test(plainText) ? plainText : "";
}

async function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Could not read the file."));
        reader.readAsDataURL(file);
    });
}

async function handleFile(file) {
    if (!file) {
        return;
    }

    if (!file.type.startsWith("image/")) {
        setStatus("Please upload a PNG or JPEG image.", true);
        return;
    }

    const dataUrl = await readFileAsDataUrl(file);
    state.sourceImageDataUrl = dataUrl;
    state.sourceImageUrl = "";
    state.uploadedFileName = file.name;
    elements.imageUrlInput.value = "";
    resetSingleResult();
    updatePreview(elements.sourcePreview, elements.sourcePlaceholder, dataUrl);
    resetSceneSelections();
    updateStepVisibility();
    setStatus("");
}

function handleImageUrlInput(value) {
    const trimmedValue = value.trim();

    state.sourceImageUrl = trimmedValue;
    state.sourceImageDataUrl = "";
    state.uploadedFileName = trimmedValue
        ? trimmedValue.split("/").pop()?.split("?")[0] || "remote-image"
        : "";

    resetSingleResult();

    if (!trimmedValue) {
        updatePreview(elements.sourcePreview, elements.sourcePlaceholder, "");
        resetSceneSelections();
        updateStepVisibility();
        setStatus("");
        return;
    }

    updatePreview(elements.sourcePreview, elements.sourcePlaceholder, trimmedValue);
    resetSceneSelections();
    updateStepVisibility();
    setStatus("");
}

async function fetchJson(url) {
    const response = await fetch(url);
    const payload = await response.json();

    if (!response.ok) {
        throw new Error(payload.error || "Request failed.");
    }

    return payload;
}

async function ensureBakeriesLoaded() {
    if (state.bakeriesLoaded) {
        return;
    }

    setBakeriesLoading(true);
    state.bakeriesFailed = false;

    try {
        const payload = await fetchJson("/api/bakeries");
        state.bakeries = payload.bakeries || [];
        state.filteredBakeries = [...state.bakeries];
        filterBakeries(elements.bakerySearchInput.value);
        syncBakerySearchInput();
        state.bakeriesLoaded = true;
    } catch (error) {
        fillSelect(elements.bakerySelect, [], "Could not load bakeries");
        elements.bakerySelect.disabled = true;
        state.bakeriesFailed = true;
        throw error;
    } finally {
        setBakeriesLoading(false);
    }
}

async function loadCategories(bakeryId) {
    state.categories = [];
    state.products = [];
    state.selectedProductIds.clear();
    elements.categorySelect.disabled = true;
    fillSelect(elements.categorySelect, [], "Choose a category");
    resetSceneSelections();
    renderBulkSources();
    renderBulkResults([]);
    updateStepVisibility();

    if (!bakeryId) {
        return;
    }

    const payload = await fetchJson(`/api/categories?bakeryId=${encodeURIComponent(bakeryId)}`);
    state.categories = payload.categories || [];
    fillSelect(elements.categorySelect, state.categories, "Choose a category");
    elements.categorySelect.disabled = false;
    updateStepVisibility();

    if (state.categories.length > 0) {
        let selectedCategoryId = "";

        for (const category of state.categories) {
            // Try categories in order and keep the first one that actually has products.
            // This makes the auto-selection feel intentional instead of landing on an empty state.
            await loadProducts(bakeryId, String(category.id));

            if (state.products.length > 0) {
                selectedCategoryId = String(category.id);
                break;
            }
        }

        if (!selectedCategoryId) {
            selectedCategoryId = String(state.categories[0].id);
            await loadProducts(bakeryId, selectedCategoryId);
        }

        elements.categorySelect.value = selectedCategoryId;
    }
}

async function loadProducts(bakeryId, categoryId) {
    state.products = [];
    state.selectedProductIds.clear();
    resetSceneSelections();
    renderBulkSources();
    renderBulkResults([]);
    updateStepVisibility();

    if (!bakeryId || !categoryId) {
        return;
    }

    const payload = await fetchJson(
        `/api/products?bakeryId=${encodeURIComponent(bakeryId)}&categoryId=${encodeURIComponent(categoryId)}`,
    );
    state.products = payload.products || [];
    state.products.forEach((product) => {
        state.selectedProductIds.add(product.id);
    });
    elements.selectAllProducts.checked = state.products.length > 0;
    updateSelectAllProductsLabel();
    renderBulkSources();
    updateStepVisibility();
}

function renderBulkSources() {
    if (state.products.length === 0) {
        updateSelectAllProductsLabel();
        elements.bulkSourcesGrid.className = "bulk-results-grid empty-state";
        elements.bulkSourcesGrid.textContent = "Choose a bakery and category to load products.";
        updateStepVisibility();
        return;
    }

    elements.bulkSourcesGrid.className = "bulk-results-grid";
    elements.bulkSourcesGrid.innerHTML = state.products
        .map(
            (item) => `
                <article class="bulk-source-card">
                    <input
                        class="product-checkbox"
                        type="checkbox"
                        data-product-id="${item.id}"
                        ${state.selectedProductIds.has(item.id) ? "checked" : ""}
                    />
                    <button
                        class="bulk-result-image-button bulk-result-thumb"
                        type="button"
                        data-image-src="${item.imageUrl}"
                    >
                        <img
                            src="${item.imageUrl}"
                            alt="${item.name} source"
                            data-product-image-id="${item.id}"
                        />
                    </button>
                    <div class="bulk-result-name">${item.name}</div>
                </article>
            `,
        )
        .join("");
}

function renderBulkResults(results) {
    state.bulkResults = results;
    const successes = results.filter((item) => item.imageDataUrl);
    const errors = results.filter((item) => item.error);

    elements.bulkDownloadAllButton.disabled = successes.length === 0;
    setVisible(elements.bulkDownloadSection, successes.length > 0);

    if (successes.length === 0) {
        elements.bulkResultsGrid.className = "bulk-results-grid empty-state";
        elements.bulkResultsGrid.innerHTML =
            '<div class="empty-state-copy">Generated images will appear here after processing.</div>';
    } else {
        elements.bulkResultsGrid.className = "bulk-results-grid";
        elements.bulkResultsGrid.innerHTML = successes
            .map(
                (item) => `
                    <article class="bulk-result-card">
                        <button
                            class="bulk-result-image-button bulk-result-thumb"
                            type="button"
                            data-image-src="${item.imageDataUrl}"
                            data-source-src="${item.imageUrl}"
                        >
                            <img src="${item.imageDataUrl}" alt="${item.name}" />
                        </button>
                        <div class="bulk-result-name">${item.name}</div>
                    </article>
                `,
            )
            .join("");
    }

    if (errors.length === 0) {
        elements.bulkErrors.classList.add("is-hidden");
        elements.bulkErrors.innerHTML = "";
        return;
    }

    elements.bulkErrors.classList.remove("is-hidden");
    elements.bulkErrors.innerHTML = errors
        .map((item) => `<div>${item.name}: ${item.error}</div>`)
        .join("");
}

async function readNdjsonStream(response, onMessage) {
    if (!response.body) {
        throw new Error("Streaming is not supported in this browser.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
        const { value, done } = await reader.read();
        buffer += decoder.decode(value || new Uint8Array(), { stream: !done });

        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        lines.forEach((line) => {
            const trimmedLine = line.trim();

            if (!trimmedLine) {
                return;
            }

            onMessage(JSON.parse(trimmedLine));
        });

        if (done) {
            break;
        }
    }

    if (buffer.trim()) {
        onMessage(JSON.parse(buffer.trim()));
    }
}

function setMode(mode) {
    state.mode = mode;
    const isSingle = mode === "single";

    elements.singleModeButton.classList.toggle("is-active", isSingle);
    elements.bulkModeButton.classList.toggle("is-active", !isSingle);
    setVisible(elements.controlsLoadingOverlay, !isSingle && state.bakeriesLoading);

    if (!isSingle) {
        ensureBakeriesLoaded().catch((error) => {
            setStatus(error.message, true);
        });
    }

    updateStepVisibility();
}

function downloadImage(dataUrl, filenameBase) {
    const link = document.createElement("a");
    const safeName = (filenameBase || "generated-image")
        .replace(/\.[^.]+$/, "")
        .replace(/[^a-zA-Z0-9-_]+/g, "-")
        .replace(/(^-|-$)/g, "");

    link.href = dataUrl;
    link.download = `${safeName || "generated-image"}-result.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
}

async function generateSingle() {
    if (!hasSingleSource()) {
        setStatus("Please upload an image first.", true);
        return;
    }

    if (!elements.promptEditor.value.trim()) {
        setStatus("Prompt cannot be empty.", true);
        return;
    }

    elements.generateButton.disabled = true;
    elements.saveButton.disabled = true;
    setSingleResultLoading(true);
    scrollToResultSection();
    setStatus("");

    try {
        const response = await fetch("/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                imageDataUrl: state.sourceImageDataUrl,
                imageUrl: state.sourceImageUrl,
                prompt: elements.promptEditor.value,
                preserveOrientation: elements.preserveOrientation.checked,
            }),
        });

        const payload = await response.json();

        if (!response.ok) {
            throw new Error(payload.error || "Generation failed.");
        }

        state.resultImageDataUrl = payload.imageDataUrl;
        updatePreview(elements.resultPreview, elements.resultPlaceholder, state.resultImageDataUrl);
        await storeSingleGeneration(state.resultImageDataUrl);
        elements.saveButton.disabled = false;
        setVisible(elements.singleDownloadSection, true);
        setStatus("");
    } catch (error) {
        setStatus(error.message, true);
    } finally {
        setSingleResultLoading(false);
        elements.generateButton.disabled = false;
    }
}

async function generateBulk() {
    const selectedItems = state.products.filter((product) =>
        state.selectedProductIds.has(product.id),
    );

    if (!elements.bakerySelect.value || !elements.categorySelect.value) {
        setStatus("Please choose a bakery and category first.", true);
        return;
    }

    if (selectedItems.length === 0) {
        setStatus("Please select at least one product.", true);
        return;
    }

    if (!elements.promptEditor.value.trim()) {
        setStatus("Prompt cannot be empty.", true);
        return;
    }

    elements.generateButton.disabled = true;
    setBulkResultLoading(true);
    renderBulkResults([]);
    scrollToResultSection();
    setStatus("");

    try {
        const response = await fetch("/api/generate-bulk", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                items: selectedItems.map((product) => ({
                    id: product.id,
                    name: product.name,
                    imageUrl: product.imageUrl,
                })),
                prompt: elements.promptEditor.value,
                preserveOrientation: elements.preserveOrientation.checked,
            }),
        });

        if (!response.ok) {
            const payload = await response.json();
            throw new Error(payload.error || "Bulk generation failed.");
        }

        const progressiveResults = new Array(selectedItems.length);
        let completedResults = null;

        await readNdjsonStream(response, (message) => {
            if (message.type === "result") {
                progressiveResults[message.index] = message.result;
                renderBulkResults(progressiveResults.filter(Boolean));
                return;
            }

            if (message.type === "complete") {
                completedResults = Array.isArray(message.results) ? message.results : [];
                renderBulkResults(completedResults);
                return;
            }

            if (message.type === "error") {
                throw new Error(message.error || "Bulk generation failed.");
            }
        });

        await storeBulkGeneration(completedResults || progressiveResults.filter(Boolean));
        setStatus("");
    } catch (error) {
        renderBulkResults([]);
        setStatus(error.message, true);
    } finally {
        setBulkResultLoading(false);
        elements.generateButton.disabled = false;
    }
}

elements.singleModeButton.addEventListener("click", () => setMode("single"));
elements.bulkModeButton.addEventListener("click", () => setMode("bulk"));

elements.dropzone.addEventListener("click", () => {
    elements.fileInput.click();
});

elements.dropzone.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        elements.fileInput.click();
    }
});

elements.fileInput.addEventListener("change", async (event) => {
    const [file] = event.target.files;
    await handleFile(file);
});

elements.imageUrlInput.addEventListener("input", (event) => {
    handleImageUrlInput(event.target.value);
});

elements.sourcePreview.addEventListener("load", updateGenerateButtonLabel);
elements.bulkSourcesGrid.addEventListener("load", updateGenerateButtonLabel, true);

elements.singleResetButton.addEventListener("click", resetSingleSource);

["dragenter", "dragover", "drop"].forEach((eventName) => {
    window.addEventListener(eventName, (event) => {
        event.preventDefault();
    });
});

["dragenter", "dragover"].forEach((eventName) => {
    elements.dropzone.addEventListener(eventName, (event) => {
        event.preventDefault();
        elements.dropzone.classList.add("is-dragover");
    });
});

["dragleave", "drop"].forEach((eventName) => {
    elements.dropzone.addEventListener(eventName, (event) => {
        event.preventDefault();
        elements.dropzone.classList.remove("is-dragover");
    });
});

elements.dropzone.addEventListener("drop", async (event) => {
    const [file] = event.dataTransfer.files;

    if (file) {
        await handleFile(file);
        return;
    }

    const droppedUrl = extractDroppedUrl(event.dataTransfer);

    if (droppedUrl) {
        elements.imageUrlInput.value = droppedUrl;
        handleImageUrlInput(droppedUrl);
        return;
    }

    setStatus("Could not read an image file or image URL from this drop.", true);
});

elements.bakerySelect.addEventListener("change", async (event) => {
    try {
        syncBakerySearchInput();
        setBakeryDropdownOpen(false);
        setBulkSelectionLoading(Boolean(event.target.value));
        await loadCategories(event.target.value);
    } catch (error) {
        setStatus(error.message, true);
    } finally {
        setBulkSelectionLoading(false);
    }
});

elements.bakerySearchInput.addEventListener("input", (event) => {
    filterBakeries(event.target.value);
    setBakeryDropdownOpen(true);
});

elements.bakerySearchInput.addEventListener("focus", () => {
    if (!state.bakeriesLoading) {
        filterBakeries(getBakeryDropdownSearchTerm());
        setBakeryDropdownOpen(true);
    }
});

elements.bakeryComboboxButton.addEventListener("click", () => {
    if (state.bakeriesLoading || elements.bakerySelect.disabled) {
        return;
    }

    filterBakeries(getBakeryDropdownSearchTerm());
    setBakeryDropdownOpen(!state.bakeryDropdownOpen);
});

elements.bakeryDropdown.addEventListener("click", async (event) => {
    const option = event.target.closest("[data-bakery-id]");

    if (!option) {
        return;
    }

    elements.bakerySelect.value = option.dataset.bakeryId;
    syncBakerySearchInput();
    renderBakeryDropdown();
    setBakeryDropdownOpen(false);

    try {
        setBulkSelectionLoading(Boolean(elements.bakerySelect.value));
        await loadCategories(elements.bakerySelect.value);
    } catch (error) {
        setStatus(error.message, true);
    } finally {
        setBulkSelectionLoading(false);
    }
});

document.addEventListener("click", (event) => {
    if (!elements.bakeryCombobox.contains(event.target)) {
        setBakeryDropdownOpen(false);
    }
});

elements.categorySelect.addEventListener("change", async (event) => {
    try {
        await loadProducts(elements.bakerySelect.value, event.target.value);
    } catch (error) {
        setStatus(error.message, true);
    }
});

elements.selectAllProducts.addEventListener("change", (event) => {
    if (event.target.checked) {
        state.products.forEach((product) => state.selectedProductIds.add(product.id));
    } else {
        state.selectedProductIds.clear();
    }

    syncProductCheckboxes();
    updateGenerateButtonLabel();
});

elements.bulkSourcesGrid.addEventListener("change", (event) => {
    if (!event.target.matches(".product-checkbox")) {
        return;
    }

    const productId = Number(event.target.dataset.productId);

    if (event.target.checked) {
        state.selectedProductIds.add(productId);
    } else {
        state.selectedProductIds.delete(productId);
    }

    elements.selectAllProducts.checked =
        state.products.length > 0 && state.selectedProductIds.size === state.products.length;
    updateGenerateButtonLabel();
});

elements.wallSelect.addEventListener("change", updatePromptFromSelections);
elements.tableSelect.addEventListener("change", updatePromptFromSelections);
elements.standSelect.addEventListener("change", updatePromptFromSelections);
elements.preserveOrientation.addEventListener("change", updateGenerateButtonLabel);
elements.preserveOrientation.addEventListener("click", scheduleCostEstimateRefresh);
elements.preserveSection.addEventListener("click", scheduleCostEstimateRefresh);
elements.toggleSceneCustomizeButton.addEventListener("click", () => {
    state.sceneCustomizeOpen = !state.sceneCustomizeOpen;
    updateSceneCustomizeVisibility();
});
elements.scenePresetGrid.addEventListener("click", (event) => {
    const presetButton = event.target.closest("[data-scene-preset-id]");

    if (!presetButton) {
        return;
    }

    applyScenePreset(presetButton.dataset.scenePresetId);
});

elements.togglePromptButton.addEventListener("click", () => {
    const isCollapsed = elements.promptEditorWrap.classList.contains("is-collapsed");
    setPromptVisibility(isCollapsed);
});

elements.resultPreview.addEventListener("click", () => {
    if (state.resultImageDataUrl) {
        openLightbox({
            sourceSrc: state.sourceImageDataUrl || state.sourceImageUrl,
            resultSrc: state.resultImageDataUrl,
        });
    }
});

elements.sourcePreview.addEventListener("click", () => {
    if (hasSingleSource()) {
        openLightbox({
            sourceSrc: state.sourceImageDataUrl || state.sourceImageUrl,
        });
    }
});

elements.bulkSourcesGrid.addEventListener("click", (event) => {
    const imageButton = event.target.closest(".bulk-result-image-button");

    if (imageButton) {
        openLightbox({
            sourceSrc: imageButton.dataset.imageSrc,
        });
    }
});

elements.bulkResultsGrid.addEventListener("click", (event) => {
    const imageButton = event.target.closest(".bulk-result-image-button");

    if (imageButton) {
        openLightbox({
            sourceSrc: imageButton.dataset.sourceSrc,
            resultSrc: imageButton.dataset.imageSrc,
        });
    }
});

elements.bulkDownloadAllButton.addEventListener("click", async () => {
    const successes = state.bulkResults.filter((item) => item.imageDataUrl);

    if (successes.length === 0) {
        setStatus("There are no generated results to download yet.", true);
        return;
    }

    elements.bulkDownloadAllButton.disabled = true;

    try {
        const generationDate = new Date().toISOString().slice(0, 10);
        const bakeryName = getSelectedText(elements.bakerySelect) || "bakery";
        const categoryName = getSelectedText(elements.categorySelect) || "category";
        const archiveName = `${bakeryName}-${categoryName}-${generationDate}`
            .replace(/[<>:"/\\|?*\x00-\x1F]+/g, "-")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .replace(/(^-|-$)/g, "");
        const folderName = escapeZipFilename(archiveName || "generated-results");
        const seenNames = new Map();
        const zipBlob = createZipBlob(
            successes.map((item, index) => {
                const baseName =
                    escapeZipFilename(item.name || `image-${index + 1}`) || `image-${index + 1}`;
                const occurrence = (seenNames.get(baseName) || 0) + 1;
                seenNames.set(baseName, occurrence);
                const uniqueBaseName =
                    occurrence === 1 ? baseName : `${baseName}-${occurrence}`;

                return {
                    name: `${folderName}/${uniqueBaseName}.png`,
                    data: parseDataUrl(item.imageDataUrl),
                };
            }),
        );

        const blobUrl = URL.createObjectURL(zipBlob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `${archiveName || "generated-results"}.zip`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(blobUrl);
        setStatus("Archive download started.");
    } catch (error) {
        setStatus(error.message, true);
    } finally {
        elements.bulkDownloadAllButton.disabled =
            state.bulkResults.filter((item) => item.imageDataUrl).length === 0;
    }
});

elements.lightboxClose.addEventListener("click", closeLightbox);
elements.lightbox.addEventListener("click", (event) => {
    if (event.target === elements.lightbox) {
        closeLightbox();
    }
});

window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeLightbox();
    }
});

elements.generateButton.addEventListener("click", () => {
    if (state.mode === "single") {
        generateSingle();
        return;
    }

    generateBulk();
});

elements.saveButton.addEventListener("click", () => {
    if (!state.resultImageDataUrl) {
        setStatus("There is nothing to download yet.", true);
        return;
    }

    downloadImage(state.resultImageDataUrl, state.uploadedFileName);
    setStatus("Download started.");
});

fillSelect(elements.wallSelect, PROMPT_OPTIONS.walls);
fillSelect(elements.tableSelect, PROMPT_OPTIONS.tables);
fillSelect(elements.standSelect, PROMPT_OPTIONS.stands);
renderScenePresets();
updateSceneCustomizeVisibility();
resetSceneSelections();
updatePreview(elements.sourcePreview, elements.sourcePlaceholder, "");
updatePreview(elements.resultPreview, elements.resultPlaceholder, "");
setSingleResultLoading(false);
setBulkResultLoading(false);
setVisible(elements.singleDownloadSection, false);
setVisible(elements.bulkDownloadSection, false);
renderBulkSources();
renderBulkResults([]);
updateSelectAllProductsLabel();
setMode("bulk");
setStatus("");
