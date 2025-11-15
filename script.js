// تعريف أنواع الحيوانات لكل صنف
const animalTypesMapping = {
    "أغنام": ["حري", "نعيمي", "نجدي"],
    "أبقار": ["بلدي", "هولشتاين", "ساحلي"],
    "ماعز": ["شامي", "سعادي", "حيسي"],
    "خراف": ["نعيمي", "دهبي", "عواسي"],
    "جمال": ["مجاهيم", "شعل", "وضح"]
};

let selectedId = null;

// عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تعيين تاريخ اليوم كتاريخ شراء افتراضي
    document.getElementById('purchaseDate').valueAsDate = new Date();

    // ملء أيام الشهر (1-31)
    const dayMonthSelect = document.getElementById('dayMonth');
    for (let i = 1; i <= 31; i++) {
        let option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        dayMonthSelect.appendChild(option);
    }

    // التوصيلات للأحداث
    document.getElementById('animalType').addEventListener('change', updateAnimalTypes);
    document.getElementById('unitPrice').addEventListener('input', calculateTotalCost);
    document.getElementById('maleQty').addEventListener('input', calculateTotalCost);
    document.getElementById('femaleQty').addEventListener('input', calculateTotalCost);
    document.getElementById('maleQty').addEventListener('input', updateTotalQuantity);
    document.getElementById('femaleQty').addEventListener('input', updateTotalQuantity);

    // التهيئة الأولية
    updateAnimalTypes();
    setAutoBarnNumber();
    updateStatistics();
    loadData();
});

// دالة تحديث أنواع الحيوانات بناءً على الصنف المختار
function updateAnimalTypes() {
    const selectedAnimal = document.getElementById('animalType').value;
    const genderSelect = document.getElementById('gender');
    const currentType = genderSelect.value;

    // مسح القائمة الحالية
    genderSelect.innerHTML = '';

    // إضافة الأنواع المناسبة للصنف المختار
    if (animalTypesMapping[selectedAnimal]) {
        animalTypesMapping[selectedAnimal].forEach(type => {
            let option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            genderSelect.appendChild(option);
        });
    }

    // محاولة استعادة القيمة المختارة سابقاً إذا كانت متاحة
    if (currentType && Array.from(genderSelect.options).some(opt => opt.value === currentType)) {
        genderSelect.value = currentType;
    }
}

// دالة الترقيم التلقائي
function setAutoBarnNumber() {
    const nextNumber = getNextBarnNumber();
    document.getElementById('barnNumber').value = nextNumber;

    // تعيين آخر حظيرة مستخدمة
    const lastBarn = getLastBarnUsed();
    document.getElementById('lastBarnUsed').value = lastBarn ? lastBarn : "لا توجد";
}

// الحصول على آخر رقم حظيرة وإنشاء الرقم التالي
function getNextBarnNumber() {
    const barns = getBarns();
    if (barns.length > 0) {
        const lastBarn = barns[barns.length - 1];
        return (parseInt(lastBarn.رقم_الحظيرة) + 1).toString();
    }
    return "1";
}

// الحصول على آخر حظيرة مستخدمة
function getLastBarnUsed() {
    const barns = getBarns();
    if (barns.length > 0) {
        return barns[barns.length - 1].اسم_الحظيرة;
    }
    return "";
}

// دالة تحديث الكميات الإجمالية
function updateTotalQuantity() {
    const maleQty = parseInt(document.getElementById('maleQty').value) || 0;
    const femaleQty = parseInt(document.getElementById('femaleQty').value) || 0;
    const totalAnimals = maleQty + femaleQty;

    // تحديث حقل الاستيعاب تلقائياً إذا كان فارغاً أو 0
    const capacity = document.getElementById('capacity');
    const currentCapacity = parseInt(capacity.value) || 0;
    if (currentCapacity === 0 || currentCapacity < totalAnimals) {
        capacity.value = totalAnimals;
    }
}

// دالة الحساب التلقائي للإجمالي
function calculateTotalCost() {
    const unitPrice = parseInt(document.getElementById('unitPrice').value) || 0;
    const maleQty = parseInt(document.getElementById('maleQty').value) || 0;
    const femaleQty = parseInt(document.getElementById('femaleQty').value) || 0;
    const total = unitPrice * (maleQty + femaleQty);
    document.getElementById('totalCost').value = total;
}

// دالة تحديث الإحصائيات
function updateStatistics() {
    const barns = getBarns();
    const totalBarns = barns.length;
    const totalAnimals = barns.reduce((sum, barn) => sum + (barn.كمية_ذكور + barn.كمية_إناث), 0);

    document.getElementById('totalBarns').textContent = `عدد الحظائر: ${totalBarns}`;
    document.getElementById('totalAnimals').textContent = `إجمالي الحيوانات: ${totalAnimals}`;
}

// دالة الرجوع
function goBack() {
    // يمكن تعديل هذه الدالة حسب الحاجة (مثلاً: الرجوع للصفحة الرئيسية)
    alert("وظيفة الرجوع - يمكن ربطها بالصفحة الرئيسية");
}

// دوال localStorage (بديل قاعدة البيانات)
function getBarns() {
    const barns = localStorage.getItem('barns');
    return barns ? JSON.parse(barns) : [];
}

function saveBarns(barns) {
    localStorage.setItem('barns', JSON.stringify(barns));
}

// دوال العمليات
function clearFields() {
    document.getElementById('barnName').value = '';
    document.getElementById('purchaseDate').valueAsDate = new Date();
    document.getElementById('capacity').value = '';
    document.getElementById('animalType').selectedIndex = 0;
    document.getElementById('dayMonth').selectedIndex = 0;
    document.getElementById('gender').selectedIndex = 0;
    document.getElementById('location').value = '';
    document.getElementById('totalPrice').value = '';
    document.getElementById('maleQty').value = '';
    document.getElementById('femaleQty').value = '';
    document.getElementById('unitPrice').value = '';
    document.getElementById('totalCost').value = '';

    selectedId = null;
    setAutoBarnNumber();
}

function saveBarn() {
    const barnName = document.getElementById('barnName').value.trim();
    if (!barnName) {
        alert("يرجى إدخال اسم الحظيرة.");
        return;
    }

    const maleQty = parseInt(document.getElementById('maleQty').value) || 0;
    const femaleQty = parseInt(document.getElementById('femaleQty').value) || 0;
    if (maleQty === 0 && femaleQty === 0) {
        alert("يرجى إدخال عدد الذكور أو الإناث.");
        return;
    }

    const barn = {
        رقم_الحظيرة: document.getElementById('barnNumber').value,
        الحظيرة_المستخدمة_أخيرا: document.getElementById('lastBarnUsed').value,
        اسم_الحظيرة: barnName,
        تاريخ_الشراء: document.getElementById('purchaseDate').value,
        الاستيعاب: parseInt(document.getElementById('capacity').value) || 0,
        الصنف: document.getElementById('animalType').value,
        اليوم_الشهر: parseInt(document.getElementById('dayMonth').value),
        النوع: document.getElementById('gender').value,
        الموقع: document.getElementById('location').value,
        إجمالي_السعر: parseInt(document.getElementById('totalPrice').value) || 0,
        كمية_ذكور: maleQty,
        كمية_إناث: femaleQty,
        السعر_الفردي: parseInt(document.getElementById('unitPrice').value) || 0,
        الإجمالي: parseInt(document.getElementById('totalCost').value) || 0
    };

    let barns = getBarns();
    if (selectedId) {
        // تحديث الحظيرة الموجودة
        barns = barns.map(b => b.id === selectedId ? { ...barn, id: selectedId } : b);
        alert("تم تحديث الحظيرة بنجاح!");
    } else {
        // إضافة حظيرة جديدة
        barn.id = Date.now().toString(); // استخدام الطابع الزمني كمعرف فريد
        barns.push(barn);
        alert("تم إضافة الحظيرة بنجاح!");
    }

    saveBarns(barns);
    clearFields();
    loadData();
    updateStatistics();
}

function deleteBarn() {
    if (!selectedId) {
        alert("يرجى اختيار حظيرة أولاً.");
        return;
    }

    if (confirm("هل تريد حذف الحظيرة؟")) {
        let barns = getBarns();
        barns = barns.filter(b => b.id !== selectedId);
        saveBarns(barns);
        alert("تم حذف الحظيرة!");
        clearFields();
        loadData();
        updateStatistics();
    }
}

function loadData() {
    const barns = getBarns();
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    barns.forEach(barn => {
        const row = tableBody.insertRow();
        row.onclick = () => loadSelectedRow(barn);

        row.insertCell(0).textContent = barn.رقم_الحظيرة;
        row.insertCell(1).textContent = barn.الحظيرة_المستخدمة_أخيرا;
        row.insertCell(2).textContent = barn.اسم_الحظيرة;
        row.insertCell(3).textContent = barn.تاريخ_الشراء;
        row.insertCell(4).textContent = barn.الاستيعاب;
        row.insertCell(5).textContent = barn.الصنف;
        row.insertCell(6).textContent = barn.اليوم_الشهر;
        row.insertCell(7).textContent = barn.النوع;
        row.insertCell(8).textContent = barn.الموقع;
        row.insertCell(9).textContent = barn.إجمالي_السعر;
        row.insertCell(10).textContent = barn.كمية_ذكور;
        row.insertCell(11).textContent = barn.كمية_إناث;
        row.insertCell(12).textContent = barn.السعر_الفردي;
        row.insertCell(13).textContent = barn.الإجمالي;
    });
}

function loadSelectedRow(barn) {
    selectedId = barn.id;
    document.getElementById('barnNumber').value = barn.رقم_الحظيرة;
    document.getElementById('lastBarnUsed').value = barn.الحظيرة_المستخدمة_أخيرا;
    document.getElementById('barnName').value = barn.اسم_الحظيرة;
    document.getElementById('purchaseDate').value = barn.تاريخ_الشراء;
    document.getElementById('capacity').value = barn.الاستيعاب;
    document.getElementById('animalType').value = barn.الصنف;
    document.getElementById('dayMonth').value = barn.اليوم_الشهر;
    document.getElementById('gender').value = barn.النوع;
    document.getElementById('location').value = barn.الموقع;
    document.getElementById('totalPrice').value = barn.إجمالي_السعر;
    document.getElementById('maleQty').value = barn.كمية_ذكور;
    document.getElementById('femaleQty').value = barn.كمية_إناث;
    document.getElementById('unitPrice').value = barn.السعر_الفردي;
    document.getElementById('totalCost').value = barn.الإجمالي;
}