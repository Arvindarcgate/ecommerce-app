## 📦 **Project Feature: Coupon Module**

**🗓 Deadline Date:** **19/12/2025**

---

### 📝 **Description of Coupon Module**

The **Coupon Module** will be developed as a **stand-alone package** inside the `packages/coupon` folder.
This module will **centralize all coupon-related logic**, including:

- Coupon creation
- Validation rules
- Expiry checks
- Discount calculation
- Usage limits
- Common coupon utilities

This module will then be **imported and reused** across:

- **Admin application**
- **Frontend application**
- **Backend API**

This ensures **no duplicate code**, consistent behavior across the entire system, and easy maintenance.

---

### 🔄 **Flow of the Coupon Module**

### **1. Coupon is created in the Coupon Package**

All logic is written here:

- Create
- Validate
- Discount calculation
- Expiry logic
- Usage rules

Admin and backend will import these functions.

---

### **2. Admin Panel Integration**

- Admin fills coupon details (code, discount, dates, limits).
- Admin launches the coupon to be available for frontend users.

---

### **3. Frontend User Interaction**

- User enters coupon code on cart page.
- System shows coupon status (Active / Expired).
- If valid → new discounted price is displayed.

---

### **4. Backend Verification**

When the user clicks **Apply Coupon**:

- Frontend calls backend API.
- Backend imports coupon module logic.
- Backend checks:

  - Code validity
  - Expiry
  - Minimum price
  - Discount calculation
  - User usage limit

---

### **5. Backend Response**

- If **Valid** → returns **new discounted price**.
- If **Invalid** → returns the **reason** (Expired, Not Found, Limit Exceeded, etc.).
- Frontend updates UI accordingly.

---

## ⚙️ **Functionality of the Coupon Module**

---

### **Task 1 — Coupon Creation & Core Logic**

### **1. Coupon Migration Fields**

- `id`
- `coupon_code`
- `max_discount`
- `min_price`
- `status` → `Valid | Invalid`
- `start_date`
- `end_date`
- `user_limit`

### **2. Core Logic Includes:**

- Create coupon
- Validate coupon
- Calculate discount
- Check expiry
- Check minimum order amount
- Delete or deactivate coupon

This core logic lives **inside the shared coupon package** and is imported into all other apps.

---

### **Task 2 — Import into Admin & Backend**

### **Admin Side**

- Admin fills coupon fields
- Admin publishes coupon
- Coupon becomes available for frontend cart

### **Frontend Side**

- User enters coupon code
- Frontend sends API call to backend

### **Backend Side**

- Backend receives coupon code
- Backend runs validation using **Coupon Package**
- If valid → calculates new price
- If invalid → returns error message

---

### **Task 3 — Frontend Apply & Save Discounted Order**

### **After backend validation:**

- If **Valid**:

  - Frontend updates new discounted price
  - User submits order
  - Backend saves the final discounted order in database
