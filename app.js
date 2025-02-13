let selectedPhotos = [];

// 儲存並上傳目標與照片
function uploadPhotos() {
    const goal = document.getElementById('goalInput').value;
    if (!goal) {
        alert("請先輸入今日的工作目標！");
        return;
    }

    if (selectedPhotos.length > 0) {
        // 儲存工作目標到 localStorage
        localStorage.setItem('goal', goal);

        selectedPhotos.forEach(photoData => {
            const date = new Date();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const photoInfo = {
                photoData,
                month,
                day,
                goal
            };
            
            const uploadedPhotos = JSON.parse(localStorage.getItem('photos')) || [];
            uploadedPhotos.push(photoInfo);
            localStorage.setItem('photos', JSON.stringify(uploadedPhotos));
        });

        alert('照片已上傳！');
        displayUploadedPhotos();
        selectedPhotos = [];  // 清空選擇的照片
        document.getElementById('photoPreviews').innerHTML = '';  // 清空預覽
    }
}

// 顯示上傳的照片
function displayUploadedPhotos() {
    const uploadedPhotos = JSON.parse(localStorage.getItem('photos')) || [];
    const uploadedPhotosContainer = document.getElementById('uploadedPhotos');
    uploadedPhotosContainer.innerHTML = ''; // 清空舊的內容

    uploadedPhotos.forEach(photo => {
        const { photoData, month, day, goal } = photo;
        
        const photoDiv = document.createElement('div');
        photoDiv.classList.add('uploaded-photo');
        
        const img = document.createElement('img');
        img.src = photoData;
        photoDiv.appendChild(img);
        
        const infoDiv = document.createElement('div');
        infoDiv.innerHTML = `<strong>${goal}</strong><br>日期: ${month}/${day}`;
        photoDiv.appendChild(infoDiv);
        
        // 創建下載按鈕
        const downloadLink = document.createElement('a');
        downloadLink.href = photoData;  // 圖片資料作為下載鏈接
        downloadLink.download = `photo_${month}_${day}.jpg`;  // 設定下載的文件名稱
        downloadLink.classList.add('download-btn');
        downloadLink.textContent = '下載';
        photoDiv.appendChild(downloadLink);

        // 創建刪除按鈕
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.textContent = '刪除';
        deleteBtn.onclick = () => deletePhoto(photoData);
        photoDiv.appendChild(deleteBtn);

        uploadedPhotosContainer.appendChild(photoDiv);
    });
}

// 刪除照片
function deletePhoto(photoData) {
    const uploadedPhotos = JSON.parse(localStorage.getItem('photos')) || [];
    const updatedPhotos = uploadedPhotos.filter(photo => photo.photoData !== photoData);
    localStorage.setItem('photos', JSON.stringify(updatedPhotos));
    displayUploadedPhotos(); // 重新顯示照片列表
}

// 顯示預覽照片
function displayPhotoPreview(file) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const photoData = event.target.result;
        selectedPhotos.push(photoData);
        updatePhotoPreviews();
    }
    reader.readAsDataURL(file);
}

// 更新預覽區域
function updatePhotoPreviews() {
    const photoPreviewsContainer = document.getElementById('photoPreviews');
    photoPreviewsContainer.innerHTML = '';
    
    selectedPhotos.forEach((photoData, index) => {
        const img = document.createElement('img');
        img.src = photoData;
        img.onclick = () => removeSelectedPhoto(index);
        photoPreviewsContainer.appendChild(img);
    });
}

// 刪除選擇的照片
function removeSelectedPhoto(index) {
    selectedPhotos.splice(index, 1);
    updatePhotoPreviews();
}

// 監聽文件選擇
document.getElementById('photoInput').addEventListener('change', function(event) {
    const files = event.target.files;
    Array.from(files).forEach(file => {
        displayPhotoPreview(file);
    });
});

// 清除儲存資料
function clearStorage() {
    localStorage.clear();
    alert('已清除所有儲存資料');
    window.location.reload();
}
