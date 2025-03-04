const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const imageToCrop = document.getElementById('image-to-crop');
const cropBtn = document.getElementById('crop-btn');
const croppedResult = document.getElementById('cropped-result');
let cropper;

document.getElementById('cropped-result').classList.add('disabled');

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
    document.getElementById('cropped-result').classList.remove('disabled');
    croppedResult.src = croppedCanvas.toDataURL('image/png');
});