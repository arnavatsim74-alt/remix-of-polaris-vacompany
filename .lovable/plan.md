

# Aeroflot Virtual Group Crew Center

A professional, modern crew center for managing your virtual airline operations with full dark/light theme support.

---

## 🔐 Authentication System

### Login Page
- Split-screen design with Aeroflot aircraft image on the left, login form on the right
- Email & password authentication
- "Apply to join" link for new pilots
- Theme toggle (dark/light mode)

### Application Process
- New pilot registration form with:
  - Full Name, Email, Password
  - VATSIM/IVAO ID (optional)
  - Experience level, Preferred simulator
  - Reason for joining
- Applications go to admin for review
- Admin assigns PID (AFLVxxxx) upon approval

---

## 📊 Page 1: Dashboard

- **Full-width hero banner** with changeable Aeroflot aircraft image
- **Pilot info card**: Pilot ID (AFLVxxxx), Current Rank, Avatar
- **Stats grid**:
  - Total Flight Hours
  - Total PIREPs Logged
  - Current Rank with progress bar to next rank
- **Daily PIREP Streak** - Weekly calendar showing active days
- **Latest 5 PIREPs** table with status badges (Approved/Pending/Denied/On Hold)

---

## ✈️ Page 2: File PIREP

Comprehensive PIREP submission form:
- Flight Number (text input)
- Departure ICAO & Arrival ICAO
- Aircraft Type (dropdown - populated from fleet)
- Flight Hours (number input)
- Flight Date (date picker)
- Multiplier (0.5x, 1x, 1.5x, 2x dropdown)
- Operator dropdown:
  - Aeroflot, Azerbaijan, Uzbekistan, Belavia, S7 Airlines
  - AirBridge Cargo, Saudia, Emirates, Fly Dubai
  - Emirates SkyCargo, Aegean, Qatar Airways, SunCountry
  - IndiGo, Oman Air, Others
- Flight Type (Passenger / Cargo)
- Submit button with validation

---

## 📋 Page 3: PIREP History

- Paginated table of all submitted PIREPs
- Columns: Date, Flight No, Route, Aircraft, Hours, Operator, Type, Status
- Status badges with colors:
  - 🟡 Pending (yellow)
  - 🟢 Approved (green)
  - 🔴 Denied (red)
  - 🟠 On Hold (orange)
- Click to view full PIREP details
- Search/filter by date range, status, operator

---

## 🗺️ Page 4: Routes Database

- Searchable route catalogue
- Filter options:
  - Departure ICAO, Arrival ICAO
  - Aircraft Type
  - Route Type (Passenger/Cargo)
  - Minimum Rank
  - Flight Time range
- Table columns: Route No, Dep → Arr, Aircraft, Type, Est. Time, Min Rank, Notes
- "File PIREP" quick action button per route (pre-fills form)

---

## 🏆 Page 5: Leaderboard

- Top pilots ranked by total flight hours
- Table showing: Rank Position, Pilot Name, Rank Badge, Total Hours
- Current user highlighted in the list
- Filter by time period (All Time, This Month, This Week)

---

## 📅 Page 6: Events

- Event cards with banner images
- Event details:
  - Event Name & Description
  - Server (VATSIM/IVAO/Offline)
  - Start & End times (Zulu)
  - Route (Departure → Arrival)
- "Join Event" button
- Auto-assigns departure gate and arrival gate upon joining
  - Shows "N/A" if no gates available
- View your assigned gates after joining

---

## 📖 Page 7: Details

### Fleet Section
- Aircraft cards showing:
  - Aircraft image/icon
  - Type (A320, B737, B777, etc.)
  - ICAO code
  - Passenger/Cargo capacity
  - Range

### Ranks Section
- Rank progression display:
  - 🎓 **Cadet** - 0-25 hours
  - 👨‍✈️ **First Officer** - 25-50 hours
  - ✈️ **Captain** - 50-100 hours
  - ⭐ **Senior Captain** - 100-200 hours
  - 👑 **Commander** - 200-300 hours
- Visual rank insignias/badges

---

## 🛡️ Admin Panel (Single Admin Email Access)

### Page 8: Admin PIREPs
- View all PIREPs from all pilots
- Filter by status, pilot, date
- Actions per PIREP:
  - ✅ Approve (adds hours to pilot total)
  - ❌ Deny (with reason - required)
  - ⏸️ Hold (with reason - required)
- Bulk actions for multiple PIREPs

### Page 9: Admin Routes
- **CSV Import** with your format:
  - routeNumber, depICAO, arrICAO, aircraft, routeType, estFlightTime, rank, notes
  - Supports both minute (120) and HH:MM (1:54) time formats
- Preview import before confirming
- Add/Edit/Delete individual routes
- Bulk delete option
- Export current routes as CSV

### Page 10: Admin Events
- Create new events:
  - Event name, description, banner image
  - Server selection, date/time (Zulu)
  - Route selection or custom ICAO input
  - Gate availability settings per airport
- View event registrations
- Manage/delete events

### Pilot Applications (Admin Dashboard)
- Pending applications list
- View full application details
- Approve → Assign PID (AFLVxxxx) → Sends welcome email
- Reject → Provide reason → Sends rejection notice

---

## 🎨 Design & Experience

- **Professional aviation aesthetic** - Clean, structured, not "vibe coded"
- **Aeroflot brand integration** - Logo in sidebar, brand colors as accents
- **Dark/Light theme toggle** - Persisted preference
- **Side navigation** - Icon-based menu (collapsible)
- **Responsive design** - Works on desktop and tablet
- **Loading states & animations** - Smooth, professional transitions

---

## 🔧 Technical Stack

- **Supabase** for:
  - Authentication (email/password)
  - Database (pilots, PIREPs, routes, events)
  - Storage (event images, banners)
- **Role-based access**: Admin verified by email address
- **Real-time updates**: PIREP status changes
- **CSV parsing**: For route imports

