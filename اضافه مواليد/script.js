// حالة التطبيق
const appState = {
    barns: [],
    currentBarn: null,
    mothers: [],
    newborns: [],
    currentTab: 'all',
    selectedNewborn: null
};

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadInitialData();
});

// تهيئة التطبيق
function initializeApp() {
    // تعيين تاريخ اليوم كتاريخ ميلاد افتراضي
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('birth-date').value = today;
    updateAgeDisplay();
    
    // بدء المؤقتات للتحديث التلقائي
    setInterval(loadBarnsData, 30000); // تحديث الحظائر كل 30 ثانية
    setInterval(loadNewbornsData, 30000); // تحديث المواليد كل 30 ثانية
    setInterval(autoUpdateStatus, 60000); // تحديث الحالات كل دقيقة
}

// إعداد معالجات الأحداث
function setupEventListeners() {
    // اختيار الحظيرة
    document.getElementById('barn-select').addEventListener('change', function() {
        const barnNumber = this.value;
        if (barnNumber) {
            selectBarn(barnNumber);
        } else {
            hideBarnDetails();
        }
    });
    
    // تحديث الحظائر
    document.getElementById('refresh-barns').addEventListener('click', loadBarnsData);
    
    // تحديث العمر عند تغيير تاريخ الميلاد
    document.getElementById('birth-date').addEventListener('change', updateAgeDisplay);
    
    // نموذج إضافة مولود جديد
    document.getElementById('newborn-form').addEventListener('submit', saveNewborn);
    
    // تحديث البيانات
    document.getElementById('refresh-data').addEventListener('click', loadNewbornsData);
    
    // تحديث الحالات
    document.getElementById('auto-update').addEventListener('click', manualAutoUpdate);
    
    // حذف المحدد
    document.getElementById('delete-selected').addEventListener('click', deleteSelectedNewborn);
    
    // التبويبات
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });
    
    // النماذج المنبثقة
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    document.getElementById('cancel-edit').addEventListener('click', function() {
        document.getElementById('edit-modal').style.display = 'none';
    });
    
    document.getElementById('edit-form').addEventListener('submit', updateNewbornStatus);
    
    // إغلاق النماذج عند النقر خارجها
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
}

// تحميل البيانات الأولية
function loadInitialData() {
    loadBarnsData();
    loadNewbornsData();
}

// تحميل بيانات الحظائر
async function loadBarnsData() {
    try {
        showLoading('barn-select', 'جاري تحميل الحظائر...');
        
        // محاكاة جلب البيانات من API
        const barns = await fetchBarnsFromAPI();
        
        const barnSelect = document.getElementById('barn-select');
        barnSelect.innerHTML = '<option value="">-- اختر الحظيرة --</option>';
        
        if (barns && barns.length > 0) {
            appState.barns = barns;
            barns.forEach(barn => {
                const option = document.createElement('option');
                option.value = barn.number;
                option.textContent = `${barn.name} (رقم: ${barn.number})`;
                barnSelect.appendChild(option);
            });
        } else {
            barnSelect.innerHTML = '<option value="">لا توجد حظائر</option>';
        }
        
    } catch (error) {
        console.error('خطأ في تحميل الحظائر:', error);
        showError('barn-select', 'خطأ في تحميل الحظائر');
    }
}

// تحميل بيانات المواليد
async function loadNewbornsData() {
    try {
        showLoading('all-table-body', 'جاري تحميل البيانات...');
        
        // محاكاة جلب البيانات من API
        const newborns = await fetchNewbornsFromAPI();
        
        if (newborns) {
            appState.newborns = newborns;
            updateStatistics(newborns);
            populateTables(newborns);
        }
        
    } catch (error) {
        console.error('خطأ في تحميل بيانات المواليد:', error);
        showError('all-table-body', 'خطأ في تحميل البيانات');
    }
}

// عند اختيار حظيرة
async function selectBarn(barnNumber) {
    try {
        const barn = appState.barns.find(b => b.number == barnNumber);
        if (barn) {
            appState.currentBarn = barn;
            showBarnDetails(barn);
            await loadMotherCodes(barnNumber);
        }
    } catch (error) {
        console.error('خطأ في اختيار الحظيرة:', error);
    }
}

// عرض تفاصيل الحظيرة
function showBarnDetails(barn) {
    const barnInfo = document.getElementById('barn-info');
    barnInfo.style.display = 'block';
    
    document.getElementById('barn-number').textContent = barn.number;
    document.getElementById('barn-name').textContent = barn.name;
    document.getElementById('total-capacity').textContent = barn.capacity;
    document.getElementById('used-capacity').textContent = barn.usedCapacity || '0';
    document.getElementById('remaining-capacity').textContent = barn.remainingCapacity || barn.capacity;
    document.getElementById('barn-location').textContent = barn.location || 'غير محدد';
}

// إخفاء تفاصيل الحظيرة
function hideBarnDetails() {
    document.getElementById('barn-info').style.display = 'none';
    appState.currentBarn = null;
}

// تحميل أكواد الأمهات
async function loadMotherCodes(barnNumber) {
    try {
        const motherSelect = document.getElementById('mother-code');
        showLoading('mother-code', 'جاري تحميل أكواد الأمهات...');
        
        // محاكاة جلب البيانات من API
        const mothers = await fetchMotherCodesFromAPI(barnNumber);
        
        motherSelect.innerHTML = '<option value="">-- اختر كود الأم --</option>';
        
        if (mothers && mothers.length > 0) {
            appState.mothers = mothers;
            mothers.forEach(mother => {
                const option = document.createElement('option');
                option.value = mother.code;
                option.textContent = mother.code;
                motherSelect.appendChild(option);
            });
        } else {
            motherSelect.innerHTML = '<option value="">لا توجد أكواد أمهات</option>';
        }
        
    } catch (error) {
        console.error('خطأ في تحميل أكواد الأمهات:', error);
        showError('mother-code', 'خطأ في تحميل أكواد الأمهات');
    }
}

// تحديث عرض العمر
function updateAgeDisplay() {
    const birthDate = document.getElementById('birth-date').value;
    if (birthDate) {
        const ageMonths = calculateAgeInMonths(birthDate);
        document.getElementById('age-display').textContent = `${ageMonths} شهر`;
        
        // تحديث الحالة تلقائياً إذا كان العمر 3 أشهر أو أكثر
        if (ageMonths >= 3) {
            document.getElementById('status').value = 'جاهز';
        }
    }
}

// حساب العمر بالأشهر
function calculateAgeInMonths(birthDate) {
    const birth = new Date(birthDate);
    const today = new Date();
    const months = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
    return Math.max(0, months);
}

// حفظ مولود جديد
async function saveNewborn(event) {
    event.preventDefault();
    
    if (!appState.currentBarn) {
        alert('يرجى اختيار الحظيرة أولاً');
        return;
    }
    
    try {
        const formData = new FormData(event.target);
        const newbornData = {
            barnNumber: appState.currentBarn.number,
            motherCode: formData.get('mother-code'),
            gender: formData.get('gender'),
            twin: formData.get('twin'),
            birthPlace: formData.get('birth-place'),
            status: formData.get('status'),
            birthDate: formData.get('birth-date'),
            notes: formData.get('notes'),
            ageMonths: calculateAgeInMonths(formData.get('birth-date')),
            barnCode: `B${String(appState.currentBarn.number).padStart(3, '0')}`,
            newbornCode: generateNewbornCode(),
            newbornCard: generateNewbornCard()
        };
        
        // التحقق من صحة البيانات
        if (!validateNewbornData(newbornData)) {
            return;
        }
        
        showLoadingModal('جاري حفظ المولود...');
        
        // محاكاة حفظ البيانات عبر API
        const result = await saveNewbornToAPI(newbornData);
        
        hideLoadingModal();
        
        if (result.success) {
            alert('تم حفظ المولود بنجاح');
            event.target.reset();
            document.getElementById('birth-date').value = new Date().toISOString().split('T')[0];
            updateAgeDisplay();
            loadNewbornsData();
        } else {
            alert('فشل في حفظ المولود: ' + result.message);
        }
        
    } catch (error) {
        hideLoadingModal();
        console.error('خطأ في حفظ المولود:', error);
        alert('حدث خطأ أثناء حفظ المولود');
    }
}

// التحقق من صحة بيانات المولود
function validateNewbornData(data) {
    if (!data.motherCode) {
        alert('يرجى اختيار كود الأم');
        return false;
    }
    
    if (!data.birthDate) {
        alert('يرجى إدخال تاريخ الميلاد');
        return false;
    }
    
    return true;
}

// توليد كود المولود
function generateNewbornCode() {
    const nextCode = appState.newborns.length + 10001;
    return String(nextCode).padStart(5, '0');
}

// توليد رقم البطاقة
function generateNewbornCard() {
    const barnCode = `B${String(appState.currentBarn.number).padStart(3, '0')}`;
    const motherCode = document.getElementById('mother-code').value;
    const newbornCode = generateNewbornCode();
    
    if (motherCode) {
        const cleanMotherCode = motherCode.replace('-', '').replace(' ', '');
        return `${barnCode}/${cleanMotherCode}/${newbornCode}`;
    } else {
        return `${barnCode}/NB/${newbornCode}`;
    }
}

// تحديث الإحصائيات
function updateStatistics(newborns) {
    const total = newborns.length;
    const males = newborns.filter(n => n.gender === 'ذكر').length;
    const females = newborns.filter(n => n.gender === 'أنثى').length;
    const existing = newborns.filter(n => n.status === 'موجود').length;
    const ready = newborns.filter(n => n.status === 'جاهز').length;
    const sold = newborns.filter(n => n.status === 'مباع').length;
    const dead = newborns.filter(n => n.status === 'نافق').length;
    const lost = newborns.filter(n => n.status === 'مفقود').length;
    
    document.getElementById('total-newborns').textContent = total;
    document.getElementById('male-count').textContent = males;
    document.getElementById('female-count').textContent = females;
    document.getElementById('existing-count').textContent = existing;
    document.getElementById('ready-count').textContent = ready;
    document.getElementById('sold-count').textContent = sold;
    document.getElementById('dead-count').textContent = dead;
    document.getElementById('lost-count').textContent = lost;
}

// ملء الجداول
function populateTables(newborns) {
    const tables = {
        'all': newborns,
        'existing': newborns.filter(n => n.status === 'موجود'),
        'ready': newborns.filter(n => n.status === 'جاهز'),
        'sold': newborns.filter(n => n.status === 'مباع'),
        'dead': newborns.filter(n => n.status === 'نافق'),
        'lost': newborns.filter(n => n.status === 'مفقود')
    };
    
    for (const [tab, data] of Object.entries(tables)) {
        const tbody = document.getElementById(`${tab}-table-body`);
        tbody.innerHTML = '';
        
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="14" style="text-align: center; padding: 20px;">لا توجد بيانات</td></tr>';
            continue;
        }
        
        data.forEach((newborn, index) => {
            const row = document.createElement('tr');
            row.dataset.id = newborn.id;
            
            row.innerHTML = `
                <td>${newborn.id}</td>
                <td>${newborn.barnNumber}</td>
                <td>${newborn.motherCode}</td>
                <td>${newborn.gender}</td>
                <td>${newborn.twin}</td>
                <td>${newborn.birthPlace}</td>
                <td>${formatDate(newborn.birthDate)}</td>
                <td>${newborn.ageMonths} شهر</td>
                <td><span class="status-badge status-${newborn.status}">${newborn.status}</span></td>
                <td>${newborn.barnCode}</td>
                <td>${newborn.newbornCode}</td>
                <td>${newborn.newbornCard}</td>
                <td>${formatDate(newborn.createdAt)}</td>
                <td>
                    <button class="btn-action btn-edit" onclick="editNewborn(${newborn.id})">✏️</button>
                    <button class="btn-action btn-delete" onclick="deleteNewborn(${newborn.id})">🗑️</button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
        
        // إضافة معالجات الأحداث للتحديد
        tbody.querySelectorAll('tr').forEach(tr => {
            tr.addEventListener('click', function(e) {
                if (!e.target.classList.contains('btn-action')) {
                    this.closest('tbody').querySelectorAll('tr').forEach(r => r.classList.remove('selected'));
                    this.classList.add('selected');
                    appState.selectedNewborn = this.dataset.id;
                }
            });
        });
    }
}

// تنسيق التاريخ
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG');
}

// تبديل التبويبات
function switchTab(tabName) {
    // تحديد الأزرار النشطة
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // إظهار المحتوى النشط
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    appState.currentTab = tabName;
}

// تعديل مولود
function editNewborn(id) {
    const newborn = appState.newborns.find(n => n.id === id);
    if (newborn) {
        document.getElementById('edit-id').value = newborn.id;
        document.getElementById('edit-status').value = newborn.status;
        document.getElementById('edit-modal').style.display = 'block';
    }
}

// تحديث حالة المولود
async function updateNewbornStatus(event) {
    event.preventDefault();
    
    const id = document.getElementById('edit-id').value;
    const status = document.getElementById('edit-status').value;
    
    try {
        showLoadingModal('جاري تحديث الحالة...');
        
        // محاكاة تحديث البيانات عبر API
        const result = await updateNewbornStatusInAPI(id, status);
        
        hideLoadingModal();
        
        if (result.success) {
            alert('تم تحديث حالة المولود بنجاح');
            document.getElementById('edit-modal').style.display = 'none';
            loadNewbornsData();
        } else {
            alert('فشل في تحديث الحالة: ' + result.message);
        }
        
    } catch (error) {
        hideLoadingModal();
        console.error('خطأ في تحديث الحالة:', error);
        alert('حدث خطأ أثناء تحديث الحالة');
    }
}

// حذف مولود
async function deleteNewborn(id) {
    if (!confirm('هل أنت متأكد من حذف هذا المولود؟')) {
        return;
    }
    
    try {
        showLoadingModal('جاري الحذف...');
        
        // محاكاة حذف البيانات عبر API
        const result = await deleteNewbornFromAPI(id);
        
        hideLoadingModal();
        
        if (result.success) {
            alert('تم حذف المولود بنجاح');
            loadNewbornsData();
        } else {
            alert('فشل في حذف المولود: ' + result.message);
        }
        
    } catch (error) {
        hideLoadingModal();
        console.error('خطأ في حذف المولود:', error);
        alert('حدث خطأ أثناء حذف المولود');
    }
}

// حذف المولود المحدد
function deleteSelectedNewborn() {
    if (!appState.selectedNewborn) {
        alert('يرجى تحديد مولود من الجدول');
        return;
    }
    
    deleteNewborn(appState.selectedNewborn);
}

// التحديث التلقائي للحالات
async function autoUpdateStatus() {
    try {
        // محاكاة التحديث التلقائي عبر API
        await autoUpdateStatusInAPI();
        
        // إعادة تحميل البيانات لعرض التغييرات
        loadNewbornsData();
        
    } catch (error) {
        console.error('خطأ في التحديث التلقائي:', error);
    }
}

// التحديث اليدوي للحالات
function manualAutoUpdate() {
    if (confirm('هل تريد تحديث الحالات تلقائياً بناءً على الأعمار؟')) {
        autoUpdateStatus();
    }
}

// دوال API الوهمية (سيتم استبدالها بطلبات API حقيقية)
async function fetchBarnsFromAPI() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([]); // إرجاع مصفوفة فارغة
        }, 1000);
    });
}

async function fetchMotherCodesFromAPI(barnNumber) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([]); // إرجاع مصفوفة فارغة
        }, 500);
    });
}

async function fetchNewbornsFromAPI() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([]); // إرجاع مصفوفة فارغة
        }, 1000);
    });
}

async function saveNewbornToAPI(data) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ success: true, message: 'تم الحفظ بنجاح' });
        }, 500);
    });
}

async function updateNewbornStatusInAPI(id, status) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ success: true, message: 'تم التحديث بنجاح' });
        }, 500);
    });
}

async function deleteNewbornFromAPI(id) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ success: true, message: 'تم الحذف بنجاح' });
        }, 500);
    });
}

async function autoUpdateStatusInAPI() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ success: true, message: 'تم التحديث التلقائي' });
        }, 1000);
    });
}

// دوال المساعدة
function showLoading(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `<div style="text-align: center; padding: 20px; color: #666;">${message}</div>`;
    }
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `<div style="text-align: center; padding: 20px; color: #e74c3c;">${message}</div>`;
    }
}

function showLoadingModal(message) {
    document.getElementById('loading-message').textContent = message;
    document.getElementById('loading-modal').style.display = 'block';
}

function hideLoadingModal() {
    document.getElementById('loading-modal').style.display = 'none';
}