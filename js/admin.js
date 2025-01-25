document.addEventListener('DOMContentLoaded', () => {
    const uploadZone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('file-input');
    const fileList = document.getElementById('file-list');

    // Prévenir le comportement par défaut du drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    // Mettre en surbrillance la zone de drop
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadZone.addEventListener(eventName, unhighlight, false);
    });

    // Gérer le drop
    uploadZone.addEventListener('drop', handleDrop, false);
    fileInput.addEventListener('change', handleFiles, false);

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight(e) {
        uploadZone.classList.add('dragging');
    }

    function unhighlight(e) {
        uploadZone.classList.remove('dragging');
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles({ target: { files: files } });
    }

    function handleFiles(e) {
        const files = [...e.target.files];
        files.forEach(uploadFile);
    }

    function uploadFile(file) {
        // Créer un élément de fichier dans la liste
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';

        // Créer l'affichage du fichier
        fileItem.innerHTML = `
            <div class="file-info">
                <span>${file.name}</span>
                <span>${formatFileSize(file.size)}</span>
            </div>
            <div class="file-actions">
                <button class="modern-button" onclick="copyFileLink('${file.name}')">Copier le lien</button>
                <button class="delete-button" onclick="deleteFile('${file.name}')">Supprimer</button>
            </div>
        `;

        fileList.appendChild(fileItem);

        // Simuler un upload
        // Dans un cas réel, vous utiliseriez FormData et fetch pour envoyer le fichier à votre serveur
        console.log('Uploading file:', file.name);
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
});

// Fonctions globales pour les actions sur les fichiers
function copyFileLink(filename) {
    const link = `${window.location.origin}/downloads/${filename}`;
    navigator.clipboard.writeText(link)
        .then(() => alert('Lien copié !'))
        .catch(err => console.error('Erreur lors de la copie :', err));
}

function deleteFile(filename) {
    if (confirm(`Voulez-vous vraiment supprimer ${filename} ?`)) {
        // Dans un cas réel, vous feriez une requête à votre serveur pour supprimer le fichier
        console.log('Deleting file:', filename);
        // Supprimer l'élément de la liste
        const fileItem = document.querySelector(`.file-item:has(span:contains('${filename}'))`);
        if (fileItem) {
            fileItem.remove();
        }
    }
}