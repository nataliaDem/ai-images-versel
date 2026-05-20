const elements = {
    singleModeButton: document.getElementById("singleModeButton"),
    bulkModeButton: document.getElementById("bulkModeButton"),
    singleControls: document.getElementById("singleControls"),
    bulkControls: document.getElementById("bulkControls"),
    dropzone: document.getElementById("dropzone"),
    fileInput: document.getElementById("fileInput"),
    imageUrlInput: document.getElementById("imageUrlInput"),
    singleSourceSection: document.getElementById("singleSourceSection"),
    bakerySelect: document.getElementById("bakerySelect"),
    categorySelect: document.getElementById("categorySelect"),
    bulkSourceSection: document.getElementById("bulkSourceSection"),
    selectAllProducts: document.getElementById("selectAllProducts"),
    wallSelect: document.getElementById("wallSelect"),
    tableSelect: document.getElementById("tableSelect"),
    standSelect: document.getElementById("standSelect"),
    togglePromptButton: document.getElementById("togglePromptButton"),
    promptEditorWrap: document.getElementById("promptEditorWrap"),
    promptEditor: document.getElementById("promptEditor"),
    preserveOrientation: document.getElementById("preserveOrientation"),
    generateButton: document.getElementById("generateButton"),
    saveButton: document.getElementById("saveButton"),
    sourcePreview: document.getElementById("sourcePreview"),
    resultPreview: document.getElementById("resultPreview"),
    sourcePlaceholder: document.getElementById("sourcePlaceholder"),
    resultPlaceholder: document.getElementById("resultPlaceholder"),
    resultLoader: document.getElementById("resultLoader"),
    singlePreviewSection: document.getElementById("singlePreviewSection"),
    bulkPreviewSection: document.getElementById("bulkPreviewSection"),
    bulkSourcesGrid: document.getElementById("bulkSourcesGrid"),
    bulkResultsGrid: document.getElementById("bulkResultsGrid"),
    bulkResultLoader: document.getElementById("bulkResultLoader"),
    bulkDownloadAllButton: document.getElementById("bulkDownloadAllButton"),
    bulkErrors: document.getElementById("bulkErrors"),
    status: document.getElementById("status"),
    lightbox: document.getElementById("lightbox"),
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
            value: "white-pedestal",
            label: "White pedestal stand",
            prompt: "place the product on a white pedestal stand",
        },
        {
            value: "white-plate",
            label: "Large white plate",
            prompt: "place the product on a large white plate",
        },
    ],
};

const state = {
    mode: "single",
    sourceImageDataUrl: "",
    sourceImageUrl: "",
    resultImageDataUrl: "",
    uploadedFileName: "",
    bakeriesLoaded: false,
    bakeries: [],
    categories: [],
    products: [],
    selectedProductIds: new Set(),
    bulkResults: [],
};

function setStatus(message, isError = false) {
    elements.status.textContent = message;
    elements.status.style.color = isError ? "#a13d29" : "";
}

function scrollToWorkspaceTop() {
    const top = document.querySelector(".workspace")?.getBoundingClientRect().top ?? 0;
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
    elements.resultLoader.classList.toggle("is-hidden", !isLoading);
}

function setBulkResultLoading(isLoading) {
    elements.bulkResultLoader.classList.toggle("is-hidden", !isLoading);
}

function setSingleSourceVisibility(isVisible) {
    elements.singleSourceSection.classList.toggle("is-hidden", !isVisible);
}

function setBulkSourceVisibility(isVisible) {
    elements.bulkSourceSection.classList.toggle("is-hidden", !isVisible);
}

function openLightbox(imageSrc) {
    if (!imageSrc) {
        return;
    }

    elements.lightboxImage.src = imageSrc;
    elements.lightbox.classList.remove("is-hidden");
    elements.lightbox.setAttribute("aria-hidden", "false");
}

function closeLightbox() {
    elements.lightbox.classList.add("is-hidden");
    elements.lightbox.setAttribute("aria-hidden", "true");
    elements.lightboxImage.removeAttribute("src");
}

function getSelectedOption(options, value) {
    return options.find((option) => option.value === value) || options[0];
}

function buildPrompt() {
    const wall = getSelectedOption(PROMPT_OPTIONS.walls, elements.wallSelect.value);
    const table = getSelectedOption(PROMPT_OPTIONS.tables, elements.tableSelect.value);
    const stand = getSelectedOption(PROMPT_OPTIONS.stands, elements.standSelect.value);

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
        "",
        "Preserve the product exactly:",
        "- do not change the shape, colors, decorations, proportions, or details of the product",
        "",
        "Realism requirements:",
        "- the result must look like a real professional product photo",
        "- no collage look, no cut-out edges, no floating effect",
        "- natural contact between the product and the table, stand, or plate",
        "- keep the final image clean, minimal, and realistic",
    ].join("\n");
}

function updatePromptFromSelections() {
    elements.promptEditor.value = buildPrompt();
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

function setPromptVisibility(isVisible) {
    elements.promptEditorWrap.classList.toggle("is-collapsed", !isVisible);
    elements.togglePromptButton.textContent = isVisible ? "Hide prompt" : "Show prompt";
    elements.togglePromptButton.setAttribute("aria-expanded", String(isVisible));
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

    if (/^https?:\/\//i.test(plainText)) {
        return plainText;
    }

    return "";
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
    state.resultImageDataUrl = "";
    updatePreview(elements.sourcePreview, elements.sourcePlaceholder, dataUrl);
    updatePreview(elements.resultPreview, elements.resultPlaceholder, "");
    setSingleSourceVisibility(true);
    elements.saveButton.disabled = true;
    setStatus(`File ready: ${file.name}`);
}

function handleImageUrlInput(value) {
    const trimmedValue = value.trim();

    state.sourceImageUrl = trimmedValue;
    state.sourceImageDataUrl = "";
    state.resultImageDataUrl = "";
    state.uploadedFileName = trimmedValue
        ? trimmedValue.split("/").pop()?.split("?")[0] || "remote-image"
        : "";

    updatePreview(elements.resultPreview, elements.resultPlaceholder, "");
    elements.saveButton.disabled = true;

    if (!trimmedValue) {
        updatePreview(elements.sourcePreview, elements.sourcePlaceholder, "");
        setSingleSourceVisibility(false);
        setStatus("Choose an image and edit the prompt if needed.");
        return;
    }

    updatePreview(elements.sourcePreview, elements.sourcePlaceholder, trimmedValue);
    setSingleSourceVisibility(true);
    setStatus("Image URL ready.");
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

    const payload = await fetchJson("/api/bakeries");
    state.bakeries = payload.bakeries || [];
    fillSelect(elements.bakerySelect, state.bakeries, "Choose a bakery");
    state.bakeriesLoaded = true;
}

async function loadCategories(bakeryId) {
    state.categories = [];
    state.products = [];
    state.selectedProductIds.clear();
    elements.categorySelect.disabled = true;
    fillSelect(elements.categorySelect, [], "Choose a category");
    renderBulkSources();
    renderBulkResults([]);

    if (!bakeryId) {
        return;
    }

    const payload = await fetchJson(`/api/categories?bakeryId=${encodeURIComponent(bakeryId)}`);
    state.categories = payload.categories || [];
    fillSelect(elements.categorySelect, state.categories, "Choose a category");
    elements.categorySelect.disabled = false;
}

async function loadProducts(bakeryId, categoryId) {
    state.products = [];
    state.selectedProductIds.clear();
    renderBulkSources();
    renderBulkResults([]);

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
    renderBulkSources();
}

function renderBulkSources() {
    if (state.products.length === 0) {
        elements.bulkSourcesGrid.className = "bulk-results-grid empty-state";
        elements.bulkSourcesGrid.textContent = "Choose a bakery and category to load products.";
        setBulkSourceVisibility(false);
        return;
    }

    setBulkSourceVisibility(true);
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
                        <img src="${item.imageUrl}" alt="${item.name} source" />
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

    if (successes.length === 0) {
        elements.bulkResultsGrid.className = "bulk-results-grid empty-state";
        elements.bulkResultsGrid.textContent = "Generated product images will appear here.";
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

function setMode(mode) {
    state.mode = mode;
    const isSingle = mode === "single";

    elements.singleModeButton.classList.toggle("is-active", isSingle);
    elements.bulkModeButton.classList.toggle("is-active", !isSingle);
    elements.singleControls.classList.toggle("is-hidden", !isSingle);
    elements.bulkControls.classList.toggle("is-hidden", isSingle);
    elements.singlePreviewSection.classList.toggle("is-hidden", !isSingle);
    elements.bulkPreviewSection.classList.toggle("is-hidden", isSingle);
    elements.generateButton.textContent = isSingle ? "Generate" : "Generate selected";

    if (!isSingle) {
        ensureBakeriesLoaded().catch((error) => {
            setStatus(error.message, true);
        });
    }
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
    if (!state.sourceImageDataUrl && !state.sourceImageUrl) {
        setStatus("Please upload an image or provide an image URL first.", true);
        return;
    }

    if (!elements.promptEditor.value.trim()) {
        setStatus("Prompt cannot be empty.", true);
        return;
    }

    elements.generateButton.disabled = true;
    elements.saveButton.disabled = true;
    setSingleResultLoading(true);
    scrollToWorkspaceTop();
    setStatus("Generation started. This may take a little while.");

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
        elements.saveButton.disabled = false;
        setStatus(`Done. Result size: ${payload.size}`);
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
    scrollToWorkspaceTop();
    setStatus(`Generating ${selectedItems.length} products in parallel.`);

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

        const payload = await response.json();

        if (!response.ok) {
            throw new Error(payload.error || "Bulk generation failed.");
        }

        renderBulkResults(payload.results || []);
        setStatus("Bulk generation finished.");
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
        await loadCategories(event.target.value);
    } catch (error) {
        setStatus(error.message, true);
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

    renderBulkSources();
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
    renderBulkSources();
});

elements.wallSelect.addEventListener("change", updatePromptFromSelections);
elements.tableSelect.addEventListener("change", updatePromptFromSelections);
elements.standSelect.addEventListener("change", updatePromptFromSelections);

elements.togglePromptButton.addEventListener("click", () => {
    const isCollapsed = elements.promptEditorWrap.classList.contains("is-collapsed");
    setPromptVisibility(isCollapsed);
});

elements.resultPreview.addEventListener("click", () => {
    if (state.resultImageDataUrl) {
        openLightbox(state.resultImageDataUrl);
    }
});

elements.sourcePreview.addEventListener("click", () => {
    if (state.sourceImageDataUrl || state.sourceImageUrl) {
        openLightbox(state.sourceImageDataUrl || state.sourceImageUrl);
    }
});

elements.bulkSourcesGrid.addEventListener("click", (event) => {
    const imageButton = event.target.closest(".bulk-result-image-button");

    if (imageButton) {
        openLightbox(imageButton.dataset.imageSrc);
    }
});

elements.bulkResultsGrid.addEventListener("click", (event) => {
    const imageButton = event.target.closest(".bulk-result-image-button");

    if (imageButton) {
        openLightbox(imageButton.dataset.imageSrc);
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
        const response = await fetch("/api/download-bulk-archive", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                items: successes.map((item) => ({
                    name: item.name,
                    imageDataUrl: item.imageDataUrl,
                })),
            }),
        });

        if (!response.ok) {
            const payload = await response.json();
            throw new Error(payload.error || "Could not create the archive.");
        }

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = "generated-results.zip";
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
updatePromptFromSelections();
updatePreview(elements.sourcePreview, elements.sourcePlaceholder, "");
updatePreview(elements.resultPreview, elements.resultPlaceholder, "");
setSingleResultLoading(false);
setBulkResultLoading(false);
setSingleSourceVisibility(false);
setBulkSourceVisibility(false);
setPromptVisibility(false);
setMode("single");
renderBulkSources();
renderBulkResults([]);
setStatus("Choose an image and edit the prompt if needed.");
