# 🌍 Wanderlust – Travel Stay Booking Web Application

Wanderlust is a full-stack web application inspired by Airbnb, where users can explore stays, view listings on an interactive map, create their own listings, book stays, and share reviews.  
It is built using **Node.js, Express, MongoDB, Cloudinary, Leaflet Maps, and EJS** with authentication, authorization, and real-time geolocation mapping.

---

## 🚀 Features

### 🏡 **Listings**
- Create, edit, delete your own property listings  
- Upload images using **Cloudinary**  
- Auto-geocode locations using **OpenStreetMap + Nominatim API**  
- Display listings on an interactive **Leaflet.js map**  
- Filtering & search functionality

### 👤 **User Accounts**
- Signup & login using **Passport.js**  
- Flash messages for feedback  
- Only listing owners can edit/delete listings  
- Wishlist support (save listings)

### ⭐ **Reviews**
- Users can add reviews with a star rating  
- Only the author can delete their review

### 🗺️ **Interactive Map**
- Each listing shows the exact location on a map  
- Custom marker + popup  
- Automatically updates when location changes

### 💳 **Bookings**
- Users can book stays with check-in & check-out  
- Validation for:
  - Cannot book for today or past dates  
  - Cannot book more than 6 months ahead

### 🧭 **Dashboard**
- See all listings you created  
- View your bookings  
- Manage your profile

---

## 🛠️ Tech Stack

**Frontend:**  
- HTML5, CSS3  
- EJS Templates  
- Bootstrap  
- Leaflet.js Map Library  

**Backend:**  
- Node.js  
- Express.js  
- MongoDB (Mongoose)  
- Passport.js Authentication  
- Cloudinary image upload  
- Nominatim API for geocoding  

---

## 📦 Installation & Setup (Local)

Clone the project:

```bash
git clone https://github.com/Chandana2903/wanderlust.git
cd wanderlust
