let order = order || [];
let totalPrice = 0;
let deliveryFee = 0;

function toggleSection(sectionId) {
    // الحصول على جميع الأقسام
    const sections = document.querySelectorAll('.section > div');

    // إخفاء محتويات كل الأقسام الأخرى
    sections.forEach(section => {
        const content = section.querySelector('.menu-content');
        if (content && section.id !== sectionId) {
            content.style.display = 'none';
        }
    });

    // عرض أو إخفاء محتويات القسم المطلوب
    const selectedSection = document.getElementById(sectionId);
    const selectedContent = selectedSection.querySelector('.menu-content');
    if (selectedContent) {
        selectedContent.style.display = selectedContent.style.display === 'none' ? 'block' : 'none';
    }
}



function toggleSubMenu(subMenuId) {
    // إغلاق جميع القوائم المفتوحة
    const allSubMenus = document.querySelectorAll('.submenu');
    allSubMenus.forEach(subMenu => {
        if (subMenu.id !== subMenuId) {
            subMenu.style.display = 'none';
        }
    });

    // فتح أو إغلاق القائمة المطلوبة
    const subMenu = document.getElementById(subMenuId);
    subMenu.style.display = subMenu.style.display === 'none' ? 'block' : 'none';
}


function addToOrder(item, price, noteId) {
    const note = document.getElementById(noteId).value;
    order.push({ item, price, note });
    totalPrice += price;
    updateOrderSummary();
}

function updateOrderSummary() {
    const orderList = document.getElementById('order-list');
    const totalPriceElement = document.getElementById('total-price');

    orderList.innerHTML = '';
    order.forEach((orderItem, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${orderItem.item} - ${orderItem.price} جنيه - ملاحظات: ${orderItem.note || 'لا توجد'}`;
        const removeButton = document.createElement('button');
        removeButton.textContent = 'حذف';
        removeButton.style.marginLeft = '10px';
        removeButton.onclick = () => removeFromOrder(index);
        listItem.appendChild(removeButton);
        orderList.appendChild(listItem);
    });

    totalPriceElement.textContent = `الإجمالي: ${totalPrice + 2 + deliveryFee} جنيه`;
}

function removeFromOrder(index) {
    totalPrice -= order[index].price;
    order.splice(index, 1);
    updateOrderSummary();
}

function handleOrderTypeChange() {
    const orderType = document.getElementById('order-type').value;
    const reservationInfo = document.getElementById('reservation-info');
    const deliveryInfo = document.getElementById('delivery-info');
    const deliveryFeeElement = document.getElementById('delivery-fee');

    if (orderType === 'حجز') {
        reservationInfo.style.display = 'block';
        deliveryInfo.style.display = 'none';
        deliveryFeeElement.style.display = 'none';
        deliveryFee = 0;
    } else if (orderType === 'توصيل') {
        reservationInfo.style.display = 'none';
        deliveryInfo.style.display = 'block';
        deliveryFeeElement.style.display = 'block';
    } else {
        reservationInfo.style.display = 'none';
        deliveryInfo.style.display = 'none';
        deliveryFeeElement.style.display = 'none';
        deliveryFee = 0;
    }
    updateOrderSummary();
}

function updateDeliveryFee() {
    const deliveryArea = document.getElementById('delivery-area').value;
    deliveryFee = parseInt(deliveryArea) || 0;
    document.getElementById('delivery-fee').textContent = `رسوم التوصيل: ${deliveryFee} جنيه`;
    updateOrderSummary();
}




// تأكد أن هناك طلبات محفوظة
function hasUnsavedOrder() {
    return order.length > 0; // إذا كان هناك طلبات في القائمة
}

window.addEventListener('beforeunload', function (event) {
    if (hasUnsavedOrder()) {
        // عرض رسالة تأكيد مخصصة
        const confirmationMessage = 'لديك طلبات محفوظة لم يتم تأكيدها. هل تريد بالتأكيد اعادة تحميل الصفحة ؟';
      
        event.returnValue = confirmationMessage; // يعمل فقط لتفعيل رسالة المتصفح الافتراضية
    }
});



function confirmOrder() {
    const branch = document.getElementById('branch').value;
    const orderType = document.getElementById('order-type').value;

    if (!branch) {
        alert('يرجى اختيار الفرع قبل تأكيد الطلب.');
        return;
    }

    if (!orderType) { // تم تصحيح الخطأ هنا
        alert('يرجى اختيار نوع الطلب قبل تأكيد الأوردر.');
        return;
    }

    if (order.length === 0) {
        alert('يرجى اختيار عناصر قبل تأكيد الطلب.');
        return;
    }

    let orderDetails = order.map(item => `${item.item} - ${item.price} جنيه - ملاحظات: ${item.note || 'لا توجد'}`).join('%0A');
    let additionalInfo = '';

    if (orderType === 'حجز') {
        const customerName = document.getElementById('customer-name').value;
        const phoneNumber = document.getElementById('phone-number').value;
        if (!customerName || !phoneNumber) {
            alert('يرجى إدخال الاسم ورقم الهاتف للحجز.');
            return;
        }
        additionalInfo = `الاسم: ${customerName}%0Aرقم الهاتف: ${phoneNumber}`;
    } else if (orderType === 'توصيل') {
        const fullName = document.getElementById('full-name').value;
        const address = document.getElementById('address').value;
        const primaryPhone = document.getElementById('primary-phone').value;
        const secondaryPhone = document.getElementById('secondary-phone').value;
        if (!fullName || !address || !primaryPhone) {
            alert('يرجى إدخال الاسم والعنوان ورقم الهاتف للتوصيل.');
            return;
        }
        additionalInfo = `الاسم: ${fullName}%0Aالعنوان: ${address}%0Aرقم الهاتف: ${primaryPhone}%0Aرقم هاتف ثاني: ${secondaryPhone || 'لا يوجد'}`;
    }

    const totalOrderPrice = totalPrice + 2 + deliveryFee;
    const whatsappUrl = `https://wa.me/${branch}?text=نوع الطلب: ${orderType}%0A${additionalInfo}%0Aالطلب:%0A${orderDetails}%0Aالإجمالي: ${totalOrderPrice} جنيه%0A`;

    window.open(whatsappUrl, '_blank');
}
