# Assets Directory

This directory stores user-uploaded files with automatic compression and organization.

## Directory Structure

```
backend/assets/
└── avatars/
    ├── 1/
    │   └── avatar_1234567890.jpg
    ├── 2/
    │   └── avatar_1234567891.jpg
    └── 3/
        └── avatar_1234567892.jpg
```

## Avatar System

### Features
- **Image Compression**: All images are automatically compressed to ~70% smaller size
- **Standardized Format**: All avatars converted to JPEG for optimal compression
- **Fixed Dimensions**: Resized to 500x500px (maintains aspect ratio)
- **Organized Storage**: Each user has their own directory (`/avatars/{user_id}/`)
- **Automatic Cleanup**: Old avatars are deleted when new ones are uploaded

### Upload Specifications
- **Max File Size**: 5MB (before compression)
- **Allowed Formats**: JPG, JPEG, PNG, GIF
- **Output Format**: JPEG (85% quality)
- **Output Size**: 500x500px max (aspect ratio preserved)
- **Typical Compression**: 70-80% size reduction

### API Endpoints

#### User Endpoints (Self-Service)
- `POST /api/users/upload-avatar.php` - Upload own avatar
- `DELETE /api/users/delete-avatar.php` - Delete own avatar

#### Admin Endpoints (Manage Any User)
- `POST /api/admin/upload-user-avatar.php` - Upload avatar for any user
- `DELETE /api/admin/delete-user-avatar.php` - Delete avatar for any user
- `POST /api/admin/update-user.php` - Update user profile (including all fields)

### Storage Path Format
```
/reactJS/FixBhai/backend/assets/avatars/{user_id}/avatar_{timestamp}.jpg
```

### Database Storage
Avatar URLs are stored in the `users` table:
```sql
avatar_url VARCHAR(500) NULL
```

Example value:
```
/reactJS/FixBhai/backend/assets/avatars/1/avatar_1713000000.jpg
```

### Compression Details
The system uses PHP's GD library to:
1. Load the original image (any format)
2. Resize to max 500x500px (maintains aspect ratio)
3. Convert to JPEG format
4. Apply 85% quality compression
5. Save to user's directory

### Security
- File type validation using MIME type detection
- File size limits enforced
- User-specific directories prevent conflicts
- Authentication required for all operations
- Admin role required for managing other users' avatars

### Permissions
Directory permissions: `0755` (rwxr-xr-x)
- Owner: read, write, execute
- Group: read, execute
- Others: read, execute

### Cleanup Policy
- When a new avatar is uploaded, all old files in the user's directory are deleted
- When an avatar is deleted, the entire user directory is removed
- Backward compatibility: Also cleans up old `/uploads/avatars/` files

### Example Usage

#### User Upload (Frontend)
```javascript
import { uploadAvatar } from '../../api/userApi'

const handleUpload = async (file) => {
  const response = await uploadAvatar(file)
  console.log(response.avatar_url)
  console.log(response.stats) // Shows compression stats
}
```

#### Admin Upload (Frontend)
```javascript
import { uploadUserAvatar } from '../../api/adminApi'

const handleAdminUpload = async (userId, file) => {
  const response = await uploadUserAvatar(userId, file)
  console.log(response.avatar_url)
}
```

### Migration from Old System
Old avatars stored in `/uploads/avatars/` will be automatically cleaned up when users upload new avatars. The system maintains backward compatibility by checking both locations during deletion.

### Troubleshooting

#### Images not displaying
- Check that Apache has read permissions on the assets directory
- Verify the full URL path is correct
- Check browser console for 404 errors

#### Upload fails
- Verify GD library is installed: `php -m | grep -i gd`
- Check PHP upload limits in php.ini:
  - `upload_max_filesize = 10M`
  - `post_max_size = 10M`
- Verify directory permissions: `chmod 755 backend/assets`

#### Compression not working
- Ensure GD library is installed and enabled
- Check PHP error logs for image processing errors
- Verify source image is not corrupted

### Performance
- Average compression: 70-80% size reduction
- Processing time: < 1 second for most images
- Storage savings: Significant for large user bases
- No impact on image quality (85% JPEG quality is visually lossless)
