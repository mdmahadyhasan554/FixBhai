# Technician Specialization Feature - COMPLETE ✅

## Overview
Added a specialization/category system for technicians that allows them to specify their expertise areas. Both admins and technicians can edit specializations.

## Database Changes

### Migration File Created
`database/add_technician_specialization.sql`

**Run this SQL to add the feature:**
```sql
ALTER TABLE `users` 
ADD COLUMN `specialization` VARCHAR(100) NULL AFTER `role`,
ADD COLUMN `specialization_other` VARCHAR(100) NULL AFTER `specialization`;

UPDATE `users` 
SET `specialization` = 'General' 
WHERE `role` = 'technician' AND `specialization` IS NULL;
```

### New Columns
- `specialization` - VARCHAR(100) - Main specialization category
- `specialization_other` - VARCHAR(100) - Custom specialization when "Other" is selected

## Available Specializations

1. **Electrical** - Electrical work and wiring
2. **AC Repair** - AC Repair & Cooling systems
3. **Plumbing** - Plumbing and water systems
4. **Cleaning** - Cleaning Services
5. **Carpentry** - Carpentry & Furniture work
6. **Painting** - Painting & Decoration
7. **Car Mechanic** - Car repair and maintenance
8. **Pest Control** - Pest control services
9. **CCTV Install** - CCTV & Security systems
10. **Appliance Repair** - General appliance repair
11. **Gardening** - Gardening & Landscaping
12. **Other** - Custom specialization (with text input)

## Backend Changes

### New API Endpoint
**File**: `backend/api/users/update-specialization.php`

**Method**: POST/PATCH

**Authentication**: Required (technician or admin)

**Request Body**:
```json
{
  "userId": 123,
  "specialization": "Electrical",
  "specializationOther": null
}
```

**Response**:
```json
{
  "success": true,
  "message": "Specialization updated successfully"
}
```

**Permissions**:
- Technicians can update their own specialization
- Admins can update any technician's specialization

### Updated API Endpoint
**File**: `backend/api/admin/technicians.php`

Now returns specialization fields:
- `specialization` - Raw specialization value
- `specialization_other` - Custom specialization text
- `specialization_display` - Formatted display text

## Frontend Changes

### Constants Added
**File**: `src/constants/index.js`

Added `TECHNICIAN_SPECIALIZATIONS` array with all available specializations.

### API Function Added
**File**: `src/api/adminApi.js`

```javascript
updateTechnicianSpecialization(userId, specialization, specializationOther)
```

### Admin UI Updated
**File**: `src/features/dashboard/admin/AdminTechniciansTab.jsx`

**Changes**:
1. Technician cards now show specialization badge
2. Technician details modal includes specialization section
3. Inline editing of specialization in modal
4. Dropdown with all specialization options
5. Text input for "Other" specialization

## How to Use

### For Admins

1. **View Specializations**:
   - Go to Admin Dashboard → Technicians tab
   - Each technician card shows their specialization badge

2. **Edit Specialization**:
   - Click "View Details" on any technician
   - In the modal, click "Edit" next to specialization
   - Select from dropdown or choose "Other" and specify
   - Click "Save"

### For Technicians (Future)

When technician dashboard is implemented:
1. Go to Profile settings
2. Select specialization from dropdown
3. If "Other", specify custom specialization
4. Save changes

## Testing Instructions

### Step 1: Run Database Migration
```sql
-- Open phpMyAdmin
-- Select fixbhai database
-- Run the SQL from database/add_technician_specialization.sql
```

### Step 2: Test Admin View
1. Login as admin
2. Go to Technicians tab
3. Should see specialization badges on technician cards
4. Click "View Details" on a technician
5. Should see specialization section

### Step 3: Test Admin Edit
1. In technician details modal, click "Edit" next to specialization
2. Select a specialization from dropdown
3. Click "Save"
4. Modal should close and page reload
5. Verify specialization updated

### Step 4: Test "Other" Specialization
1. Edit a technician's specialization
2. Select "Other" from dropdown
3. Text input should appear
4. Enter custom specialization (e.g., "Solar Panel Installation")
5. Save and verify it displays correctly

### Step 5: Verify Database
```sql
SELECT id, name, specialization, specialization_other 
FROM users 
WHERE role = 'technician';
```

## API Examples

### Get All Technicians (with specialization)
```javascript
const response = await getAllTechnicians()
// response.data[0].specialization = "Electrical"
// response.data[0].specialization_display = "Electrical"
```

### Update Specialization
```javascript
// Update to predefined specialization
await updateTechnicianSpecialization(123, "Plumbing", null)

// Update to custom specialization
await updateTechnicianSpecialization(123, "Other", "Solar Panel Installation")
```

## UI Screenshots Description

### Technician Card
```
┌─────────────────────────────────┐
│  [Avatar]  John Doe             │
│            john@example.com     │
│            [🔧 Electrical]      │ ← Specialization badge
│                                 │
│  Rating: ⭐ 4.5  Jobs: 25       │
│  ...                            │
└─────────────────────────────────┘
```

### Technician Details Modal
```
┌─────────────────────────────────────────┐
│  Technician Details              [X]    │
├─────────────────────────────────────────┤
│  [Avatar]     Contact Info              │
│   John Doe    Phone: 01234567890        │
│               Email: john@example.com   │
│                                         │
│  Specialization                         │
│  [🔧 Electrical] [Edit]                 │
│                                         │
│  Performance                            │
│  Total Jobs: 25                         │
│  Completion Rate: 95%                   │
└─────────────────────────────────────────┘
```

### Edit Mode
```
┌─────────────────────────────────────────┐
│  Specialization                         │
│  [Dropdown: Select specialization...]   │
│  ▼ Electrical                           │
│    AC Repair                            │
│    Plumbing                             │
│    ...                                  │
│    Other                                │
│                                         │
│  [Save] [Cancel]                        │
└─────────────────────────────────────────┘
```

## Future Enhancements

1. **Technician Profile Page**:
   - Allow technicians to edit their own specialization
   - Show specialization on public profile

2. **Search/Filter by Specialization**:
   - Filter technicians by specialization in admin panel
   - Customer booking form filters by specialization

3. **Multiple Specializations**:
   - Allow technicians to have multiple specializations
   - Store as JSON array or separate table

4. **Specialization Verification**:
   - Require admin approval for specialization changes
   - Add certification upload for specializations

5. **Service Matching**:
   - Auto-assign bookings based on technician specialization
   - Show only relevant technicians for each service

## Files Modified/Created

### Database
- ✅ `database/add_technician_specialization.sql` (NEW)

### Backend
- ✅ `backend/api/users/update-specialization.php` (NEW)
- ✅ `backend/api/admin/technicians.php` (UPDATED)

### Frontend
- ✅ `src/constants/index.js` (UPDATED)
- ✅ `src/api/adminApi.js` (UPDATED)
- ✅ `src/features/dashboard/admin/AdminTechniciansTab.jsx` (UPDATED)

## Status: READY FOR TESTING ✅

The feature is complete and ready to use. Just run the database migration and test!
