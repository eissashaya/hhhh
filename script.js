// بيانات التطبيق
class BarnApp {
    constructor() {
        this.selectedId = null;
        this.barns = JSON.parse(localStorage.getItem('barns')) || [];
        
        // أنواع الحيوانات لكل صنف
        this.animalTypesMapping = {
            "أغنام": ["حري", "نعيمي", "نجدي", "شامي"],
            "أبقار": ["بلدي", "هولشتاين", "ساحلي"], 
            "ماعز": ["شامي", "سعادي", "حيسي"],
            "جمال": ["مجاهيم", "شعل", "وضح"]
        };
        
        // بيانات الحظائر
        this.barnData = {
            "1": {"name": "الحظيرة الأولى", "location": "شمال المزرعة", "capacity": 200},
            "2": {"name": "الحظيرة الثانية", "location": "جنوب المزرعة", "capacity": 300},
            "3": {"name": "الحظيرة الثالثة", "location": "شرق المزرعة", "capacity": 200},
            "4": {"name": "الحظيرة الرابعة", "location": "غرب المزرعة", "capacity": 300},
            "5": {"name": "الحظيرة الخامسة", "location": "وسط المزرعة", "capacity": 200},
            "6": {"name": "الحظيرة السادسة", "location": "شمال المزرعة", "capacity": 300},
            "7": {"name": "الحظيرة السابعة", "location": "جنوب المزرعة", "capacity": 200},
            "8": {"name": "الحظيرة الثامنة", "location": "شرق المزرعة", "capacity": 300},
            "9": {"name": "الحظيرة التاسعة", "location": "غرب المزرعة", "capacity": 200},
            "10": {"name": "الحظيرة العاشرة", "location": "وسط المزرعة", "capacity": 300},
            "11": {"name": "الحظيرة الحادية عشر", "location": "شمال المزرعة", "capacity": 200},
            "12": {"name": "الحظيرة الثانية عشر", "location": "جنوب المزرعة", "capacity": 300},
            "13": {"name": "الحظيرة الثالثة عشر", "location": "شرق المزرعة", "capacity": 200},
            "14": {"name": "الحظيرة الرابعة عشر", "location": "غرب المزرعة", "capacity": 300},
            "15": {"name": "الحظيرة الخامسة عشر", "location": "وسط المزرعة", "capacity": 200},
            "16": {"name": "الحظيرة السادسة عشر", "location": "شمال المزرعة", "capacity": 300},
            "17": {"name": "الحظيرة السابعة عشر", "location": "جنوب المزرعة", "capacity": 200},
            "18": {"name": "الحظيرة الثامنة عشر", "location": "شرق المزرعة", "capacity": 300},
            "19": {"name": "الحظيرة التاسعة عشر", "location": "غرب المزرعة", "capacity": 200},
            "20": {"name": "الحظيرة العشرون", "location": "وسط المزرعة", "capacity": 300}
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.populateBarnNumbers();
        this.updateAnimalTypes();
        this.setAutoBarnNumber();
        this.updateHijriDate();
        this.updateDayName();
        this.updateStatistics();
        this.loadData();
    }
    
    setupEventListeners() {
        // أزرار العمليات
        document.getElementById('btnNew').addEventListener('click', () => this.clearFields());
        document.getElementById('btnSave').addEventListener('click', () => this.saveBarn());
        document.getElementById('btnView').addEventListener('click', () => this.loadData());
        document.getElementById('btnDelete').addEventListener('click', () => this.deleteBarn());
        document.getElementById('searchBtn').addEventListener('click', () => this.searchBarns());
        
        // التحديثات التلقائية
        document.getElementById('animalType').addEventListener('change', () => this.updateAnimalTypes());
        document.getElementById('maleQty').addEventListener('input', () => this.updateTotals());
        document.getElementById('femaleQty').addEventListener('input', () => this.updateTotals());
        document.getElementById('unitPrice').addEventListener('input', () => this.updateTotals());
        document.getElementById('gregorianDate').addEventListener('change', () => {
            this.updateHijriDate();
            this.updateDayName();
        });
        document.getElementById('maleQty').addEventListener('input', () => this.checkCapacity());
        document.getElementById('femaleQty').addEventListener('input', () => this.checkCapacity());
        document.getElementById('capacity').addEventListener('input', () => this.checkCapacity());
        document.getElementById('barnNumber').addEventListener('change', () => this.updateBarnData());
        
        // زر الرجوع
        document.getElementById('backBtn').addEventListener('click', () => {
            if (confirm('هل تريد الرجوع إلى القائمة الرئيسية؟')) {
                window.close();
            }
        });
        
        // البحث عند الضغط على Enter
        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchBarns();
            }
        });
    }
    
    populateBarnNumbers() {
        const barnNumberSelect = document.getElementById('barnNumber');
        barnNumberSelect.innerHTML = '';
        
        for (let i = 1; i <= 20; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            barnNumberSelect.appendChild(option);
        }
    }
    
    updateAnimalTypes() {
        const selectedAnimal = document.getElementById('animalType').value;
        const genderSelect = document.getElementById('gender');
        
        genderSelect.innerHTML = '';
        
        if (this.animalTypesMapping[selectedAnimal]) {
            this.animalTypesMapping[selectedAnimal].forEach(type => {
                const option = document.createElement('option');
                option.value = type;
                option.textContent = type;
                genderSelect.appendChild(option);
            });
        }
    }
    
    updateBarnData() {
        const selectedNumber = document.getElementById('barnNumber').value;
        
        if (this.barnData[selectedNumber]) {
            document.getElementById('barnName').value = this.barnData[selectedNumber].name;
            document.getElementById('capacity').value = this.barnData[selectedNumber].capacity;
            
            const locationSelect = document.getElementById('location');
            for (let i = 0; i < locationSelect.options.length; i++) {
                if (locationSelect.options[i].value === this.barnData[selectedNumber].location) {
                    locationSelect.selectedIndex = i;
                    break;
                }
            }
        } else {
            try {
                const barnNum = parseInt(selectedNumber);
                const capacityValue = barnNum % 2 === 1 ? 200 : 300;
                document.getElementById('capacity').value = capacityValue;
                document.getElementById('barnName').value = `الحظيرة ${selectedNumber}`;
                
                const locationSelect = document.getElementById('location');
                locationSelect.selectedIndex = barnNum % 5;
            } catch (error) {
                document.getElementById('capacity').value = 200;
            }
        }
    }
    
    updateTotals() {
        const maleQty = parseInt(document.getElementById('maleQty').value) || 0;
        const femaleQty = parseInt(document.getElementById('femaleQty').value) || 0;
        const totalQty = maleQty + femaleQty;
        
        document.getElementById('totalQuantity').value = totalQty;
        
        // الحصول على قيمة السعر الفردي كرقم مباشرة
        const unitPrice = parseInt(document.getElementById('unitPrice').value) || 0;
        const totalPrice = unitPrice * totalQty;
        
        document.getElementById('totalPrice').value = totalPrice.toLocaleString('ar-EG') + ' ريال';
    }
    
    updateHijriDate() {
        const gregorianDate = new Date(document.getElementById('gregorianDate').value);
        if (!isNaN(gregorianDate.getTime())) {
            const hijriDate = this.convertToHijri(gregorianDate);
            document.getElementById('hijriDate').value = hijriDate;
        }
    }
    
    convertToHijri(gregorianDate) {
        // تحويل مبسط للتاريخ الهجري (للاستخدام الفعلي، يفضل استخدام مكتبة متخصصة)
        const year = gregorianDate.getFullYear();
        const month = gregorianDate.getMonth() + 1;
        const day = gregorianDate.getDate();
        
        // تحويل تقريبي (هذه مجرد مثال، التحويل الدقيق يتطلب خوارزمية معقدة)
        const hijriYear = Math.round((year - 622) * (33/32));
        const hijriMonth = month;
        const hijriDay = day;
        
        return `${hijriYear}/${hijriMonth.toString().padStart(2, '0')}/${hijriDay.toString().padStart(2, '0')}`;
    }
    
    updateDayName() {
        const gregorianDate = new Date(document.getElementById('gregorianDate').value);
        if (!isNaN(gregorianDate.getTime())) {
            const dayName = this.getDayNameArabic(gregorianDate);
            document.getElementById('dayName').value = dayName;
        }
    }
    
    getDayNameArabic(date) {
        const days = {
            0: "الأحد",
            1: "الاثنين",
            2: "الثلاثاء", 
            3: "الأربعاء",
            4: "الخميس",
            5: "الجمعة",
            6: "السبت"
        };
        return days[date.getDay()];
    }
    
    checkCapacity() {
        const totalAnimals = parseInt(document.getElementById('maleQty').value || 0) + 
                            parseInt(document.getElementById('femaleQty').value || 0);
        const capacity = parseInt(document.getElementById('capacity').value || 0);
        
        const alertLabel = document.getElementById('alertLabel');
        
        if (capacity > 0 && totalAnimals > capacity) {
            alertLabel.textContent = `⚠️ تنبيه: العدد ${totalAnimals} يتجاوز السعة ${capacity}`;
            alertLabel.style.display = 'block';
        } else {
            alertLabel.style.display = 'none';
        }
    }
    
    setAutoBarnNumber() {
        const nextNumber = this.getNextBarnNumber();
        const barnNumberSelect = document.getElementById('barnNumber');
        
        for (let i = 0; i < barnNumberSelect.options.length; i++) {
            if (barnNumberSelect.options[i].value === nextNumber) {
                barnNumberSelect.selectedIndex = i;
                break;
            }
        }
        
        this.updateBarnData();
    }
    
    getNextBarnNumber() {
        if (this.barns.length === 0) return "1";
        
        const lastBarn = this.barns.reduce((prev, current) => 
            (parseInt(prev.رقم_الحظيرة) > parseInt(current.رقم_الحظيرة)) ? prev : current
        );
        
        return (parseInt(lastBarn.رقم_الحظيرة) + 1).toString();
    }
    
    clearFields() {
        this.selectedId = null;
        this.setAutoBarnNumber();
        document.getElementById('barnName').value = '';
        document.getElementById('animalType').selectedIndex = 0;
        this.updateAnimalTypes();
        document.getElementById('location').selectedIndex = 0;
        document.getElementById('maleQty').value = '0';
        document.getElementById('femaleQty').value = '0';
        document.getElementById('totalQuantity').value = '0';
        document.getElementById('gregorianDate').value = new Date().toISOString().split('T')[0];
        document.getElementById('supervisor').selectedIndex = 0;
        document.getElementById('unitPrice').value = '1'; // تعيين القيمة الافتراضية إلى 1
        document.getElementById('totalPrice').value = '';
        document.getElementById('alertLabel').style.display = 'none';
        
        this.updateHijriDate();
        this.updateDayName();
    }
    
    saveBarn() {
        // التحقق من البيانات
        if (!document.getElementById('barnName').value.trim()) {
            alert('يرجى إدخال اسم الحظيرة.');
            return;
        }
        
        if (parseInt(document.getElementById('totalQuantity').value) === 0) {
            alert('يرجى إدخال كمية الحيوانات.');
            return;
        }
        
        // التحقق من صحة السعر الفردي (الآن هو رقم مباشرة)
        const unitPrice = parseInt(document.getElementById('unitPrice').value) || 0;
        if (unitPrice < 1) {
            alert('السعر الفردي يجب أن يكون 1 أو أكثر.');
            document.getElementById('unitPrice').focus();
            return;
        }
        
        // حساب البيانات
        const totalAnimals = parseInt(document.getElementById('totalQuantity').value);
        const capacity = parseInt(document.getElementById('capacity').value);
        const alertFlag = totalAnimals > capacity && capacity > 0;
        const totalPrice = unitPrice * totalAnimals;
        
        const barnData = {
            رقم_الحظيرة: document.getElementById('barnNumber').value,
            اسم_الحظيرة: document.getElementById('barnName').value,
            الاستيعاب: capacity,
            الصنف: document.getElementById('animalType').value,
            النوع: document.getElementById('gender').value,
            الموقع: document.getElementById('location').value,
            كمية_ذكور: parseInt(document.getElementById('maleQty').value),
            كمية_إناث: parseInt(document.getElementById('femaleQty').value),
            الإجمالي: totalAnimals,
            تاريخ_الهجري: document.getElementById('hijriDate').value,
            تاريخ_الميلادي: document.getElementById('gregorianDate').value,
            المشرف: document.getElementById('supervisor').value,
            السعر_الفردي: unitPrice, // الآن هو رقم مباشرة
            إجمالي_السعر: totalPrice,
            التنبيه: alertFlag,
            تاريخ_الإضافة: new Date().toISOString()
        };
        
        try {
            if (this.selectedId) {
                // تحديث الحظيرة
                const index = this.barns.findIndex(barn => barn.id === this.selectedId);
                if (index !== -1) {
                    this.barns[index] = { ...this.barns[index], ...barnData };
                }
            } else {
                // إضافة حظيرة جديدة
                barnData.id = Date.now().toString();
                this.barns.push(barnData);
            }
            
            // حفظ في localStorage
            localStorage.setItem('barns', JSON.stringify(this.barns));
            
            alert(this.selectedId ? 'تم تحديث الحظيرة بنجاح!' : 'تم إضافة الحظيرة بنجاح!');
            this.clearFields();
            this.loadData();
            
        } catch (error) {
            alert('حدث خطأ أثناء الحفظ: ' + error.message);
        }
    }
    
    deleteBarn() {
        if (!this.selectedId) {
            alert('يرجى اختيار حظيرة أولاً.');
            return;
        }
        
        if (confirm('هل تريد حذف الحظيرة المحددة؟')) {
            try {
                this.barns = this.barns.filter(barn => barn.id !== this.selectedId);
                localStorage.setItem('barns', JSON.stringify(this.barns));
                
                alert('تم حذف الحظيرة بنجاح!');
                this.clearFields();
                this.loadData();
                
            } catch (error) {
                alert('حدث خطأ أثناء الحذف: ' + error.message);
            }
        }
    }
    
    loadData(searchTerm = '') {
        let filteredBarns = this.barns;
        
        if (searchTerm) {
            filteredBarns = this.barns.filter(barn => 
                barn.اسم_الحظيرة.includes(searchTerm) ||
                barn.الصنف.includes(searchTerm) ||
                barn.رقم_الحظيرة.includes(searchTerm)
            );
        }
        
        const tableBody = document.getElementById('barnsTableBody');
        tableBody.innerHTML = '';
        
        filteredBarns.forEach(barn => {
            const row = document.createElement('tr');
            
            // إضافة بيانات الصف
            const columns = [
                barn.رقم_الحظيرة,
                barn.اسم_الحظيرة,
                barn.تاريخ_الميلادي,
                barn.الاستيعاب,
                barn.الصنف,
                this.getDayMonth(barn.تاريخ_الميلادي),
                barn.النوع,
                barn.الموقع,
                barn.كمية_ذكور,
                barn.كمية_إناث,
                barn.الإجمالي,
                this.formatPrice(barn.السعر_الفردي),
                this.formatPrice(barn.إجمالي_السعر)
            ];
            
            columns.forEach((value, index) => {
                const cell = document.createElement('td');
                cell.textContent = value;
                
                // تلوين الأعمدة العددية
                if ([3, 8, 9, 10].includes(index)) {
                    cell.style.backgroundColor = '#f8f9fa';
                    cell.style.textAlign = 'center';
                    cell.style.fontWeight = 'bold';
                    
                    // تكبير خط الاستيعاب في الجدول أيضاً
                    if (index === 3) {
                        cell.style.fontSize = '14pt';
                        cell.style.color = '#16a085';
                        cell.style.background = 'linear-gradient(to bottom, #e8f6f3, #d1f2eb)';
                    }
                }
                
                row.appendChild(cell);
            });
            
            // إضافة أزرار الإجراءات
            const actionsCell = document.createElement('td');
            
            const editBtn = document.createElement('button');
            editBtn.textContent = 'تعديل';
            editBtn.className = 'action-btn edit-btn';
            editBtn.addEventListener('click', () => this.loadSelectedBarn(barn.id));
            
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'حذف';
            deleteBtn.className = 'action-btn delete-btn';
            deleteBtn.addEventListener('click', () => {
                this.selectedId = barn.id;
                this.deleteBarn();
            });
            
            actionsCell.appendChild(editBtn);
            actionsCell.appendChild(deleteBtn);
            row.appendChild(actionsCell);
            
            tableBody.appendChild(row);
        });
        
        this.updateStatistics();
    }
    
    loadSelectedBarn(barnId) {
        const barn = this.barns.find(b => b.id === barnId);
        if (!barn) return;
        
        this.selectedId = barnId;
        
        // تعبئة الحقول من البيانات
        document.getElementById('barnNumber').value = barn.رقم_الحظيرة;
        document.getElementById('barnName').value = barn.اسم_الحظيرة;
        document.getElementById('capacity').value = barn.الاستيعاب;
        document.getElementById('animalType').value = barn.الصنف;
        
        // تحديث أنواع الحيوانات بناءً على الصنف
        this.updateAnimalTypes();
        
        setTimeout(() => {
            document.getElementById('gender').value = barn.النوع;
        }, 100);
        
        document.getElementById('location').value = barn.الموقع;
        document.getElementById('maleQty').value = barn.كمية_ذكور;
        document.getElementById('femaleQty').value = barn.كمية_إناث;
        document.getElementById('totalQuantity').value = barn.الإجمالي;
        document.getElementById('hijriDate').value = barn.تاريخ_الهجري;
        document.getElementById('gregorianDate').value = barn.تاريخ_الميلادي;
        document.getElementById('supervisor').value = barn.المشرف;
        document.getElementById('unitPrice').value = barn.السعر_الفردي || 1; // القيمة الافتراضية 1 إذا كانت غير موجودة
        document.getElementById('totalPrice').value = this.formatPrice(barn.إجمالي_السعر);
        
        this.updateDayName();
        this.checkCapacity();
    }
    
    searchBarns() {
        const searchTerm = document.getElementById('searchInput').value;
        this.loadData(searchTerm);
    }
    
    updateStatistics() {
        const totalBarns = this.barns.length;
        const totalAnimals = this.barns.reduce((sum, barn) => sum + (barn.الإجمالي || 0), 0);
        
        document.getElementById('totalBarns').textContent = `عدد الحظائر: ${totalBarns}`;
        document.getElementById('totalAnimals').textContent = `إجمالي الحيوانات: ${totalAnimals}`;
    }
    
    getDayMonth(dateValue) {
        if (!dateValue) return "";
        try {
            const date = new Date(dateValue);
            return `${date.getDate()}/${date.getMonth() + 1}`;
        } catch (error) {
            return "";
        }
    }
    
    formatPrice(priceValue) {
        if (!priceValue) return "0.00 ريال";
        try {
            return `${parseFloat(priceValue).toFixed(2)} ريال`;
        } catch (error) {
            return "0.00 ريال";
        }
    }
}

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    new BarnApp();
});