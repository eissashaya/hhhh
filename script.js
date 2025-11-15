// تعريف أنواع الحيوانات لكل صنف
const animalTypesMapping = {
    "أغنام": ["حري", "نعيمي", "نجدي"],
    "أبقار": ["بلدي", "هولشتاين", "ساحلي"],
    "ماعز": ["شامي", "سعادي", "حيسي"],
    "خراف": ["نعيمي", "دهبي", "عواسي"],
    "جمال": ["مجاهيم", "شعل", "وضح"]
};

let selectedId = null;
let barns = [];

// دالة تحويل التاريخ الميلادي إلى هجري
function convertToHijri(gregorianDate) {
    try {
        const date = new Date(gregorianDate);
        const hijriDate = new HijriDate(date);
        return hijriDate.toString('yyyy/mm/dd');
    } catch (error) {
        console.error('خطأ في تحويل التاريخ:', error);
        return '---/--/--';
    }
}

// دالة تحويل التاريخ الهجري إلى ميلادي
function convertToGregorian(hijriDateStr) {
    try {
        const [year, month, day] = hijriDateStr.split('/').map(Number);
        const hijriDate = new HijriDate(year, month - 1, day);
        return hijriDate.toGregorian().toISOString().split('T')[0];
    } catch (error) {
        console.error('خطأ في تحويل التاريخ:', error);
        return new Date().toISOString().split('T')[0];
    }
}

// دالة تحديث التاريخ الهجري تلقائياً عند تغيير الميلادي
function updateHijriDate() {
    const gregorianDate = document.getElementById('purchaseDate').value;
    if (gregorianDate) {
        const hijriDate = convertToHijri(gregorianDate);
        document.getElementById('purchaseDateHijri').value = hijriDate;
    }
}

// دالة تحديث اليوم والشهر تلقائياً
function updateDayMonth() {
    const gregorianDate = document.getElementById('purchaseDate').value;
    if (gregorianDate) {
        const date = new Date(gregorianDate);
        const day = date.getDate();
        document.getElementById('dayMonth').value = day;
    }
}

// عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تعيين تاريخ اليوم كتاريخ شراء افتراضي
    const today = new Date();
    const todayFormatted = today.toISOString().split('T')[0];
    document.getElementById('purchaseDate').value = todayFormatted;
    
    // تحديث التاريخ الهجري واليوم تلقائياً
    updateHijriDate();
    updateDayMonth();

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
    document.getElementById('purchaseDate').addEventListener('change', function() {
        updateHijriDate();
        updateDayMonth();
    });
    
    // أحداث الحسابات التلقائية
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
}

// الحصول على آخر رقم حظيرة وإنشاء الرقم التالي
function getNextBarnNumber() {
    if (barns.length > 0) {
        const lastBarn = barns[barns.length - 1];
        return (parseInt(lastBarn.رقم_الحظيرة) + 1).toString();
    }
    return "1";
}

// دالة تحديث الكميات الإجمالية
function updateTotalQuantity() {
    const maleQty = parseInt(document.getElementById('maleQty').value) || 0;
    const femaleQty = parseInt(document.getElementById('femaleQty').value) || 0;
    const totalAnimals = maleQty + femaleQty;
    document.getElementById('totalQuantity').value = totalAnimals;
}

// دالة الحساب التلقائي للإجمالي
function calculateTotalCost() {
    const unitPrice = parseInt(document.getElementById('unitPrice').value) || 0;
    const maleQty = parseInt(document.getElementById('maleQty').value) || 0;
    const femaleQty = parseInt(document.getElementById('femaleQty').value) || 0;
    const totalAnimals = maleQty + femaleQty;
    const total = unitPrice * totalAnimals;
    document.getElementById('totalCost').value = total;
    
    // تحديث المجموع أيضاً
    document.getElementById('totalQuantity').value = totalAnimals;
}

// دالة تحديث الإحصائيات
function updateStatistics() {
    const totalBarns = barns.length;
    const totalAnimals = barns.reduce((sum, barn) => sum + (parseInt(barn.المجموع) || 0), 0);

    document.getElementById('totalBarns').textContent = `عدد الحظائر: ${totalBarns}`;
    document.getElementById('totalAnimals').textContent = `إجمالي الحيوانات: ${totalAnimals}`;
}

// دالة الرجوع
function goBack() {
    if (confirm("هل تريد الرجوع إلى الصفحة الرئيسية؟")) {
        // يمكن تعديل هذه الدالة حسب الحاجة (مثلاً: الرجوع للصفحة الرئيسية)
        window.location.href = "index.html";
    }
}

// دوال localStorage (بديل قاعدة البيانات)
function getBarnsFromStorage() {
    const barnsData = localStorage.getItem('barns');
    return barnsData ? JSON.parse(barnsData) : [];
}

function saveBarnsToStorage(barnsData) {
    localStorage.setItem('barns', JSON.stringify(barnsData));
}

// دوال العمليات
function clearFields() {
    document.getElementById('barnNumber').value = '';
    document.getElementById('barnName').value = '';
    
    // تعيين تاريخ اليوم
    const today = new Date();
    const todayFormatted = today.toISOString().split('T')[0];
    document.getElementById('purchaseDate').value = todayFormatted;
    updateHijriDate();
    updateDayMonth();
    
    document.getElementById('animalType').selectedIndex = 0;
    document.getElementById('gender').selectedIndex = 0;
    document.getElementById('maleQty').value = '0';
    document.getElementById('femaleQty').value = '0';
    document.getElementById('totalQuantity').value = '0';
    document.getElementById('dayMonth').selectedIndex = 0;
    document.getElementById('location').value = '';
    document.getElementById('totalPrice').value = '0';
    document.getElementById('unitPrice').value = '0';
    document.getElementById('totalCost').value = '0';

    selectedId = null;
    setAutoBarnNumber();
    
    // إزالة التحديد من الجدول
    const selectedRows = document.querySelectorAll('#tableBody tr.selected');
    selectedRows.forEach(row => row.classList.remove('selected'));
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
        اسم_الحظيرة: barnName,
        تاريخ_الشراء: document.getElementById('purchaseDate').value,
        تاريخ_الشراء_هجري: document.getElementById('purchaseDateHijri').value,
        الصنف: document.getElementById('animalType').value,
        النوع: document.getElementById('gender').value,
        كمية_ذكور: maleQty,
        كمية_إناث: femaleQty,
        المجموع: parseInt(document.getElementById('totalQuantity').value) || 0,
        اليوم_الشهر: parseInt(document.getElementById('dayMonth').value),
        الموقع: document.getElementById('location').value,
        إجمالي_السعر: parseInt(document.getElementById('totalPrice').value) || 0,
        السعر_الفردي: parseInt(document.getElementById('unitPrice').value) || 0,
        الإجمالي: parseInt(document.getElementById('totalCost').value) || 0
    };

    barns = getBarnsFromStorage();
    
    if (selectedId) {
        // تحديث الحظيرة الموجودة
        barns = barns.map(b => b.id === selectedId ? { ...barn, id: selectedId } : b);
        alert("تم تحديث الحظيرة بنجاح!");
    } else {
        // إضافة حظيرة جديدة
        barn.id = Date.now().toString();
        barns.push(barn);
        alert("تم إضافة الحظيرة بنجاح!");
    }

    saveBarnsToStorage(barns);
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
        barns = getBarnsFromStorage();
        barns = barns.filter(b => b.id !== selectedId);
        saveBarnsToStorage(barns);
        alert("تم حذف الحظيرة!");
        clearFields();
        loadData();
        updateStatistics();
    }
}

function loadData() {
    barns = getBarnsFromStorage();
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    barns.forEach(barn => {
        const row = tableBody.insertRow();
        row.dataset.id = barn.id;
        
        // إضافة حدث النقر لتحميل البيانات في الحقول
        row.onclick = function() {
            // إزالة التحديد من جميع الصفوف
            const allRows = document.querySelectorAll('#tableBody tr');
            allRows.forEach(r => r.classList.remove('selected'));
            
            // تحديد الصف الحالي
            this.classList.add('selected');
            
            // تحميل البيانات في الحقول
            loadSelectedRow(barn);
        };

        // إضافة البيانات إلى الصف
        const fields = [
            barn.رقم_الحظيرة,
            barn.اسم_الحظيرة,
            barn.تاريخ_الشراء,
            barn.تاريخ_الشراء_هجري,
            barn.الصنف,
            barn.النوع,
            barn.كمية_ذكور,
            barn.كمية_إناث,
            barn.المجموع,
            barn.اليوم_الشهر,
            barn.الموقع,
            barn.السعر_الفردي,
            barn.إجمالي_السعر,
            barn.الإجمالي
        ];
        
        fields.forEach(field => {
            const cell = row.insertCell();
            cell.textContent = field;
        });
    });
    
    updateStatistics();
}

function loadSelectedRow(barn) {
    selectedId = barn.id;
    document.getElementById('barnNumber').value = barn.رقم_الحظيرة;
    document.getElementById('barnName').value = barn.اسم_الحظيرة;
    document.getElementById('purchaseDate').value = barn.تاريخ_الشراء;
    document.getElementById('purchaseDateHijri').value = barn.تاريخ_الشراء_هجري;
    document.getElementById('animalType').value = barn.الصنف;
    document.getElementById('gender').value = barn.النوع;
    document.getElementById('maleQty').value = barn.كمية_ذكور;
    document.getElementById('femaleQty').value = barn.كمية_إناث;
    document.getElementById('totalQuantity').value = barn.المجموع;
    document.getElementById('dayMonth').value = barn.اليوم_الشهر;
    document.getElementById('location').value = barn.الموقع;
    document.getElementById('totalPrice').value = barn.إجمالي_السعر;
    document.getElementById('unitPrice').value = barn.السعر_الفردي;
    document.getElementById('totalCost').value = barn.الإجمالي;
}