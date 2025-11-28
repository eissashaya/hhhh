// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // تعيين التاريخ الميلادي الحالي
    const today = new Date();
    document.getElementById('gregorian-date').valueAsDate = today;
    
    // تحديث التاريخ الهجري واسم اليوم
    updateHijriDate();
    updateDayName();
    
    // تحميل القوائم المرجعية
    loadLookups();
    
    // تعيين رقم الحظيرة التلقائي
    setAutoBarnNumber();
    
    // تحميل البيانات
    loadData();
    
    // إضافة المستمعين للأحداث
    setupEventListeners();
}

function setupEventListeners() {
    // تحديث الإجماليات تلقائياً
    document.getElementById('male-qty').addEventListener('input', updateTotals);
    document.getElementById('female-qty').addEventListener('input', updateTotals);
    document.getElementById('unit-price').addEventListener('input', updateTotals);
    
    // تحديث التاريخ الهجري واسم اليوم عند تغيير التاريخ الميلادي
    document.getElementById('gregorian-date').addEventListener('change', function() {
        updateHijriDate();
        updateDayName();
    });
    
    // تحديث أنواع الحيوانات عند تغيير الصنف
    document.getElementById('animal-type').addEventListener('change', updateAnimalTypes);
    
    // التحقق من السعة
    document.getElementById('male-qty').addEventListener('input', checkCapacity);
    document.getElementById('female-qty').addEventListener('input', checkCapacity);
    document.getElementById('capacity').addEventListener('input', checkCapacity);
    
    // تحديث بيانات الحظيرة عند تغيير الرقم
    document.getElementById('barn-number').addEventListener('change', updateBarnData);
    
    // إضافة عناصر جديدة للقوائم المرجعية
    document.getElementById('animal-type').addEventListener('blur', addNewSpecies);
    document.getElementById('gender').addEventListener('blur', addNewType);
    document.getElementById('location').addEventListener('blur', addNewLocation);
    document.getElementById('supervisor').addEventListener('blur', addNewSupervisor);
}

function loadLookups() {
    // تحميل أرقام الحظائر
    const barnNumberSelect = document.getElementById('barn-number');
    barnNumberSelect.innerHTML = '<option value="">-- اختر رقم الحظيرة --</option>';
    
    for (let i = 1; i <= 20; i++) {
        const option = document.createElement('option');
        option.value = i.toString();
        option.textContent = i.toString();
        barnNumberSelect.appendChild(option);
    }
    
    // تحميل الأصناف
    const animalTypeSelect = document.getElementById('animal-type');
    animalTypeSelect.innerHTML = '<option value="">-- اختر الصنف --</option>';
    appData.species.forEach(species => {
        const option = document.createElement('option');
        option.value = species;
        option.textContent = species;
        animalTypeSelect.appendChild(option);
    });
    
    // تحميل المواقع
    const locationSelect = document.getElementById('location');
    locationSelect.innerHTML = '<option value="">-- اختر الموقع --</option>';
    appData.locations.forEach(location => {
        const option = document.createElement('option');
        option.value = location;
        option.textContent = location;
        locationSelect.appendChild(option);
    });
    
    // تحميل المشرفين
    const supervisorSelect = document.getElementById('supervisor');
    supervisorSelect.innerHTML = '<option value="">-- اختر المشرف --</option>';
    appData.supervisors.forEach(supervisor => {
        const option = document.createElement('option');
        option.value = supervisor;
        option.textContent = supervisor;
        supervisorSelect.appendChild(option);
    });
    
    // تحديث أنواع الحيوانات بناءً على الصنف المحدد
    updateAnimalTypes();
}

function updateAnimalTypes() {
    const selectedAnimal = document.getElementById('animal-type').value;
    const genderSelect = document.getElementById('gender');
    
    genderSelect.innerHTML = '<option value="">-- اختر النوع --</option>';
    
    if (selectedAnimal && appData.types[selectedAnimal]) {
        appData.types[selectedAnimal].forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            genderSelect.appendChild(option);
        });
    }
}

function updateBarnData() {
    const selectedNumber = document.getElementById('barn-number').value;
    
    if (selectedNumber && appData.barnData[selectedNumber]) {
        document.getElementById('barn-name').value = appData.barnData[selectedNumber].name;
        document.getElementById('capacity').value = appData.barnData[selectedNumber].capacity;
        
        const locationSelect = document.getElementById('location');
        const locationIndex = Array.from(locationSelect.options).findIndex(
            option => option.value === appData.barnData[selectedNumber].location
        );
        
        if (locationIndex >= 0) {
            locationSelect.selectedIndex = locationIndex;
        }
    } else if (selectedNumber) {
        // إذا كان الرقم غير موجود في القاموس، نحدد الاستيعاب بناءً على الرقم
        const barnNum = parseInt(selectedNumber);
        const capacityValue = barnNum % 2 === 1 ? 200 : 300;
        document.getElementById('capacity').value = capacityValue;
        document.getElementById('barn-name').value = `الحظيرة ${selectedNumber}`;
        
        // توزيع المواقع تلقائياً
        const locationSelect = document.getElementById('location');
        const locationIndex = barnNum % 5;
        if (locationIndex < locationSelect.options.length) {
            locationSelect.selectedIndex = locationIndex + 1; // +1 بسبب خيار "-- اختر الموقع --"
        }
    }
}

function setAutoBarnNumber() {
    // الحصول على آخر رقم حظيرة وإنشاء الرقم التالي
    let nextNumber = 1;
    if (appData.barns.length > 0) {
        const lastBarn = appData.barns[appData.barns.length - 1];
        nextNumber = parseInt(lastBarn.barnNumber) + 1;
    }
    
    const barnNumberSelect = document.getElementById('barn-number');
    const optionIndex = Array.from(barnNumberSelect.options).findIndex(
        option => option.value === nextNumber.toString()
    );
    
    if (optionIndex >= 0) {
        barnNumberSelect.selectedIndex = optionIndex;
    } else {
        barnNumberSelect.value = nextNumber.toString();
    }
    
    updateBarnData();
}

function updateTotals() {
    const maleQty = parseInt(document.getElementById('male-qty').value) || 0;
    const femaleQty = parseInt(document.getElementById('female-qty').value) || 0;
    const totalQty = maleQty + femaleQty;
    
    document.getElementById('total-qty').value = totalQty;
    
    // حساب إجمالي السعر
    const unitPrice = parseFloat(document.getElementById('unit-price').value) || 0;
    const totalPrice = unitPrice * totalQty;
    
    document.getElementById('total-price').value = totalPrice.toFixed(2);
}

function checkCapacity() {
    const totalAnimals = (parseInt(document.getElementById('male-qty').value) || 0) + 
                        (parseInt(document.getElementById('female-qty').value) || 0);
    const capacity = parseInt(document.getElementById('capacity').value) || 0;
    const alertMessage = document.getElementById('alert-message');
    
    if (capacity > 0 && totalAnimals > capacity) {
        alertMessage.textContent = `⚠️ تنبيه: العدد ${totalAnimals} يتجاوز السعة ${capacity}`;
        alertMessage.classList.remove('hidden');
    } else {
        alertMessage.classList.add('hidden');
    }
}

function updateHijriDate() {
    const gregorianDate = new Date(document.getElementById('gregorian-date').value);
    
    // تحويل التاريخ الميلادي إلى هجري (محاكاة)
    // في التطبيق الحقيقي، يمكن استخدام مكتبة مثل hijri-date
    const hijriDate = convertToHijri(gregorianDate);
    document.getElementById('hijri-date').value = hijriDate;
}

function updateDayName() {
    const gregorianDate = new Date(document.getElementById('gregorian-date').value);
    const dayName = getDayNameArabic(gregorianDate);
    document.getElementById('day-name').value = dayName;
}

function convertToHijri(gregorianDate) {
    // محاكاة للتحويل إلى التاريخ الهجري
    // في التطبيق الحقيقي، يمكن استخدام مكتبة متخصصة
    const year = gregorianDate.getFullYear() - 621;
    const month = (gregorianDate.getMonth() + 1) % 12 || 12;
    const day = gregorianDate.getDate();
    
    return `${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
}

function getDayNameArabic(date) {
    const days = {
        0: "الأحد",
        1: "الاثنين",
        2: "الثلاثاء",
        3: "الأربعاء",
        4: "الخميس",
        5: "الجمعة",
        6: "السببت"
    };
    return days[date.getDay()];
}

// دوال إضافة عناصر جديدة للقوائم المرجعية
function addNewSpecies() {
    const input = document.getElementById('animal-type');
    const value = input.value.trim();
    
    if (value && !appData.species.includes(value)) {
        appData.species.push(value);
        appData.types[value] = [];
        saveData();
        loadLookups();
        input.value = value;
    }
}

function addNewType() {
    const input = document.getElementById('gender');
    const value = input.value.trim();
    const animalType = document.getElementById('animal-type').value;
    
    if (value && animalType && !appData.types[animalType].includes(value)) {
        appData.types[animalType].push(value);
        saveData();
        updateAnimalTypes();
        input.value = value;
    }
}

function addNewLocation() {
    const input = document.getElementById('location');
    const value = input.value.trim();
    
    if (value && !appData.locations.includes(value)) {
        appData.locations.push(value);
        saveData();
        loadLookups();
        input.value = value;
    }
}

function addNewSupervisor() {
    const input = document.getElementById('supervisor');
    const value = input.value.trim();
    
    if (value && !appData.supervisors.includes(value)) {
        appData.supervisors.push(value);
        saveData();
        loadLookups();
        input.value = value;
    }
}

// دوال العمليات الرئيسية
function clearForm() {
    appData.selectedBarnId = null;
    document.getElementById('barn-form').reset();
    setAutoBarnNumber();
    updateHijriDate();
    updateDayName();
    document.getElementById('alert-message').classList.add('hidden');
}

function saveBarn() {
    // التحقق من صحة البيانات
    if (!validateForm()) {
        return;
    }
    
    const barnData = {
        barnNumber: document.getElementById('barn-number').value,
        barnName: document.getElementById('barn-name').value,
        capacity: parseInt(document.getElementById('capacity').value) || 0,
        animalType: document.getElementById('animal-type').value,
        gender: document.getElementById('gender').value,
        location: document.getElementById('location').value,
        maleQty: parseInt(document.getElementById('male-qty').value) || 0,
        femaleQty: parseInt(document.getElementById('female-qty').value) || 0,
        totalQty: parseInt(document.getElementById('total-qty').value) || 0,
        hijriDate: document.getElementById('hijri-date').value,
        gregorianDate: document.getElementById('gregorian-date').value,
        dayName: document.getElementById('day-name').value,
        supervisor: document.getElementById('supervisor').value,
        unitPrice: parseFloat(document.getElementById('unit-price').value) || 0,
        totalPrice: parseFloat(document.getElementById('total-price').value) || 0,
        alert: document.getElementById('alert-message').classList.contains('hidden') ? 0 : 1
    };
    
    if (appData.selectedBarnId !== null) {
        // تحديث حظيرة موجودة
        const index = appData.barns.findIndex(barn => barn.id === appData.selectedBarnId);
        if (index !== -1) {
            barnData.id = appData.selectedBarnId;
            appData.barns[index] = barnData;
        }
    } else {
        // إضافة حظيرة جديدة
        barnData.id = Date.now().toString();
        appData.barns.push(barnData);
    }
    
    saveData();
    loadData();
    clearForm();
    
    alert(appData.selectedBarnId !== null ? "تم تحديث الحظيرة بنجاح!" : "تم إضافة الحظيرة بنجاح!");
}

function validateForm() {
    const barnName = document.getElementById('barn-name').value.trim();
    const totalQty = parseInt(document.getElementById('total-qty').value) || 0;
    const unitPrice = parseFloat(document.getElementById('unit-price').value) || 0;
    
    if (!barnName) {
        alert("يرجى إدخال اسم الحظيرة.");
        return false;
    }
    
    if (totalQty === 0) {
        alert("يرجى إدخال كمية الحيوانات.");
        return false;
    }
    
    if (unitPrice <= 0) {
        alert("يرجى إدخال سعر فردي صحيح.");
        return false;
    }
    
    return true;
}

function loadData() {
    const tableBody = document.getElementById('barns-table-body');
    tableBody.innerHTML = '';
    
    appData.barns.forEach(barn => {
        const row = tableBody.insertRow();
        
        // إضافة خلايا الجدول
        const cells = [
            barn.barnNumber,
            barn.barnName,
            formatDate(barn.gregorianDate),
            barn.capacity,
            barn.animalType,
            getDayMonth(barn.gregorianDate),
            barn.gender,
            barn.location,
            barn.maleQty,
            barn.femaleQty,
            barn.totalQty,
            formatPrice(barn.unitPrice),
            formatPrice(barn.totalPrice)
        ];
        
        cells.forEach((cellData, index) => {
            const cell = row.insertCell(index);
            cell.textContent = cellData;
            
            // تلوين الأعمدة العددية
            if (index === 3 || index === 8 || index === 9 || index === 10) {
                cell.style.backgroundColor = '#f8f9fa';
                cell.style.fontWeight = 'bold';
            }
        });
        
        // إضافة خلية الإجراءات
        const actionsCell = row.insertCell();
        const editButton = document.createElement('button');
        editButton.textContent = 'تعديل';
        editButton.className = 'btn btn-small';
        editButton.style.backgroundColor = '#3498db';
        editButton.style.color = 'white';
        editButton.style.marginRight = '5px';
        editButton.style.padding = '5px 10px';
        editButton.style.fontSize = '12px';
        editButton.onclick = () => loadBarnIntoForm(barn.id);
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'حذف';
        deleteButton.className = 'btn btn-small';
        deleteButton.style.backgroundColor = '#e74c3c';
        deleteButton.style.color = 'white';
        deleteButton.style.padding = '5px 10px';
        deleteButton.style.fontSize = '12px';
        deleteButton.onclick = () => prepareDelete(barn.id);
        
        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);
        
        // إضافة حدث النقر على الصف
        row.addEventListener('click', () => {
            // إزالة التحديد من جميع الصفوف
            Array.from(tableBody.rows).forEach(r => r.classList.remove('selected'));
            // تحديد الصف الحالي
            row.classList.add('selected');
        });
    });
    
    updateStatistics();
}

function updateStatistics() {
    const totalBarns = appData.barns.length;
    const totalAnimals = appData.barns.reduce((sum, barn) => sum + (barn.totalQty || 0), 0);
    
    document.getElementById('total-barns').textContent = totalBarns;
    document.getElementById('total-animals').textContent = totalAnimals;
}

function loadBarnIntoForm(barnId) {
    const barn = appData.barns.find(b => b.id === barnId);
    if (!barn) return;
    
    appData.selectedBarnId = barnId;
    
    // تعبئة الحقول من البيانات
    document.getElementById('barn-number').value = barn.barnNumber;
    document.getElementById('barn-name').value = barn.barnName;
    document.getElementById('capacity').value = barn.capacity;
    document.getElementById('animal-type').value = barn.animalType;
    document.getElementById('gender').value = barn.gender;
    document.getElementById('location').value = barn.location;
    document.getElementById('male-qty').value = barn.maleQty;
    document.getElementById('female-qty').value = barn.femaleQty;
    document.getElementById('total-qty').value = barn.totalQty;
    document.getElementById('hijri-date').value = barn.hijriDate;
    document.getElementById('gregorian-date').value = barn.gregorianDate;
    document.getElementById('day-name').value = barn.dayName;
    document.getElementById('supervisor').value = barn.supervisor;
    document.getElementById('unit-price').value = barn.unitPrice;
    document.getElementById('total-price').value = barn.totalPrice;
    
    // تحديث أنواع الحيوانات
    updateAnimalTypes();
    
    // التحقق من السعة
    checkCapacity();
}

function prepareDelete(barnId) {
    appData.selectedBarnId = barnId;
    document.getElementById('confirm-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('confirm-modal').classList.add('hidden');
    appData.selectedBarnId = null;
}

function confirmDelete() {
    if (appData.selectedBarnId) {
        const index = appData.barns.findIndex(barn => barn.id === appData.selectedBarnId);
        if (index !== -1) {
            appData.barns.splice(index, 1);
            saveData();
            loadData();
            clearForm();
            alert("تم حذف الحظيرة بنجاح!");
        }
    }
    closeModal();
}

function deleteBarn() {
    if (appData.selectedBarnId) {
        prepareDelete(appData.selectedBarnId);
    } else {
        alert("يرجى اختيار حظيرة أولاً.");
    }
}

// دوال مساعدة
function formatDate(dateValue) {
    if (!dateValue) return "";
    const date = new Date(dateValue);
    return date.toLocaleDateString('ar-EG');
}

function formatPrice(priceValue) {
    if (!priceValue) return "0";
    return parseFloat(priceValue).toLocaleString('ar-EG', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function getDayMonth(dateValue) {
    if (!dateValue) return "";
    const date = new Date(dateValue);
    return `${date.getDate()}/${date.getMonth() + 1}`;
}

function goBack() {
    if (confirm("هل تريد الرجوع للقائمة الرئيسية؟")) {
        // في التطبيق الحقيقي، يمكن توجيه المستخدم إلى الصفحة الرئيسية
        alert("الرجوع للقائمة الرئيسية");
    }
}