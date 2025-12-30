let cart = [];
// 預載入圖片，防止捲動時白屏
function preloadImages() {
    for (let i = 1; i <= 6; i++) {
        const img = new Image();
        img.src = `images/shoes_${i}.webp`;
    }
}
preloadImages();
// 模擬商品資料
// 修改 script.js 開頭的這段資料
const products = [
    { id: 1, name: "經典素T", category: "clothes", price: 590, hot: true, img: "https://via.placeholder.com/200?text=Shirt" },
    { id: 2, name: "工裝長褲", category: "pants", price: 1280, hot: true, img: "https://via.placeholder.com/200?text=Pants" },
    { 
        id: 3, 
        name: "Nike Air Force 1 Low 異形液態銀", 
        category: "shoes", 
        price: 5600, 
        hot: true, 
        hasRotate: true,      // 關鍵：標記支援旋轉
        folder: "af1_silver", // 關鍵：圖片資料夾名稱
        frames: 6, 
        img: "images/products/af1_silver/1.webp" 
    },
    { id: 4, name: "防風外套", category: "jackets", price: 1980, hot: true, img: "https://via.placeholder.com/200?text=Jacket" },
    {
        id: 5, 
        name: "Nike Dunk 低筒 Retro", 
        category: "shoes", 
        price: 3400, 
        hot: true, 
        hasRotate: true,      // 關鍵：標記支援旋轉
        folder: "af_white", // 關鍵：圖片資料夾名稱
        frames: 6, 
        img: "images/products/af_white/1.webp"
        
    },
    {
        id: 6, 
        name: "iSNEAKERS｜CLOT x BAPE® x adidas Superstar 綠迷彩", 
        category: "shoes", 
        price: 11800,  
        hasRotate: true,      // 關鍵：標記支援旋轉
        folder: "bape_shoes", // 關鍵：圖片資料夾名稱
        frames: 6, 
        img: "images/products/bape_shoes/1.webp"
    }
];
const productList = document.getElementById('product-list');
const modal = document.getElementById('product-modal');
const spinImage = document.getElementById('spin-image');
let cartCount = 0;

// 1. 初始化商品渲染
function renderProducts(filter = 'all') {
    productList.innerHTML = "";
    const filtered = products.filter(p => filter === 'all' || p.category === filter || (filter === 'hot' && p.hot));
    
    filtered.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${p.img}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>$${p.price}</p>
        `;
        card.onclick = () => openModal(p);
        productList.appendChild(card);
    });
}

// 2. 分類功能
document.querySelectorAll('.category-nav button').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelector('.category-nav button.active').classList.remove('active');
        e.target.classList.add('active');
        renderProducts(e.target.dataset.filter);
    });
});

function openModal(product) {
    const modal = document.getElementById('product-modal');
    const spinImage = document.getElementById('spin-image');
    
    document.getElementById('modal-title').innerText = product.name;
    // 更新價格顯示
    document.querySelector('.product-info .price').innerText = `$${product.price.toLocaleString()}`;
    // 重置數量為 1
    document.getElementById('qty-input').value = 1; 
    
    modal.style.display = "block";
    
    if (product.hasRotate) {
        let currentFrame = 1;
        // 修改路徑為資料夾模式
        spinImage.src = `images/products/${product.folder}/1.webp`;
        
        const viewer = document.getElementById('rotate-viewer');
        viewer.onwheel = (e) => {
            e.preventDefault();
            if (e.deltaY > 0) {
                currentFrame = (currentFrame % product.frames) + 1;
            } else {
                currentFrame = (currentFrame - 2 + product.frames) % product.frames + 1;
            }
            spinImage.src = `images/products/${product.folder}/${currentFrame}.webp`;
        };
    } else {
        spinImage.src = product.img;
        document.getElementById('rotate-viewer').onwheel = null; 
    }

    // 重新綁定加入購物車按鈕，確保抓到正確的商品
    document.querySelector('.add-to-cart').onclick = () => {
        addToCart(product);
    };
}

function addToCart(product) {
    const qty = parseInt(document.getElementById('qty-input').value);
    // 使用 ID 檢查購物車是否已有商品
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.qty += qty;
    } else {
        cart.push({ id: product.id, name: product.name, price: product.price, qty: qty });
    }

    // 更新右上角數字
    cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById('cart-count').innerText = cartCount;
    
    alert(`已將 ${qty} 件 ${product.name} 加入購物車！`);
}

// 4. 關閉彈窗
document.querySelector('.close-btn').onclick = () => modal.style.display = "none";
window.onclick = (event) => { if (event.target == modal) modal.style.display = "none"; };

// 監聽數量加減按鈕
document.addEventListener('click', (e) => {
    const qtyInput = document.getElementById('qty-input');
    if (!qtyInput) return;

    if (e.target.id === 'qty-plus') {
        // 加號：數字直接加 1
        qtyInput.value = parseInt(qtyInput.value) + 1;
    } 
    else if (e.target.id === 'qty-minus') {
        // 減號：最低只能到 1
        if (parseInt(qtyInput.value) > 1) {
            qtyInput.value = parseInt(qtyInput.value) - 1;
        }
    }
});

// 修正：當點擊「加入購物車」時，應讀取當前的數量
document.querySelector('.add-to-cart').onclick = () => {
    const qty = parseInt(document.getElementById('qty-input').value);
    cartCount += qty; // 將選擇的數量加進購物車總數
    document.getElementById('cart-count').innerText = cartCount;
    alert(`已將 ${qty} 件商品加入購物車！`);
};

// 修正：每次點開彈窗時，將數量重置為 1
// 請在你的 openModal(product) 函式最後面加入這一行：
// document.getElementById('qty-input').value = 1;

// 5. 購物車與結帳邏輯

document.querySelector('.add-to-cart').onclick = () => {
    const qty = parseInt(document.getElementById('qty-input').value);
    const productName = document.getElementById('modal-title').innerText;
    const priceText = document.querySelector('.price').innerText.replace('$', '').replace(',', '');
    const price = parseInt(priceText);

    // 檢查購物車是否已有同商品
    const existingItem = cart.find(item => item.name === productName);
    if (existingItem) {
        existingItem.qty += qty;
    } else {
        cart.push({ name: productName, price: price, qty: qty });
    }

    // 更新右上角總數圖示
    cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById('cart-count').innerText = cartCount;
    
    alert(`已將 ${qty} 件 ${productName} 加入購物車！`);
};
// 3. 點擊右上角購物車圖示時，渲染清單
document.getElementById('cart-btn').onclick = () => {
    renderCart();
    document.getElementById('checkout-modal').style.display = "block";
};

function renderCart() {
    const listElement = document.getElementById('cart-items-list');
    const totalElement = document.getElementById('cart-total-price');
    listElement.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        listElement.innerHTML = "<li style='text-align:center; padding:20px;'>購物車空空的...</li>";
    } else {
        cart.forEach((item, index) => {
            const li = document.createElement('li');
            li.style.display = "flex";
            li.style.justifyContent = "space-between";
            li.style.alignItems = "center";
            li.style.padding = "10px 0";
            li.style.borderBottom = "1px solid #f4f4f4";
            
            // 加入商品資訊與刪除按鈕
            li.innerHTML = `
                <div style="flex: 1;">
                    <strong>${item.name}</strong> <br>
                    <small>數量：${item.qty}</small>
                </div>
                <div style="margin-right: 15px;">$${(item.price * item.qty).toLocaleString()}</div>
                <button onclick="removeFromCart(${index})" style="background:none; border:none; cursor:pointer; font-size:1.2rem; color:#ff4d4d;">🗑️</button>
            `;
            listElement.appendChild(li);
            total += item.price * item.qty;
        });
    }
    totalElement.innerText = total.toLocaleString();
}

// 新增：刪除單一品項的函式
window.removeFromCart = function(index) {
    // 從陣列中移除該索引的商品
    cart.splice(index, 1);
    
    // 更新右上角的購物車總數量
    cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById('cart-count').innerText = cartCount;
    
    // 重新繪製購物車清單
    renderCart();
};

// 4. 修改結帳表單送出邏輯（清空購物車）
document.getElementById('checkout-form').onsubmit = (e) => {
    e.preventDefault();
    if (!currentUser) {
        alert("請先登入會員才能結帳！");
        return;
    }
    if (cart.length === 0) {
        alert("購物車是空的喔！");
        return;
    }

    const totalAmount = document.getElementById('cart-total-price').innerText;
    const newOrder = {
        date: new Date().toLocaleDateString(),
        total: totalAmount
    };
    
    currentUser.history.push(newOrder);
    localStorage.setItem(currentUser.email, JSON.stringify(currentUser));
    
    alert("訂單已成立！");
    cart = []; // 清空購物車
    cartCount = 0;
    document.getElementById('cart-count').innerText = cartCount;
    document.getElementById('checkout-modal').style.display = "none";
};

// --- 會員系統邏輯 ---
let isRegistered = false; // 切換登入或註冊模式
let currentUser = JSON.parse(localStorage.getItem('currentUser'));

const memberModal = document.getElementById('member-modal');
const authForm = document.getElementById('auth-form');

// 開啟會員彈窗
document.getElementById('member-btn').onclick = () => {
    memberModal.style.display = "block";
    updateMemberUI();
};

// 關閉會員彈窗
document.querySelector('.close-member').onclick = () => memberModal.style.display = "none";

// 切換 登入/註冊 模式
document.getElementById('switch-auth').onclick = (e) => {
    e.preventDefault();
    isRegistered = !isRegistered;
    document.getElementById('auth-title').innerText = isRegistered ? "註冊新帳號" : "會員登入";
    document.getElementById('auth-submit').innerText = isRegistered ? "註冊" : "登入";
    document.getElementById('switch-auth').innerText = isRegistered ? "已有帳號？點此登入" : "還沒有帳號？點此註冊";
};

// 處理表單送出
authForm.onsubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById('user-email').value;
    
    if (isRegistered) {
        // 註冊邏輯：存入 localStorage
        const userData = { email: email, history: [] };
        localStorage.setItem(email, JSON.stringify(userData));
        alert("註冊成功！請登入");
        isRegistered = false;
        updateMemberUI();
    } else {
        // 登入邏輯
        const savedUser = localStorage.getItem(email);
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            alert("登入成功！");
            updateMemberUI();
        } else {
            alert("帳號不存在，請先註冊");
        }
    }
};

// 更新介面顯示
function updateMemberUI() {
    const authSection = document.getElementById('auth-section');
    const userSection = document.getElementById('user-section');
    
    if (currentUser) {
        authSection.style.display = "none";
        userSection.style.display = "block";
        document.getElementById('display-user').innerText = currentUser.email;
        renderHistory();
    } else {
        authSection.style.display = "block";
        userSection.style.display = "none";
    }
}

// 渲染購買紀錄
function renderHistory() {
    const historyList = document.getElementById('purchase-history');
    historyList.innerHTML = currentUser.history.length === 0 ? "<li>目前尚無購買紀錄</li>" : "";
    
    currentUser.history.forEach(item => {
        const li = document.createElement('li');
        li.style.padding = "10px";
        li.style.borderBottom = "1px solid #eee";
        li.innerHTML = `<span>📅 ${item.date}</span> - <span>💰 $${item.total}</span>`;
        historyList.appendChild(li);
    });
}

// 登出
document.getElementById('logout-btn').onclick = () => {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateMemberUI();
};

// 修改結帳表單送出邏輯
document.getElementById('checkout-form').onsubmit = (e) => {
    e.preventDefault();
    if (!currentUser) {
        alert("請先登入會員才能結帳！");
        return;
    }
    if (cart.length === 0) return alert("購物車是空的！");

    // 動態計算當前購物車總額
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    
    const newOrder = {
        date: new Date().toLocaleDateString(),
        total: totalAmount.toLocaleString() // 修正：這裡會顯示正確金額
    };
    
    currentUser.history.push(newOrder);
    localStorage.setItem(currentUser.email, JSON.stringify(currentUser));
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    alert(`訂單已成立！總計 $${newOrder.total}`);
    cart = [];
    cartCount = 0;
    document.getElementById('cart-count').innerText = cartCount;
    document.getElementById('checkout-modal').style.display = "none";
};

// 啟動渲染
renderProducts();