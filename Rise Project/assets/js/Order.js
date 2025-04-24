
document.addEventListener('DOMContentLoaded', function() {
  const buttons = document.querySelectorAll(".product-item button");
  const cartIcon = document.querySelector(".cart-icon");
  const cartPreview = document.querySelector(".cart-preview");
  const countElement = document.querySelector('.count');
  const notification = document.getElementById('notification');
  const checkoutBtn = document.querySelector('.checkout-btn');
  const menuLinks = document.querySelectorAll('.menu-link');
  const mainContent = document.getElementById('main-content');
  const contactPage = document.getElementById('contact-page');
  const contactForm = document.getElementById('contactForm');
  const productModal = document.getElementById('product-modal');
  const closeModal = document.querySelector('.close-modal');
  const modalAddToCart = document.getElementById('modal-add-to-cart');
  const checkoutModal = document.getElementById('checkout-modal');
  
  // Dữ liệu sản phẩm chi tiết
  const productDetails = {
    1: {
      name: "Kim Cương Vàng Xanh",
      price: "1.100.000.000đ",
      image: "1.png",
      description: "Kim cương vàng xanh tự nhiên với độ tinh khiết cao, phù hợp làm trang sức cao cấp.",
      specs: {
        type: "Kim cương tự nhiên",
        color: "Vàng xanh",
        clarity: "VVS1",
        weight: "1.2 carat",
        size: "6.8mm",
        cert: "GIA"
      }
    },
    2: {
      name: "Kim Cương Trắng Tinh Khiết",
      price: "2.200.000.000đ",
      image: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      description: "Kim cương trắng tinh khiết với độ lấp lánh hoàn hảo, đẳng cấp quốc tế.",
      specs: {
        type: "Kim cương tự nhiên",
        color: "Trắng",
        clarity: "IF",
        weight: "1.5 carat",
        size: "7.2mm",
        cert: "GIA"
      }
    }
  };
  
  // Dữ liệu quận/huyện theo thành phố
  const districts = {
    hanoi: [
      "Ba Đình",
      "Hoàn Kiếm",
      "Hai Bà Trưng",
      "Đống Đa",
      "Tây Hồ",
      "Cầu Giấy",
      "Thanh Xuân",
      "Hoàng Mai",
      "Long Biên"
    ],
    hcm: [
      "Quận 1",
      "Quận 3",
      "Quận 4",
      "Quận 5",
      "Quận 6",
      "Quận 7",
      "Quận 8",
      "Quận 10",
      "Quận 11",
      "Quận 12",
      "Gò Vấp",
      "Bình Thạnh",
      "Tân Bình",
      "Tân Phú",
      "Phú Nhuận",
      "Bình Tân"
    ],
    danang: [
      "Hải Châu",
      "Thanh Khê",
      "Sơn Trà",
      "Ngũ Hành Sơn",
      "Liên Chiểu",
      "Cẩm Lệ"
    ],
    haiphong: [
      "Hồng Bàng",
      "Ngô Quyền",
      "Lê Chân",
      "Hải An",
      "Kiến An",
      "Đồ Sơn",
      "Dương Kinh"
    ],
    cantho: [
      "Ninh Kiều",
      "Bình Thủy",
      "Cái Răng",
      "Ô Môn",
      "Thốt Nốt"
    ]
  };

  // ========== HÀM LƯU TRỮ GIỎ HÀNG ==========
  
  // Lưu giỏ hàng vào localStorage
  function saveCartToStorage() {
    const cartItems = [];
    document.querySelectorAll('.cart-item').forEach(item => {
      cartItems.push({
        img: item.querySelector('.cart-item-img').src,
        name: item.querySelector('.cart-item-name').textContent,
        priceText: item.querySelector('.cart-item-price').textContent,
        quantity: item.querySelector('input').value
      });
    });
    localStorage.setItem('cart', JSON.stringify(cartItems));
    localStorage.setItem('cartCount', countElement.textContent);
    localStorage.setItem('cartTotal', document.getElementById('total-price').textContent);
  }

  // Tải giỏ hàng từ localStorage
  function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const cartItems = JSON.parse(savedCart);
      cartItems.forEach(item => {
        addToCart({
          img: item.img,
          name: item.name,
          priceText: item.priceText,
          initialQty: item.quantity
        }, true); // Tham số true để biết đang load từ storage
      });
    }
    
    // Khôi phục số lượng và tổng tiền
    const savedCount = localStorage.getItem('cartCount');
    if (savedCount) {
      countElement.textContent = savedCount;
    }
    
    const savedTotal = localStorage.getItem('cartTotal');
    if (savedTotal) {
      document.getElementById('total-price').textContent = savedTotal;
    }
  }

  // Gọi hàm tải giỏ hàng khi trang được tải
  loadCartFromStorage();

  // ========== CÁC HÀM XỬ LÝ GIỎ HÀNG ==========
  
  // Hiển thị/ẩn giỏ hàng khi hover
  cartIcon.addEventListener("mouseenter", function() {
    cartPreview.classList.add('show');
  });
  
  cartPreview.addEventListener("mouseleave", function() {
    cartPreview.classList.remove('show');
  });
  
  // Đóng giỏ hàng khi click ra ngoài
  document.addEventListener("click", function(e) {
    if (!e.target.closest('.cart-dropdown') && !e.target.closest('.cart-item-img-container')) {
      cartPreview.classList.remove('show');
    }
  });

  // Cập nhật tổng tiền
  function updateCartTotal() {
    let total = 0;
    document.querySelectorAll('.cart-item').forEach(item => {
      const priceText = item.querySelector('.cart-item-price').textContent.replace(/[^\d]/g, '');
      const price = parseInt(priceText);
      const qty = parseInt(item.querySelector('input').value);
      if (!isNaN(price) && !isNaN(qty)) {
        total += price * qty;
      }
    });
    
    const formattedTotal = total.toLocaleString('vi-VN') + '$';
    document.getElementById('total-price').textContent = formattedTotal;
    return total;
  }

  // Kiểm tra sản phẩm đã có trong giỏ hàng
  function isProductInCart(productName) {
    const cartItems = document.querySelectorAll('.cart-item-name');
    for (let item of cartItems) {
      if (item.textContent === productName) {
        return true;
      }
    }
    return false;
  }
  
  // Hiển thị thông báo
  function showNotification() {
    notification.classList.add('show');
    setTimeout(() => {
      notification.classList.remove('show');
    }, 2000);
  }
  
  // Cập nhật số lượng sản phẩm
  function updateCartCount(change) {
    let currentCount = parseInt(countElement.textContent) || 0;
    const newCount = currentCount + change;
    countElement.textContent = newCount > 0 ? newCount : 0;
    saveCartToStorage();
  }
  
  // Thêm sản phẩm vào giỏ hàng
  buttons.forEach(function(button) {
    button.addEventListener("click", function(e) {
      e.stopPropagation();
      const product = e.target.closest(".product-item");
      const img = product.querySelector("img").src;
      const name = product.querySelector("h2").innerText;
      const priceText = product.querySelector(".price").innerText;
      
      if (isProductInCart(name)) {
        showNotification();
        return;
      }
      
      addToCart({
        img: img,
        name: name,
        priceText: priceText
      });
      
      cartPreview.classList.add('show');
    });
  });

  // Hàm thêm sản phẩm vào giỏ hàng (có hỗ trợ load từ storage)
  function addToCart(product, isFromStorage = false) {
    const cartBody = document.getElementById("cart-body");
    let existingItem = null;
    
    document.querySelectorAll('.cart-item').forEach(item => {
      if (item.querySelector('.cart-item-name').textContent === product.name) {
        existingItem = item;
      }
    });
    
    if (existingItem) {
      const qtyInput = existingItem.querySelector('input');
      if (isFromStorage) {
        qtyInput.value = product.initialQty || 1;
      } else {
        qtyInput.value = parseInt(qtyInput.value) + 1;
      }
      existingItem.classList.add('item-added');
      setTimeout(() => {
        existingItem.classList.remove('item-added');
      }, 500);
      updateCartTotal();
    } else {
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item item-added';
      cartItem.innerHTML = `
        <div class="cart-item-img-container">
          <img src="${product.img}" class="cart-item-img" alt="${product.name}">
        </div>
        <div class="cart-item-details fonts-cus">
          <div class="cart-item-name">${product.name}</div>
          <div class="cart-item-price">${product.priceText}</div>
          <div class="cart-item-qty">
            <button class="qty-btn qty-minus">-</button>
            <input type="number" value="${product.initialQty || 1}" min="1">
            <button class="qty-btn qty-plus">+</button>
            <span class="cart-item-remove"><i class="fas fa-times"></i></span>
          </div>
        </div>
      `;
      cartBody.appendChild(cartItem);
      
      // Xử lý nút giảm số lượng
      const minusBtn = cartItem.querySelector('.qty-minus');
      minusBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const qtyInput = cartItem.querySelector('input');
        if (parseInt(qtyInput.value) > 1) {
          qtyInput.value = parseInt(qtyInput.value) - 1;
          updateCartTotal();
          saveCartToStorage();
        }
      });
      
      // Xử lý nút tăng số lượng
      const plusBtn = cartItem.querySelector('.qty-plus');
      plusBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const qtyInput = cartItem.querySelector('input');
        qtyInput.value = parseInt(qtyInput.value) + 1;
        updateCartTotal();
        saveCartToStorage();
      });
      
      // Xử lý thay đổi số lượng thủ công
      const qtyInput = cartItem.querySelector('input');
      qtyInput.addEventListener('change', () => {
        if (parseInt(qtyInput.value) < 1) qtyInput.value = 1;
        updateCartTotal();
        saveCartToStorage();
      });
      
      // Xử lý nút xóa sản phẩm
      const removeBtn = cartItem.querySelector('.cart-item-remove');
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        cartItem.classList.add('removing');
        setTimeout(() => {
          cartItem.remove();
          updateCartTotal();
          updateCartCount(-1);
          saveCartToStorage();
        }, 300);
      });
      
      setTimeout(() => {
        cartItem.classList.remove('item-added');
      }, 500);
      
      if (!isFromStorage) {
        updateCartCount(1);
      }
    }
    
    updateCartTotal();
    if (!isFromStorage) {
      saveCartToStorage();
    }
  }
  
  // ========== XỬ LÝ THANH TOÁN ==========
  
  // Mở modal thanh toán
  
  checkoutBtn.addEventListener('click', function() {
    const cartItems = document.querySelectorAll('.cart-item');
    if (cartItems.length === 0) {
      alert('Giỏ hàng của bạn đang trống!');
      return;
    }
    
    checkoutModal.classList.add('active');
    updateCartTotal();
  });
  
  // Các biến cho xử lý thanh toán
  const nextToPaymentBtn = document.getElementById('next-to-payment');
  const backToShippingBtn = document.getElementById('back-to-shipping');
  const completeOrderBtn = document.getElementById('complete-order');
  const cancelCheckoutBtn = document.getElementById('cancel-checkout');
  const continueShoppingBtn = document.getElementById('continue-shopping');
  const citySelect = document.getElementById('city');
  const districtSelect = document.getElementById('district');
  
  // Chuyển đến bước thanh toán
  
  nextToPaymentBtn.addEventListener('click', function() {
    // Kiểm tra form hợp lệ
    const fullname = document.getElementById('fullname').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const district = document.getElementById('district').value;
    
    if (!fullname || !phone || !email || !address || !city || !district) {
      alert('Vui lòng điền đầy đủ thông tin giao hàng');
      return;
    }
    
    // Chuyển sang bước thanh toán
    document.getElementById('shipping-form').classList.remove('active');
    document.getElementById('payment-form').classList.add('active');
    
    // Cập nhật trạng thái bước
    document.querySelector('.step[data-step="1"]').classList.remove('active');
    document.querySelector('.step[data-step="1"]').classList.add('completed');
    document.querySelector('.step[data-step="2"]').classList.add('active');
    
    // Cập nhật tổng tiền trong phần tóm tắt
    const total = updateCartTotal();
    document.getElementById('summary-subtotal').textContent = total.toLocaleString('vi-VN') + '$';
    document.getElementById('summary-total').textContent = total.toLocaleString('vi-VN') + '$';
  });
  
  // Quay lại bước thông tin giao hàng
  backToShippingBtn.addEventListener('click', function() {
    document.getElementById('payment-form').classList.remove('active');
    document.getElementById('shipping-form').classList.add('active');
    
    // Cập nhật trạng thái bước
    document.querySelector('.step[data-step="2"]').classList.remove('active');
    document.querySelector('.step[data-step="1"]').classList.add('active');
    document.querySelector('.step[data-step="1"]').classList.remove('completed');
  });
  
  // Hoàn tất đơn hàng
  completeOrderBtn.addEventListener('click', function() {
    const paymentMethod = document.querySelector('input[name="payment"]:checked');
    if (!paymentMethod) {
      alert('Vui lòng chọn phương thức thanh toán');
      return;
    }
    
    let paymentText = '';
    switch(paymentMethod.value) {
      case 'cod':
        paymentText = 'Thanh toán khi nhận hàng';
        break;
      case 'bank':
        paymentText = 'Chuyển khoản ngân hàng';
        break;
      case 'card':
        paymentText = 'Thẻ tín dụng/ghi nợ';
        break;
    }
    
    // Xóa giỏ hàng khỏi localStorage khi thanh toán thành công
    localStorage.removeItem('cart');
    localStorage.removeItem('cartCount');
    localStorage.removeItem('cartTotal');
    
    // Hiển thị bước hoàn tất
    document.getElementById('payment-form').classList.remove('active');
    document.getElementById('checkout-success').classList.add('active');
    
    // Cập nhật trạng thái bước
    document.querySelector('.step[data-step="2"]').classList.remove('active');
    document.querySelector('.step[data-step="2"]').classList.add('completed');
    document.querySelector('.step[data-step="3"]').classList.add('active');
    
    // Cập nhật thông tin đơn hàng
    const today = new Date();
    const orderDate = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
    const orderId = 'DH' + today.getFullYear() + (today.getMonth() + 1) + today.getDate() + Math.floor(Math.random() * 1000);
    const total = document.getElementById('total-price').textContent;
    
    document.getElementById('order-id').textContent = orderId;
    document.getElementById('order-date').textContent = orderDate;
    document.getElementById('order-payment').textContent = paymentText;
    document.getElementById('order-total').textContent = total;
  });
  
  // Hủy bỏ thanh toán
  cancelCheckoutBtn.addEventListener('click', function() {
    checkoutModal.classList.remove('active');
  });
  
  // Tiếp tục mua sắm sau khi đặt hàng
  continueShoppingBtn.addEventListener('click', function() {
    checkoutModal.classList.remove('active');
    
    // Xóa giỏ hàng
    document.getElementById('cart-body').innerHTML = '';
    countElement.textContent = '0';
    document.getElementById('total-price').textContent = '0$';
    
    // Xóa giỏ hàng khỏi localStorage
    localStorage.removeItem('cart');
    localStorage.removeItem('cartCount');
    localStorage.removeItem('cartTotal');
    
    // Reset các bước thanh toán
    document.getElementById('checkout-success').classList.remove('active');
    document.getElementById('shipping-form').classList.add('active');
    
    document.querySelectorAll('.step').forEach(step => {
      step.classList.remove('active', 'completed');
    });
    
    document.querySelector('.step[data-step="1"]').classList.add('active');
  });

  // ========== XỬ LÝ CHỌN THÀNH PHỐ/QUẬN ==========
  
  // Chọn thành phố để hiển thị quận/huyện tương ứng
  citySelect.addEventListener('change', function() {
    const city = this.value;
    districtSelect.innerHTML = '<option value="">Chọn quận/huyện</option>';
    
    if (city && districts[city]) {
      districts[city].forEach(district => {
        const option = document.createElement('option');
        option.value = district.toLowerCase().replace(/ /g, '-');
        option.textContent = district;
        districtSelect.appendChild(option);
      });
    }
  });

  // ========== XỬ LÝ MODAL SẢN PHẨM ==========
  
  // Mở modal xem chi tiết sản phẩm (nếu có)
  if (productModal) {
    buttons.forEach(button => {
      button.addEventListener('click', function(e) {
        const productId = this.closest('.product-item').dataset.productId;
        if (productId && productDetails[productId]) {
          const product = productDetails[productId];
          productModal.querySelector('.modal-product-name').textContent = product.name;
          productModal.querySelector('.modal-product-price').textContent = product.price;
          productModal.querySelector('.modal-product-image').src = product.image;
          productModal.querySelector('.modal-product-description').textContent = product.description;
          
          // Hiển thị thông số kỹ thuật
          const specsList = productModal.querySelector('.modal-product-specs');
          specsList.innerHTML = '';
          for (const [key, value] of Object.entries(product.specs)) {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${key}:</strong> ${value}`;
            specsList.appendChild(li);
          }
          
          productModal.classList.add('active');
        }
      });
    });
    
    // Đóng modal
    if (closeModal) {
      closeModal.addEventListener('click', function() {
        productModal.classList.remove('active');
      });
    }
    
    // Thêm vào giỏ hàng từ modal
    if (modalAddToCart) {
      modalAddToCart.addEventListener('click', function() {
        const productName = productModal.querySelector('.modal-product-name').textContent;
        const productPrice = productModal.querySelector('.modal-product-price').textContent;
        const productImage = productModal.querySelector('.modal-product-image').src;
        
        if (isProductInCart(productName)) {
          showNotification();
          return;
        }
        
        addToCart({
          img: productImage,
          name: productName,
          priceText: productPrice
        });
        
        productModal.classList.remove('active');
        cartPreview.classList.add('show');
      });
    }
  }
});