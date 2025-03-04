const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const imageToCrop = document.getElementById('image-to-crop');
const cropBtn = document.getElementById('crop-btn');
const croppedResult = document.getElementById('cropped-result');
const resultContainer = document.getElementById('result-container');
const uploadBtn = document.getElementById('upload-btn');
const saveBtn = document.getElementById('save-btn');
let croppedImageBlob = null;
let cropper;

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
});

// Highlight drop zone when item is dragged over it
['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, unhighlight, false);
});

// Handle dropped files
dropZone.addEventListener('drop', handleDrop, false);

// Handle click to upload
dropZone.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', handleFiles);

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight() {
    dropZone.style.backgroundColor = 'rgba(85, 255, 85, 0.2)';
}

function unhighlight() {
    dropZone.style.backgroundColor = 'transparent';
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

function handleFiles(files) {
    // Reset previous state
    resultContainer.style.display = 'none';
    uploadBtn.style.display = 'none';
    saveBtn.style.display = 'none';
    croppedResult.src = '';

    // If called from file input, get files from event
    files = files.target ? files.target.files : files;
    
    const file = files[0];
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        imageToCrop.src = e.target.result;
        imageToCrop.style.display = 'block';
        
        // Destroy previous cropper instance if exists
        if (cropper) {
            cropper.destroy();
        }

        // Wait for image to load
        imageToCrop.onload = () => {
            // Initialize Cropper.js
            cropper = new Cropper(imageToCrop, {
                aspectRatio: 1,
                viewMode: 1,
                minCropBoxWidth: 64,
                minCropBoxHeight: 64
            });

            // Show crop button
            cropBtn.style.display = 'block';
        };
    };
    reader.readAsDataURL(file);
}

cropBtn.addEventListener('click', () => {
    if (!cropper) return;

    // Get cropped canvas
    const croppedCanvas = cropper.getCroppedCanvas({
        width: 64,
        height: 64
    });

    // Set cropped image
    croppedResult.src = croppedCanvas.toDataURL('image/png');
    
    // Convert canvas to blob for uploading
    croppedCanvas.toBlob((blob) => {
        croppedImageBlob = blob;
    });

    // Show result container and buttons
    resultContainer.style.display = 'flex';
    uploadBtn.style.display = 'block';
    saveBtn.style.display = 'block';
});

// Save file to PC
saveBtn.addEventListener('click', () => {
    if (!croppedImageBlob) return;

    // Create a link element and trigger download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(croppedImageBlob);
    link.download = 'server-icon.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});